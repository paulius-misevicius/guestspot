import { useState, useRef, useContext } from "react"
import { UserRound, ExternalLink, X } from "lucide-react"
import { UserContext } from "../../App"
import { uploadImageToFirebase, downloadImageFromFirebase } from "../../utils/firebase/storage"
import { Link } from "react-router"

export default function Profile() {

    const { profile, profilePic, setProfilePic, gallery, setGallery } = useContext(UserContext)
    const [isEditingOn, setIsEditingOn] = useState(false)
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
        <>
            <section className="profile_header">
                <div>
                    <label className="sr-only">Profile pic</label>
                    <input
                        ref={fileInputRef}
                        onChange={changeProfilePic}
                        disabled
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
                <div>
                    <div className="profile_username-link">
                        <h3>{profile.name}</h3>
                        <Link 
                            className="profile_instagram"
                            to={`https://instagram.com/${profile.instagram}`}
                            target="_blank"
                        >
                            @{profile.instagram}
                            <ExternalLink className="icon-14px"/>
                        </Link>
                    </div>
                    {profile.locations.map(item => 
                        <span key={item.city}>{item.city}, {item.country}</span>
                    )}
                    <p className="profile_bio">{profile.bio ?? "Share something about yourself!"}</p>
                </div>
            </section>
            <section className="profile_gallery">
                {gallery.map(item => 
                    <div className="input_gallery_item" key={item.id}>
                        <img className="input_gallery_image" src={item.image} />
                    </div>
                    )}
            </section>
        </>
    )
}