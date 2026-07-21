import { X, ChevronLeft, Ellipsis } from "lucide-react"
import { Link } from "react-router"

import Modal from "../../../components/Modal"

export default function BrowseModal({isModalOpen, setIsModalOpen, clickedListing}) {

    console.log(clickedListing)

    if (!isModalOpen) return

    return (
        <Modal>
            <div className="modal browse_modal">
                <div className="browse_modal_header">
                    <button 
                        className="browse_modal_header-btn"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <ChevronLeft className="icon-16px"/>
                    </button>
                    <button className="browse_modal_header-btn">
                        <Ellipsis className="icon-16px"/>
                    </button>
                </div>
                <div className="browse_modal_image-row">
                    {clickedListing.profile.gallery.map(item => 
                        <img key={item.id} src={item.image} className="browse_modal_image"/>
                    )}
                </div>
                <div className="browse_modal_profile-details">
                    <img 
                        className="browse_modal_profile-pic"
                        src={clickedListing.profile.profilePic}
                    />
                    <div>
                        <h3>{clickedListing.profile.name}</h3>
                        <p>{clickedListing.profile.locations[0].city}, {clickedListing.profile.locations[0].country}</p>
                    </div>
                </div>
                <div className="browse_modal_listing-details">
                    <p className="browse_modal_label">Details</p>
                    <div>
                        <p>{clickedListing.dateRange}</p>
                        <p>{clickedListing.locations[0].city}, {clickedListing.locations[0].country}</p>
                    </div>
                </div>
                <div className="browse_modal_listing-about">
                    <p className="browse_modal_label">About</p>
                    <p>{clickedListing.profile.bio}</p>
                </div>
                <a 
                href={`https://instagram.com/${clickedListing.profile.instagram}`}
                target="_blank"
                className="modal_btn"
                >
                    Contact now
                </a>
            </div>
        </Modal>
    )
}