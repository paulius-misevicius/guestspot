import { createPortal } from "react-dom"

export default function NewListingModal({isOpen, setIsOpen}) {

    if(!isOpen) return

    return createPortal(
        <>
            <div className="content-overlay"/>
            <form className="new-listing-modal">
                <div className="modal-header">
                    <h3>New listing</h3>
                    <button className="close-modal-btn" onClick={() => setIsOpen(false)}>x</button>
                </div>
                <div className="modal-dates">
                    <div>
                        <label htmlFor="date-from">From:</label>
                        <input id="date-from" className="modal-input" type="date"/>
                    </div>
                    <div>
                        <label htmlFor="date-to">To:</label>
                        <input id="date-to" className="modal-input" type="date"/>
                    </div>
                </div>
                <div className="modal-city">
                    <label htmlFor="city">City:</label>
                    <input id="city" type="text"/>
                </div>
                <button className="create-listing-btn">Create listing</button>
            </form>
        </>,
        document.getElementById("portal")
    )
}