import { useContext, useRef, useState } from "react"
import { Link } from "react-router"
import { X, UserRound, User, Camera, AtSign, ExternalLink, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { nanoid } from "nanoid"
import { TailSpin } from "react-loader-spinner"
import { UserContext } from "../../../App"
import { uploadImageToFirebase, downloadImageFromFirebase, deleteImageFromFirebase, deleteFolderFromFirebase } from "../../../utils/firebase/storage"
import { overwriteFirebaseDoc } from "../../../utils/firebase/firestore"

import Combobox from "../../../components/fields/Combobox"
import Modal from "../../../components/Modal"
import ImageLoader from "../../../components/ImageLoader"
import { checkUsername } from "../../../utils/general"
import { cities } from "../../../utils/cities"
import { IS_DEMO } from "../../../utils/demo"

export default function ProfileModal({isModalOpen, setIsModalOpen}) {

    const { user, profile, setProfile } = useContext(UserContext)
    const profilePicRef = useRef(null)
    const galleryPicRef = useRef(null)

    const [updatedProfile, setUpdatedProfile] = useState(profile)
    const [updatedProfilePic, setUpdatedProfilePic] = useState(profile?.profilePic?.small)
    const [updatedProfilePicFile, setUpdatedProfilePicFile] = useState(null)
    const [updatedGallery, setUpdatedGallery] = useState(profile?.gallery ?? [])
    const [error, setError] = useState(null)

    const [locationCount, setLocationCount] = useState(profile.locations.length)
    const [isLoading, setIsLoading] = useState(false)
    
    const igPreview = `instagram.com/${updatedProfile.instagram}`

    const locationComboboxes = Array.from({length: locationCount}).map((item, index) => 
        <div key={index} className="profile_modal_location">
            {index > 0 && index === (locationCount - 1) &&
                <button 
                    type="button"
                    className="location_delete-btn"
                    onClick={() => {
                        setLocationCount(prev => prev - 1)
                        setUpdatedProfile(prev => (
                            {
                                ...prev, 
                                locations: prev.locations.slice(0, -1)
                            }
                        ))
                    }}
                >
                    <X className="icon-16px icon-stroke" />
                </button>
                }
            <Combobox 
                noLabel={index > 0} 
                data={updatedProfile} 
                setData={setUpdatedProfile} 
                itemList={cities} 
                index={index}
                disabled={index !== (locationCount - 1)}
                error={error}
                setError={setError}
                placeholder="Enter the city in which you're based..."
            />
        </div>
    )

    function previewProfilePic(event) {
        const file = event.target.files[0]
        
        if (!file) return

        const preview = URL.createObjectURL(file)
        setUpdatedProfilePic(preview)
        setUpdatedProfilePicFile(file)
    }
    
    function deleteFromGallery(id) {
        setUpdatedGallery(prev => 
            prev.filter(item => item.id !== id)
        )
    }
    
    function addToGallery(event) {
        const itemId = nanoid()
        const file = event.target.files[0]
        
        if (!file) return

        const preview = URL.createObjectURL(file)
        setUpdatedGallery(prev => [{image: {small: preview}, file, id: itemId}, ...prev])
    }

    async function updateUserProfile(event) {
        event.preventDefault()
        setIsLoading(true)
        let updatedFields = {}
        const filteredLocations = updatedProfile.locations.filter(item => item !== undefined) 

        if (updatedProfile.name === "" || updatedProfile.instagram === "" || filteredLocations.length === 0) {
            setError("These fields cannot be empty!")
            setIsLoading(false)
            return
        }

        try {
            const match = await checkUsername("name", updatedProfile.name)
            if (match && match !== user.uid) {
                setError("Name already taken!")
                setIsLoading(false)
                return
            }
        } catch(error) {
            console.error(error.message)
        }
        try {
            const match = await checkUsername("instagram", updatedProfile.instagram)
            if (match && match !== user.uid) {
                setError("Instagram handle already taken!")
                setIsLoading(false)
                return
            }
        } catch(error) {
            console.error(error.message)
        }

        try {
            if (profile?.profilePic?.small !== updatedProfilePic) {
                if (IS_DEMO) {
                    updatedFields.profilePic = { thumb: updatedProfilePic, small: updatedProfilePic, large: updatedProfilePic }
                } else {
                    await uploadImageToFirebase(updatedProfilePicFile, `users/${user.uid}/profile`)
                    const [thumb, small, large] = await downloadImageFromFirebase(`users/${user.uid}/profile`)
                    updatedFields.profilePic = {thumb: thumb, small: small, large: large}
                }
            }
        } catch (error) {
            console.error(error.message)
        }
        try {
            if (JSON.stringify(profile) !== JSON.stringify(updatedProfile)) {
                updatedFields = {...updatedFields, ...updatedProfile, locations: filteredLocations}
            }
        } catch (error) {
            console.error(error.message)
        }
        try {
            if (JSON.stringify(profile.gallery) !== JSON.stringify(updatedGallery)) {
                const oldGallery = profile?.gallery ?? []

                const oldIds = new Set(oldGallery.map(item => item.id) ?? [])
                const newIds = new Set(updatedGallery.map(item => item.id))

                if (IS_DEMO) {
                    updatedFields.gallery = updatedGallery.map(item => {
                        if (newIds.has(item.id) && oldIds.has(item.id)) {
                            return oldGallery.find(img => img.id === item.id)
                        }
                        return {
                            id: item.id,
                            image: { thumb: item.image.small, small: item.image.small, large: item.image.small }
                        }
                    })
                } else {
                    const deletedItems = oldGallery.filter(item => !newIds.has(item.id))
                    const addedItems = updatedGallery.filter(item => !oldIds.has(item.id))
    
                    await Promise.all(
                        deletedItems.map(item =>
                            deleteFolderFromFirebase(`users/${user.uid}/portfolio/${item.id}`)
                        )
                    )
    
                    const uploadedItems = await Promise.all(
                        addedItems.map(async item => {
                            const path = `users/${user.uid}/portfolio/${item.id}`
                            await uploadImageToFirebase(item.file, path)
                            const [thumb, small, large] = await downloadImageFromFirebase(path)
                            return {id: item.id, image: {thumb: thumb, small: small, large: large}}
                        })
                    )
    
                    const finalGallery = updatedGallery.map(item => {
                        if (newIds.has(item.id) && oldIds.has(item.id)) {
                            return oldGallery.find(img => img.id === item.id)
                        }
                        const uploaded = uploadedItems.find(img => img.id === item.id)
                        return uploaded ?? item
                    })
    
                    updatedFields.gallery = finalGallery
                }
            }

        } catch (error) {
            console.error(error.message)
        }

        try {
            if (Object.keys(updatedFields).length > 0) {
                await overwriteFirebaseDoc("profiles", user.uid, {...profile, ...updatedFields})
                setProfile(prev => ({...prev, ...updatedFields}))
            }
        } catch (error) {
            console.error(error.message)
        }
        
        setIsLoading(false)
        setIsModalOpen(false)
    }

    function onClose() {
        setIsModalOpen(false)
    }

    function moveGalleryItem(array, index, direction) {
        const newIndex = index + direction
        
        if (newIndex < 0 || newIndex >= array.length) return array

        const updated = [...array];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]

        return updated
    }

    if (!isModalOpen) return

    return (
        <Modal
            form
            onSubmit={updateUserProfile}
            onClose={onClose}
            title="Edit profile"
            buttonText="Save changes"
            error={error}
            setError={setError}
            isLoading={isLoading}
            ariaLabel="Save profile edit changes"
        >
            <div className="profile_modal_picture">
                <div className="profile_modal-pic-container">
                    <label className="sr-only">Profile picture</label>
                    <input
                        ref={profilePicRef}
                        onChange={previewProfilePic}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        style={{ display: "none" }}
                    />
                    <button
                        className="profile_modal_pic-btn"
                        type="button"
                        onClick={() => profilePicRef.current.click()}
                    >
                        {updatedProfilePic
                            ?
                                <ImageLoader
                                    border
                                    src={updatedProfilePic}
                                />
                            :
                                <div className="profile_pic-preview profile_pic-placeholder">
                                    <User className="profile_pic-placeholder_icon"/>
                                </div>
                            }
                        <div className="btn-overlay">
                            <Camera className="profile_pic-camera-icon"/>
                        </div>
                    </button>
                </div>
                <div>
                    <p className="profile_picture_title">Profile photo</p>
                    <p>Click the picture to upload a new one.</p>
                </div>
            </div>
            <div className="profile_modal_name-inputs">
                <div className="profile_modal_input">
                    <label htmlFor="name">Name</label>
                    <div className="input-container">
                        <User className="input-icon icon-16px" />
                        <input
                            className={error && (updatedProfile.name === "" || error === "Name already taken!") ? "input_error" : ""}
                            value={updatedProfile.name}
                            onChange={event => {
                                setUpdatedProfile(prev => ({...prev, name: event.target.value}))
                                setError(null)
                            }}
                            name="name"
                            id="name"
                            type="text"
                        />
                    </div>
                </div>
                <div className="profile_modal_input">
                    <label htmlFor="instagram">Instagram handle</label>
                    <div className="input-container">
                        <AtSign className="input-icon icon-14px" />
                        <input
                            className={error && (updatedProfile.instagram === "" || error === "Instagram handle already taken!") ? "input_error" : ""}
                            value={updatedProfile.instagram}
                            onChange={event => {
                                setUpdatedProfile(prev => ({...prev, instagram: event.target.value}))
                                setError(null)
                            }}
                            name="instagram"
                            id="instagram"
                            type="text"
                        />
                    </div>
                </div>
            </div>
            <div className="profile_modal_combobox">
                {locationComboboxes}
                {profile.type === "studio" && updatedProfile.locations.filter(Boolean).length >= locationCount && locationCount < 5 &&
                    <button
                        className="add-location-btn"
                        type="button"
                        onClick={() => setLocationCount(prev => prev + 1)}
                    >
                        Add another
                    </button>
                }
            </div>
            <div className="profile_modal_bio">
                <label htmlFor="bio">Profile bio</label>
                <textarea
                    className="bio_textarea"
                    placeholder={`Say something about ${profile.type === "studio" ? "your studio" : "yourself"}!`}
                    value={updatedProfile.bio}
                    onChange={event => setUpdatedProfile(prev => ({...prev, bio: event.target.value}))}
                    name="bio"
                    id="bio"
                    rows="5"
                    maxLength="165"
                />
                <span>{updatedProfile?.bio?.length ?? 0}/165</span>
            </div>
            <div className="profile_modal_portfolio">
                <div className="portfolio_label-count">
                    <label>Portfolio</label>
                </div>
                <div className="input-gallery">
                    {updatedGallery.length !== 20 &&
                        <div className="input_gallery_item">
                            <input
                                disabled={updatedGallery.length === 20}
                                ref={galleryPicRef}
                                onChange={addToGallery}
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                style={{ display: "none" }}
                            />
                            <button
                                className="input_gallery_add-btn modal_portfolio_image"
                                type="button"
                                disabled={updatedGallery.length === 20}
                                onClick={() => galleryPicRef.current.click()}
                            >
                                <Plus className="input_gallery_plus-icon"/>
                                Add photo
                            </button>
                        </div>
                        }
                    {updatedGallery.map((item, index) =>
                        <div className="input_gallery_item" key={item.id}>
                            <ImageLoader src={item.image.small} />
                            <button
                                onClick={() => deleteFromGallery(item.id)}
                                type="button"
                                className="gallery_item_delete-btn gallery_item_btn"
                            >
                                <Trash2 className="icon-16px icon-stroke"/>
                            </button>
                            <button
                                type="button"
                                className="gallery_item_btn move-left"
                                onClick={() => setUpdatedGallery(prev => moveGalleryItem(prev, index, -1))}
                                disabled={index === 0}
                            >
                                <ChevronLeft className="icon-16px icon-stroke"/>
                            </button>
                            <button
                                type="button"
                                className="gallery_item_btn move-right"
                                onClick={() => setUpdatedGallery(prev => moveGalleryItem(prev, index, 1))}
                                disabled={index === updatedGallery.length - 1}
                            >
                                <ChevronRight className="icon-16px icon-stroke"/>
                            </button>
                        </div>
                    )}
                </div>
                <span>{updatedGallery.length}/20</span>
            </div>
        </Modal>
    )
}
