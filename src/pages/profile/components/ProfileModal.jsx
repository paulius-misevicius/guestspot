import { useContext, useRef, useState } from "react"
import { Link } from "react-router"
import { X, UserRound, User, Camera, AtSign, ExternalLink, Plus } from "lucide-react"
import { nanoid } from "nanoid"
import { TailSpin } from "react-loader-spinner"
import { UserContext } from "../../../App"
import { uploadImageToFirebase, downloadImageFromFirebase, deleteImageFromFirebase } from "../../../utils/firebase/storage"
import { overwriteFirebaseDoc } from "../../../utils/firebase/firestore"

import Combobox from "../../../components/fields/Combobox"
import Modal from "../../../components/Modal"

export default function ProfileModal({isModalOpen, setIsModalOpen}) {

    const { user, profile, setProfile, profilePic, setProfilePic, gallery, setGallery, locations } = useContext(UserContext)
    const profilePicRef = useRef(null)
    const galleryPicRef = useRef(null)

    const [updatedProfile, setUpdatedProfile] = useState(profile)
    const [updatedProfilePic, setUpdatedProfilePic] = useState(profilePic)
    const [updatedProfilePicFile, setUpdatedProfilePicFile] = useState(null)
    const [updatedGallery, setUpdatedGallery] = useState(gallery)

    const [locationCount, setLocationCount] = useState(profile.locations.length)
    const [isLoading, setIsLoading] = useState(false)
    
    const igPreview = `instagram.com/${updatedProfile.instagram}`

    const locationComboboxes = Array.from({length: locationCount}).map((item, index) => 
        <div key={index} className="onboarding_location-multiple">
            {index > 0 && index === (locationCount - 1) &&
                <button 
                    type="button"
                    className="onboarding_location-delete-btn"
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
                    <X className="icon-16px" />
                </button>
                }
            <Combobox 
                noLabel={index > 0} 
                data={updatedProfile} 
                setData={setUpdatedProfile} 
                itemList={locations} 
                index={index}
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
        setUpdatedGallery(prev => [{image: preview, file, id: itemId}, ...prev])
    }

    async function updateUserProfile(event) {
        event.preventDefault()
        setIsLoading(true)
        let updatedFields = {}

        try {
            if (profilePic !== updatedProfilePic) {
                await uploadImageToFirebase(updatedProfilePicFile, `users/${user.uid}/profile.webp`)
                const picUrl = await downloadImageFromFirebase(`users/${user.uid}/profile.webp`)
                updatedFields.profilePic = picUrl
                updatedFields.hasProfilePicture = true
            }
        } catch (error) {
            console.error(error.message)
        }
        try {
            if (JSON.stringify(profile) !== JSON.stringify(updatedProfile)) {
                updatedFields = {...updatedFields, ...updatedProfile}
            }
        } catch (error) {
            console.error(error.message)
        }
        try {
            if (JSON.stringify(gallery) !== JSON.stringify(updatedGallery)) {
                const oldIds = new Set(gallery.map(item => item.id))
                const newIds = new Set(updatedGallery.map(item => item.id))

                const deletedItems = gallery.filter(item => !newIds.has(item.id))
                const addedItems = updatedGallery.filter(item => !oldIds.has(item.id))

                await Promise.all(
                    deletedItems.map(item =>
                        deleteImageFromFirebase(`users/${user.uid}/portfolio/${item.id}`)
                    )
                )

                const uploadedItems = await Promise.all(
                    addedItems.map(async item => {
                        const path = `users/${user.uid}/portfolio/${item.id}`
                        await uploadImageToFirebase(item.file, path)
                        const url = await downloadImageFromFirebase(path)
                        return {id: item.id, image: url}
                    })
                )

                const finalGallery = updatedGallery.map(item => {
                    if (newIds.has(item.id) && oldIds.has(item.id)) {
                        return gallery.find(img => img.id === item.id)
                    }
                    const uploaded = uploadedItems.find(img => img.id === item.id)
                    return uploaded ?? item
                })

                updatedFields.gallery = finalGallery
            }
        } catch (error) {
            console.error (error.message)
        }

        try {
            if (Object.keys(updatedFields).length > 0) {
                await overwriteFirebaseDoc("profiles", user.uid, {...profile, ...updatedFields})
                setProfile(prev => ({...prev, ...updatedFields}))
                if (updatedFields.profilePic) setProfilePic(updatedFields.profilePic)
                if (updatedFields.gallery) setGallery(updatedFields.gallery)
            }
        } catch (error) {
            console.error(error.message)
        }
        
        setIsLoading(false)
        setIsModalOpen(false)
    }

    if (!isModalOpen) return

    return (
        <Modal>
            <form
                onSubmit={updateUserProfile}
                className="listing-modal profile_modal"
            >
                <div className="profile_modal_header">
                    <h3>Edit profile</h3>
                    <button
                        type="button"
                        className="listing-modal_close-btn"
                        onClick={() => {
                            setIsModalOpen(false)
                        }}
                    >
                        <X className="icon-14px"/>
                    </button>
                </div>
                <div className="profile_modal_picture">
                    <div className="profile_modal-pic-container">
                        <label className="sr-only">Profile pic</label>
                        <input
                            ref={profilePicRef}
                            onChange={previewProfilePic}
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            style={{ display: "none" }}
                        />
                        <button
                            className="onboarding_profile profile_modal_pic-btn"
                            type="button"
                            onClick={() => profilePicRef.current.click()}
                        >
                            {profilePic
                                ? <img className="onboarding_profile-pic" src={updatedProfilePic} />
                                : <UserRound className="onboarding_avatar-icon"/>
                                }
                            <Camera className="profile_pic-camera-icon"/>
                        </button>
                    </div>
                    <div>
                        <h4>Profile photo</h4>
                        <p>Click the icon to upload a new one.</p>
                    </div>
                </div>
                <div className="profile_modal_name-instagram">
                    <div className="auth_field">
                        <label htmlFor="name">Name / pseudonym</label>
                        <div className="input-container">
                            <User className="input-icon icon-16px" />
                            <input
                                value={updatedProfile.name}
                                onChange={event => setUpdatedProfile(prev => ({...prev, name: event.target.value}))}
                                name="name"
                                id="name"
                                type="text"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="auth_field">
                            <label htmlFor="instagram">Instagram handle</label>
                            <div className="input-container">
                                <AtSign className="input-icon icon-14px" />
                                <input
                                    value={updatedProfile.instagram}
                                    onChange={event => setUpdatedProfile(prev => ({...prev, instagram: event.target.value}))}
                                    name="instagram"
                                    id="instagram"
                                    type="text"
                                />
                            </div>
                        </div>
                        <span className="ig-preview">
                            <Link
                                to={`https://${igPreview}`}
                                target="_blank"
                                className="profile_instagram"
                            >
                                <ExternalLink className="icon-14px"/>
                                {igPreview}
                            </Link>
                        </span>
                    </div>
                </div>
                <div className="profile_modal_combobox">
                    {locationComboboxes}
                    {profile.type === "studio" && updatedProfile.locations.filter(Boolean).length >= locationCount && locationCount < 5 &&
                        <button
                            className="onboarding_add-location-btn"
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
                        value={updatedProfile.bio}
                        onChange={event => setUpdatedProfile(prev => ({...prev, bio: event.target.value}))}
                        name="bio"
                        id="bio"
                        rows="5"
                    />
                </div>
                <div className="profile_modal_portfolio">
                    <div className="portfolio_label-count">
                        <label>Portfolio</label>
                    </div>
                    <div className="input-gallery">
                        <div className="input_gallery_item">
                            <input
                                disabled={gallery.length === 20}
                                ref={galleryPicRef}
                                onChange={addToGallery}
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                style={{ display: "none" }}
                            />
                            <button
                                className="input_gallery_add-btn modal_portfolio_image"
                                type="button"
                                onClick={() => galleryPicRef.current.click()}
                            >
                            <Plus className="input_gallery_plus-icon"/>
                            </button>
                        </div>
                        {updatedGallery.map(item =>
                            <div className="input_gallery_item" key={item.id}>
                                <img className="input_gallery_image modal_portfolio_image" src={item.image} />
                                <button
                                    onClick={() => deleteFromGallery(item.id)}
                                    type="button"
                                    className="gallery_item_delete-btn"
                                >
                                    <X className="item_delete-btn_icon"/>
                                </button>
                            </div>
                            )}
                    </div>
                    <span>{updatedGallery.length}/20</span>
                </div>
                <button
                    type="submit"
                    className="listing-modal_create-btn"
                >
                    {isLoading ? <TailSpin width="32" height="32" color="var(--text-muted)"/>  : "Save changes"}
                </button>
            </form>
        </Modal>
    )
}
