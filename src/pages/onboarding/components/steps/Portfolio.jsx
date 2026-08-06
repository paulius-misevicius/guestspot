import { useState, useContext, useRef } from "react"
import { nanoid } from "nanoid"
import { Plus, Trash2, } from "lucide-react"
import { UserContext } from "../../../../App"
import { addToFirebaseArrayField, overwriteFirebaseDoc } from "../../../../utils/firebase/firestore"
import { deleteFolderFromFirebase, uploadImageToFirebase, downloadImageFromFirebase } from "../../../../utils/firebase/storage"
import ImageLoader from "../../../../components/ImageLoader"

export default function Portfolio({profile, setProfile, COPY}) {

    const { user } = useContext(UserContext)
    const [gallery, setGallery] = useState(profile?.gallery ?? [])
    const galleryPicRef = useRef(null)
    
    async function deleteFromGallery(id) {
        try {
            setGallery(prev => prev.filter(item => item.id !== id))
            const latestDoc = await getFirebaseDoc("profiles", user.uid)
            const updatedGallery = (latestDoc?.gallery ?? []).filter(item => item.id !== id)
            await overwriteFirebaseDoc("profiles", user.uid, {...latestDoc, gallery: updatedGallery})
            setProfile(prev => ({...prev, gallery: updatedGallery}))
            await deleteFolderFromFirebase(`users/${user.uid}/portfolio/${id}`)
        } catch (error) {
            console.error(error.message)
        }
    }

    async function addToGallery(event) {
        const itemId = nanoid()
        const file = event.target.files[0]
        
        if (!file) return

        try {
            const preview = URL.createObjectURL(file)
            setGallery(prev => [{image: {small: preview}, id: itemId}, ...prev])
            const path = `users/${user.uid}/portfolio/${itemId}`
            await uploadImageToFirebase(file, path)
            const [thumb, small, large] = await downloadImageFromFirebase(path)
            const newItem = {id: itemId, image: {thumb, small, large}}
            await addToFirebaseArrayField("profiles", user.uid, "gallery", newItem)
            setProfile(prev => ({...prev, gallery: [...(prev?.gallery ?? []), newItem]}))
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            <h1>{COPY.HEADING}</h1>
            <p>{COPY.DESCRIPTION}</p>
            <div className="profile_modal_portfolio onboarding_input-field">
                <div className="portfolio_label-count">
                    <label>Portfolio</label>
                </div>
                <div className="input-gallery">
                    {gallery.length !== 20 &&
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
                                disabled={gallery.length === 20}
                                aria-disabled={gallery.length === 20}
                                aria-label="Upload new portfolio image"
                                onClick={() => galleryPicRef.current.click()}
                            >
                                <Plus className="input_gallery_plus-icon"/>
                                Add photo
                            </button>
                        </div>
                        }
                    {gallery.map((item, index) =>
                        <div className="input_gallery_item" key={item.id}>
                            <ImageLoader alt={`Portfolio image ${index + 1}`} src={item.image.small} />
                            <button
                                onClick={() => deleteFromGallery(item.id)}
                                type="button"
                                aria-label={`Delete portfolio image ${index + 1}`}
                                className="gallery_item_delete-btn gallery_item_btn"
                            >
                                <Trash2 className="icon-16px icon-stroke"/>
                            </button>
                        </div>
                    )}
                </div>
                <span>{gallery.length}/20</span>
            </div>
        </>
    )
}