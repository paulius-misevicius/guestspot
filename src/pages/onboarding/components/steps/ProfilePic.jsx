import { useState, useRef, useContext } from "react"
import { uploadImageToFirebase, downloadImageFromFirebase } from "../../../../utils/firebase/storage"
import { overwriteFirebaseDoc } from "../../../../utils/firebase/firestore"
import { UserContext } from "../../../../App"
import { User, Camera } from "lucide-react"
import ImageLoader from "../../../../components/ImageLoader"

export default function ProfilePic({setProfile, profile, COPY}) {
    
    const { user } = useContext(UserContext)
    const [profilePic, setProfilePic] = useState(profile?.profilePic?.small)
    const profilePicRef = useRef(null)
        
    async function changeProfilePic(event) {
        const file = event.target.files[0]
        
        if (!file) return

        try {
            const preview = URL.createObjectURL(file)
            setProfilePic(preview)
            await uploadImageToFirebase(file, `users/${user.uid}/profile`)
            const [thumb, small, large] = await downloadImageFromFirebase(`users/${user.uid}/profile`)
            setProfile(prev => (
                {
                    ...prev, 
                    profilePic: {thumb: thumb, small: small, large: large}
                }
            ))
            await overwriteFirebaseDoc("profiles", user.uid, 
                {...profile, profilePic: {thumb: thumb, small: small, large: large}}
            )
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            <h1>{COPY.HEADING}</h1>
            <p>{COPY.DESCRIPTION}</p>
            <div className="profile_modal-pic-container onboarding_input-field">
                <label>Profile picture</label>
                <input
                    ref={profilePicRef}
                    onChange={changeProfilePic}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    style={{ display: "none" }}
                />
                <button
                    className="profile_modal_pic-btn"
                    type="button"
                    onClick={() => profilePicRef.current.click()}
                >
                    {profilePic
                        ?
                            <ImageLoader
                                alt="Profile picture"
                                border
                                src={profilePic}
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
        </>
    )
}