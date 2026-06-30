import { createPortal } from "react-dom"
import { useState, useContext } from "react"
import { nanoid } from "nanoid"

import { ListingsContext } from "../../App"
import DatePicker from "./DatePicker"
import CityCombobox from "./CityCombobox"

export default function NewListingModal({isOpen, setIsOpen}) {
    
    if(!isOpen) return

    const { setAllListings } = useContext(ListingsContext)
    const [listingData, setListingData] = useState({id: nanoid(), place: "", dateRange: ""})

    console.log(listingData)

    function createListing(event) {
        event.preventDefault()
        console.log("submitted")
        
        setAllListings(prev => [listingData, ...prev])
        setIsOpen(false)
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
                    <button className="close-modal-btn" onClick={() => setIsOpen(false)}>x</button>
                </div>
                <CityCombobox />
                {/* <div className="modal-city">
                    <label htmlFor="city">City:</label>
                    <input name="new-listing" id="city" type="text" value={listingData.place} onChange={handleInputChange}/>
                </div> */}
                <div className="modal-dates">
                    <DatePicker setListingData={setListingData} />
                </div>
                <button className="create-listing-btn">Create listing</button>
            </form>
        </>,
        document.getElementById("portal")
    )
}