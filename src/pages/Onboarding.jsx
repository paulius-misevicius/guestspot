import { useState, useRef, useContext, useEffect } from "react"
import { uploadImageToFirebase, downloadImageFromFirebase } from "../utils"
import { UserContext } from "../App"
import { UserRound } from "lucide-react"

export default function Onboarding() {
    
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

    if (!profileType) {
        return (
            <div className="onboarding-screen">
                <h2>Which one are you?</h2>
                <div className="onboarding_which-one">
                    <button 
                        className="onboarding_which-one_btn"
                        onClick={() => setProfileType("artist")}
                    >
                        Tattoo artist
                    </button>
                    <button 
                        className="onboarding_which-one_btn"
                        onClick={() => setProfileType("studio")}
                    >
                        Tattoo studio
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="onboarding-screen">
            <div>
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
                <label>Artist name / Pseudonym</label>
                <input />
                <label>Profile bio</label>
                <input />
                <label>Country</label>
                <input />
                <label>City</label>
                <input />
                <label>Instagram username</label>
                <input />
            </div>
        </div>
    )
}