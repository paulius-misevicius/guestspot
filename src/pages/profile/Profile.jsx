import { useState, useRef, useContext, useEffect } from "react"
import { UserRound, ExternalLink, X, Pencil } from "lucide-react"
import { UserContext } from "../../App"
import { uploadImageToFirebase, downloadImageFromFirebase } from "../../utils/firebase/storage"
import { Link } from "react-router"
import ProfileModal from "./components/ProfileModal"

export default function Profile() {

    const { profile, profilePic, gallery, setGallery } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen]);

    return (
        <>
            {isModalOpen && <ProfileModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
            <section>
                <div className="profile_header" >
                    <h2>My Profile</h2>
                    <button 
                        className="profile_edit-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Pencil className="icon-16px"/>
                    </button>
                </div>
                <div className="profile_header_content">
                    <div>
                        <label className="sr-only">Profile pic</label>
                        <input
                            disabled
                            style={{ display: "none" }}
                        />
                        <button
                            className="onboarding_profile profile_profile-pic"
                            type="button"
                        >
                            {profilePic
                                ? <img className="onboarding_profile-pic" src={profilePic} />
                                : <UserRound className="onboarding_avatar-icon"/>
                                }
                        </button>
                    </div>
                    <div>
                        <h3>{profile.name}</h3>
                        {profile.locations.map(item =>
                            <span key={item.city}>{item.city}, {item.country}</span>
                        )}
                        <p className="profile_bio">{profile.bio ?? "Share something about yourself!"}</p>
                    </div>
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