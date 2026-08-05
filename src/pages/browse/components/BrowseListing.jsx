import { ChevronRight, CameraOff, MapPin, CalendarDays } from "lucide-react"
import ImageLoader from "../../../components/ImageLoader"

export default function BrowseListing({setIsModalOpen, setClickedListing, gallery, name, location, dateRange, padGallery}) {

    return (
        <button 
            className="browse_listing"
            aria-label={`View listing for ${name} in ${location}, available ${dateRange}`}
            onClick={() => {
                setIsModalOpen(true)
                setClickedListing()
            }}
        >
            <div className="listing_image-grid">
                {padGallery(gallery, 3).map((img, index) =>
                    img.isPlaceholder 
                        ?
                            <div key={img.id} className="browse_listing_placeholder">
                                <CameraOff className="placeholder-img_icon"/>
                            </div>
                        :
                            <ImageLoader 
                                key={img.id} 
                                src={img.image.small} 
                                className="browse_listing_image"
                                aria-label={`Preview image ${index + 1} of ${name} listing in ${location}, available ${dateRange}`}
                            />         
                    )}
            </div>
            <div className="listing_details">
                <div className="listing_name">
                    <h3>{name}</h3>
                    <ChevronRight className="listing_details_btn-icon icon-stroke"/>
                </div>
                <div className="listing_details_fields">
                    <div className="listing_details_field">
                        <MapPin className="icon-16px icon-stroke-2" />
                        <p>{location}</p>
                    </div>
                    <div className="listing_details_field">
                        <CalendarDays className="icon-16px icon-margin"/>
                        <p>{dateRange}</p>
                    </div>
                </div>
            </div>
        </button>
    )
}