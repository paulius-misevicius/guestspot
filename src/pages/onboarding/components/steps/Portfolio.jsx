import { useState, useRef, useContext, useEffect } from "react"
import { uploadImageToFirebase, downloadImageFromFirebase, deleteImageFromFirebase, listAllDirectoryFiles } from "../../../../utils"
import { UserContext } from "../../../../App"
import { Plus, X } from "lucide-react"
import { nanoid } from "nanoid"

export default function Portfolio({gallery, setGallery}) {

    const { user } = useContext(UserContext)
        
    const fileInputRef = useRef(null)

    async function deleteFromGallery(id) {

        const path = `users/${user.uid}/portfolio/${id}`
        setGallery(prev => 
            prev.filter(item => item.id !== id)
        )

        try {
            await deleteImageFromFirebase(path)
        } catch (error) {
            console.error(error.message)
        }
    }

    async function addToGallery(event) {
            
        const itemId = nanoid()
        const file = event.target.files[0]
        const path = `users/${user.uid}/portfolio/${itemId}`
        
        if (!file) return

        const preview = URL.createObjectURL(file)
        setGallery(prev => [{image: preview, id: itemId}, ...prev])
        
        try {
            await uploadImageToFirebase(file, path)
            const picUrl = await downloadImageFromFirebase(path)
            setGallery(prev => 
                prev.map(item => item.id === itemId ? {image: picUrl, ...item} : item)
            )
        } catch (error) {
            console.error(error.message)
            setGallery(prev => 
                prev.filter(item => item.id !== itemId)
            )
        }
    }

    return (
        <>
            <label>Portfolio pictures</label>
            <div className="input-gallery">
                <div className="input_gallery_item">
                    <input
                        disabled={gallery.length === 20}
                        ref={fileInputRef}
                        onChange={addToGallery}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        style={{ display: "none" }}
                    />
                    <button
                        className="input_gallery_add-btn"
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                    >
                    <Plus className="input_gallery_plus-icon"/>
                    </button>
                </div>
                {gallery.map(item => 
                    <div className="input_gallery_item" key={item.id}>
                        <img className="input_gallery_image" src={item.image} />
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
            <p>{gallery.length}/20</p>
        </>
    )
}