import { useState, useRef, useContext, useEffect } from "react"
import { User, ExternalLink, X, Pencil, Settings, MapPin, AtSign } from "lucide-react"
import { UserContext } from "../../App"
import { uploadImageToFirebase, downloadImageFromFirebase } from "../../utils/firebase/storage"
import { Link } from "react-router"
import "./profile.css"
import ProfileModal from "./components/ProfileModal"
import ImageLoader from "../../components/ImageLoader"
import Lightbox from "../../components/Lightbox"

export default function Profile() {

    const { profile, profilePic, gallery, setGallery } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLightboxOn, setIsLightboxOn] = useState(false)
    const [lightboxImage, setLightboxImage] = useState(null)

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen])

    function handleImageClick(index) {
        setIsLightboxOn(true)
        setLightboxImage(index)
    }

    return (
        <>
            {isLightboxOn && 
                <Lightbox 
                    isLightboxOn={isLightboxOn}
                    setIsLightboxOn={setIsLightboxOn}
                    lightboxImage={lightboxImage}
                    gallery={profile.gallery}
                />
                }
            {isModalOpen && 
                <ProfileModal 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                />
                }
            <section>
                <div className="profile_header" >
                    <h1>My Profile</h1>
                    <div className="profile_header_buttons">
                        <button
                            className="profile_header_btn profile_edit-btn desktop-only"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Pencil className="icon-16px icon-stroke"/>
                            Edit profile
                        </button>
                        <Link
                            className="profile_header_btn profile_settings-btn"
                            to="../settings"
                        >
                            <Settings className="icon-17px icon-stroke"/>
                        </Link>
                    </div>
                </div>
                <div className="profile_content">
                    <div className="profile_content-top">
                        <div className="profile_picture">
                            {profile.profilePic?.small
                            ?
                                <ImageLoader
                                    border
                                    src={profile.profilePic.small}
                                />
                            :
                                <div className="profile_pic-preview profile_pic-placeholder">
                                    <User className="profile_pic-placeholder_icon"/>
                                </div>
                                }
                        </div>
                        <div className="profile_details">
                            <h2>{profile.name}</h2>
                            <div className="profile_details_fields">
                                <div className="profile_details_field">
                                    <AtSign className="icon-16px icon-stroke-2"/>
                                    <a
                                        href={`https://instagram.com/${profile.instagram}`}
                                        target="_blank"
                                        className="profile_instagram trunctuate"
                                    >
                                        {profile.instagram}
                                    </a>
                                    <ExternalLink className="icon-12px icon-stroke-2"/>
                                </div>
                                <div className="profile_details_field">
                                    <MapPin className="icon-16px icon-stroke-2" />
                                    <p className="flex-wrap">
                                        {profile.locations[0].city}, {profile.locations[0].country}
                                        {profile.locations.length > 1 &&
                                            <span className="word-nowrap">+{profile.locations.length - 1} more</span>
                                        }
                                    </p>
                                </div>
                            </div>
                            <p className="profile_bio desktop-only">
                                {profile.bio ?? "Write a short introduction!"}
                            </p>
                        </div>
                    </div>
                    <p className="profile_bio mobile-only">
                        {profile.bio ?? "Write a short introduction!"}
                    </p>
                    <button
                        className="profile_header_btn profile_edit-btn mobile-only"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Pencil className="icon-16px icon-stroke"/>
                        Edit profile
                    </button>
                </div>
            </section>
            <section className="profile_gallery">
                <p>Portfolio</p>
                <div className="profile_gallery_grid">
                    {profile?.gallery && profile.gallery.map((item, index) =>
                        <button 
                            key={item.id} 
                            className="profile_gallery_image"
                            onClick={() => handleImageClick(index)}
                        >
                            <ImageLoader src={item.image.small} />
                        </button>
                        )}
                </div>
            </section>
            {!profile.gallery || profile.gallery.length === 0 &&
                <p className="empty_section_message">
                    {`Edit your profile to showcase your ${profile.type === "studio" ? "studio's work" : "work"}!`}
                </p>
                }
        </>
    )
}