import { createPortal } from "react-dom"
import DatePicker from "./DatePicker"

export default function NewListingModal({isOpen, setIsOpen}) {

    function createListing(event) {
        event.preventDefault()
    }

    if(!isOpen) return
    
    return createPortal(
        <>
            <div className="content-overlay"/>
            <form onSubmit={createListing} className="new-listing-modal">
                <div className="modal-header">
                    <h3>New listing</h3>
                    <button className="close-modal-btn" onClick={() => setIsOpen(false)}>x</button>
                </div>
                <div className="modal-city">
                    <label htmlFor="city">City:</label>
                    <input name="new-listing" id="city" type="text"/>
                </div>
                <div className="modal-dates">
                    <DatePicker />
                </div>
                <button className="create-listing-btn">Create listing</button>
            </form>
        </>,
        document.getElementById("portal")
    )
}