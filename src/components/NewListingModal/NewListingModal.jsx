import { createPortal } from "react-dom"
import { useState, useContext } from "react"
import { nanoid } from "nanoid"
import { X } from "lucide-react"
import { ListingsContext } from "../../App"
import DatePicker from "./DatePicker"
import CityCombobox from "./CityCombobox"

export default function NewListingModal({isModalOpen, setIsModalOpen}) {
    
    if(!isModalOpen) return

    const { setAllListings } = useContext(ListingsContext)
    const [listingData, setListingData] = useState({id: nanoid(), city: "", dateRange: ""})

    function createListing(event) {
        event.preventDefault()

        if (listingData.city === "" || listingData.dateRange === "") {
            console.log("Please fill out the required fields!")
            return
        }

        setAllListings(prev => [listingData, ...prev])
        setIsModalOpen(false)
    }

    return createPortal(
        <>
            <div className="content_overlay"/>
            <form 
                className="listing-modal"
                onSubmit={createListing} 
            >
                <div className="listing-modal_header">
                    <h3>New listing</h3>
                    <button 
                        className="listing-modal_close-btn" 
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="listing-modal_close-icon"/>
                    </button>
                </div>

                <CityCombobox setListingData={setListingData} />
                <DatePicker setListingData={setListingData} />

                <button 
                    className="listing-modal_create-btn"
                >
                    Create listing
                </button>
            </form>
        </>,
        document.getElementById("portal")
    )
}