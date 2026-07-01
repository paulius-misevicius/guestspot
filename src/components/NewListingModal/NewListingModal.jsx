import { createPortal } from "react-dom"
import { useState, useContext } from "react"
import { nanoid } from "nanoid"

import { ListingsContext } from "../../App"
import DatePicker from "./DatePicker"
import CityCombobox from "./CityCombobox"

export default function NewListingModal({isModalOpen, setIsModalOpen}) {
    
    if(!isModalOpen) return

    const { setAllListings } = useContext(ListingsContext)
    const [listingData, setListingData] = useState({id: nanoid(), city: "", dateRange: ""})
    console.log(listingData)
    function createListing(event) {
        event.preventDefault()
        console.log("submitted")
        
        setAllListings(prev => [listingData, ...prev])
        setIsModalOpen(false)
    }

    function handleInputChange(event) {
        setListingData(prev => ({...prev, place: event.target.value}))
    }

    return createPortal(
        <>
            <div className="content-overlay"/>
            <form onSubmit={createListing} className="new-listing-modal">
                <div className="modal-header">
                    <h3>New listing</h3>
                    <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>x</button>
                </div>
                <CityCombobox setListingData={setListingData} />
                <div className="modal-dates">
                    <DatePicker setListingData={setListingData} />
                </div>
                <button className="create-listing-btn">Create listing</button>
            </form>
        </>,
        document.getElementById("portal")
    )
}