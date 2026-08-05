import { useEffect, useState } from "react"
import { X, CameraOff, MapPin, CalendarDays, ChevronDown, AtSign } from "lucide-react"
import { Link } from "react-router"
import { queryCollectionFromFirebase } from "../../../utils/firebase/firestore"

import Modal from "../../../components/Modal"
import ImageLoader from "../../../components/ImageLoader"
import { translateDates } from "../../../utils/general"
import Lightbox from "../../../components/Lightbox"

export default function BrowseModal({isModalOpen, setIsModalOpen, clickedListing, setClickedListing, padGallery, COPY}) {

    const [isLightboxOn, setIsLightboxOn] = useState(false)
    const [lightboxImage, setLightboxImage] = useState(null)
    const [userListings, setUserListings] = useState([])
    const [isShowingAll, setIsShowingAll] = useState(false)

    const userLocations = clickedListing.profile.locations
    const userType = clickedListing.profile.type
    const galleryLength = clickedListing.profile.gallery.length < 6 ? 3 : 6
    const modalGallery = clickedListing.profile.gallery.slice(0, galleryLength)
    const igIcon = <svg fill="currentColor" viewBox="0 0 32 32" id="Camada_1" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z"></path> <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8 c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z"></path> <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8 c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z"></path> </g> </g></svg>

    useEffect(() => {
        async function getUserListings() {
            try {
                const listings = await queryCollectionFromFirebase("listings", "userId", clickedListing.userId, true)
                const filteredListings = listings.filter(item => item.id !== clickedListing.id)
                setUserListings(filteredListings)
            } catch(error) {
                console.error(error.message)
            }
        }
        getUserListings()
    }, [])

    function onClose() {
        setIsModalOpen(false)
        setClickedListing(null)
    }

    function handleImageClick(index) {
        setIsLightboxOn(true)
        setLightboxImage(index)
    }

    if (!isModalOpen) return

    return (
        <>
            {isLightboxOn && 
                <Lightbox 
                    isLightboxOn={isLightboxOn}
                    setIsLightboxOn={setIsLightboxOn}
                    lightboxImage={lightboxImage}
                    gallery={clickedListing.profile.gallery}
                />
            }
            <Modal
                onClose={onClose}
                isLightboxOn={isLightboxOn}
                title={COPY.TITLE}
                buttonText="Message on Instagram"
                buttonIcon={igIcon}
                ariaLabel={`Open ${clickedListing.profile.name} Instagram in new tab`}
                link={`https://instagram.com/${clickedListing.profile.instagram}`}
            >
                <div className="browse_modal_profile-details">
                    <div className="browse_modal_profile-pic">
                        <ImageLoader
                            src={clickedListing.profile.profilePic.small}
                            alt={`${clickedListing.profile.name} profile picture`}
                        />
                    </div>
                    <div className="browse_modal_listing-details">
                        <h3>{clickedListing.profile.name}</h3>
                        <div className="listing_details_fields">
                            <div className="listing_details_field">
                                <AtSign className="icon-16px icon-stroke-2"/>
                                <p>{clickedListing.profile.instagram}</p>
                            </div>
                            <div className="listing_details_field">
                                <MapPin className="icon-16px icon-stroke-2" />
                                <p className="flex-wrap">
                                    {clickedListing.locations[0].city}, {clickedListing.locations[0].country}
                                    {userLocations.length > 1 && 
                                        <span className="word-nowrap">+{userLocations.length - 1} more</span>
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="browse_modal_listing-header">
                        <p className="browse_modal_label">{COPY.HEADER}</p>
                        {userListings.length > 0 &&
                            <button 
                                onClick={() => setIsShowingAll(prev => !prev)}
                                aria-label={`Show all listings from ${clickedListing.profile.name}`}
                                aria-expanded={isShowingAll}
                            >
                                <ChevronDown className={`icon-14px chevron icon-margin ${isShowingAll ? "chevron-open" : ""}`}/>
                                {isShowingAll ? "Hide" : "Show"} all ({userListings.length + 1})
                            </button>
                        }
                    </div>
                    <div className="browse_modal_listing first-listing">
                        <h4>{clickedListing.locations[0].city}, {clickedListing.locations[0].country}</h4>
                        <div className="listing_details_field">
                            <CalendarDays className="icon-16px icon-margin"/>
                            <p>{clickedListing.dateRange}</p>
                        </div>
                    </div>
                    {isShowingAll &&
                        <>
                            <div className="divider-row">
                                <div className="divider-line"></div>
                                <span className="divider-label">
                                    Other listings
                                </span>
                                <div className="divider-line"></div>
                            </div>
                            <div className="browse_modal_other-listings">
                                {userListings.map(item =>
                                    <div key={item.id} className="browse_modal_listing">
                                        <h4>{item.locations[0].city}, {item.locations[0].country}</h4>
                                        <div className="listing_details_field">
                                            <CalendarDays className="icon-16px icon-margin"/>
                                            <p>{translateDates(item.dateFrom, item.dateTo)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    }
                </div>
                {clickedListing.profile.bio !== "" && clickedListing.profile.bio !== undefined &&
                    <div>
                        <p className="browse_modal_label">About</p>
                        <p>{clickedListing.profile.bio}</p>
                    </div>
                    }
                <div>
                    <p className="browse_modal_label">Portfolio</p>
                    <div className="browse_modal_image-row">
                        {padGallery(modalGallery, galleryLength).map((img, index) =>
                            img.isPlaceholder 
                                ?
                                    <div key={img.id} className="browse_listing_placeholder browse_modal_gallery-img">
                                        <CameraOff className="placeholder-img_icon"/>
                                    </div>
                                :
                                    index === (galleryLength - 1) && clickedListing.profile.gallery.length > galleryLength
                                        ?
                                            <button 
                                                key={img.id} 
                                                className="last-gallery-img browse_modal_gallery-img"
                                                onClick={() => handleImageClick(index)}
                                                aria-label={`Open lightbox modal for image ${index + 1}`}
                                            >
                                                <ImageLoader 
                                                    src={img.image.small} 
                                                    alt={`Portfolio image ${index + 1} from ${clickedListing.profile.name}`}
                                                    className="browse_listing_image"
                                                />
                                                <span className="more-images-hint">
                                                    +{clickedListing.profile.gallery.length - galleryLength}
                                                </span>
                                            </button>
                                        :   
                                            <button 
                                                key={img.id}
                                                className="browse_modal_gallery-img"
                                                onClick={() => handleImageClick(index)}
                                                aria-label={`Open lightbox modal for image ${index + 1}`}
                                            >
                                                <ImageLoader 
                                                    src={img.image.small} 
                                                    alt={`Portfolio image ${index + 1} from ${clickedListing.profile.name}`}
                                                    className="browse_listing_image"
                                                />
                                            </button>
                            )}
                    </div>
                </div>
            </Modal>
        </>
    )
}