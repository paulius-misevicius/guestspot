import { useState, useRef, useContext, useEffect } from "react"
import { uploadImageToFirebase, downloadImageFromFirebase, deleteImageFromFirebase, listAllDirectoryFiles } from "../../utils"
import { UserContext } from "../../App"
import { Plus, X } from "lucide-react"
import { nanoid } from "nanoid"

export default function ImageGallery() {

    const { user } = useContext(UserContext)
        
    const [gallery, setGallery] = useState([])
    const fileInputRef = useRef(null)
    
    useEffect(() => {
        async function fetchFromGallery() {
    
            const dirPath = `users/${user.uid}/portfolio`
    
            try {
                const userFiles = await listAllDirectoryFiles(dirPath)
                for (let i = 0; i < userFiles.items.length; i++) {
                    const filePath = userFiles.items[i]._location.path
                    const itemId = filePath.replace(`users/${user.uid}/portfolio/`, "")
                    const imageUrl = await downloadImageFromFirebase(filePath)
                    setGallery(prev => [{image: imageUrl, id: itemId}, ...prev])
                }
            } catch (error) {
                console.error(error.message)
            }
        }
        fetchFromGallery()
    }, [])

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
                        <button type="button" className="gallery_item_delete-btn">
                            <X 
                                onClick={() => deleteFromGallery(item.id)}
                                className="item_delete-btn_icon"
                            />
                        </button>
                    </div>
                    )}
            </div>
            <p>{gallery.length}/20</p>
        </>
    )
}