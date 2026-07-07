import { useState, useRef, useContext, useEffect } from "react"
import { uploadImageToFirebase, downloadImageFromFirebase } from "../../utils"
import { UserContext } from "../../App"
import { Plus } from "lucide-react"

export default function ProfilePortfolio() {

    const { user } = useContext(UserContext)
        
    const [profilePic, setProfilePic] = useState(null)
    const [profileType, setProfileType] = useState(null)
    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null)

    async function changeProfilePic(event) {
            
        const file = event.target.files[0]
        const path = `users/${user.uid}/profile.webp`
        
        if (!file) return
        
        try {
            await uploadImageToFirebase(file, path)

            const picUrl = await downloadImageFromFirebase(path)
            setProfilePic(picUrl)
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            <label>Portfolio pictures</label>
            <div>
                <input
                    ref={fileInputRef}
                    onChange={changeProfilePic}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    style={{ display: "none" }}
                />
                <button
                    className="onboarding_profile"
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                >
                    {profilePic
                        ? <img className="onboarding_profile-pic" src={profilePic} />
                        : <Plus className="onboarding_avatar-icon"/>
                        }
                </button>
            </div>
        </>
    )
}