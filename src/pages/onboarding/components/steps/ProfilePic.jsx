import { useState, useRef, useContext, useEffect } from "react"
import { uploadImageToFirebase, downloadImageFromFirebase } from "../../../../utils/firebase/storage"
import { UserContext } from "../../../../App"
import { UserRound } from "lucide-react"

export default function ProfilePic({profilePic, setProfilePic}) {
    
    const { user } = useContext(UserContext)
    
    const fileInputRef = useRef(null)
    
    async function changeProfilePic(event) {
        
        const file = event.target.files[0]
        const path = `users/${user.uid}/profile.webp`
        
        if (!file) return

        const preview = URL.createObjectURL(file)
        setProfilePic(preview)
        
        try {
            await uploadImageToFirebase(file, path)
            const picUrl = await downloadImageFromFirebase(path)
            setProfilePic(picUrl)
        } catch (error) {
            console.error(error.message)
            setProfilePic(null)
        }
    }

    return (
            <div>
                <h1>Add a profile picture or a logo</h1>
                <p>This is the first thing studios see. Make sure to leave a good first impression!</p>
                <label>Profile pic</label>
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
                        : <UserRound className="onboarding_avatar-icon"/>
                        }
                </button>
            </div>
    )
}