import { createPortal } from "react-dom"
import { useState, useContext } from "react"
import { nanoid } from "nanoid"
import { X } from "lucide-react"
import DatePicker from "./DatePicker"
import CityCombobox from "./CityCombobox"
import { addToFirebase } from "../../utils"
import { serverTimestamp } from "firebase/firestore"
import { UserContext } from "../../App"

export default function NewListingModal({isModalOpen, setIsModalOpen}) {
    
    if(!isModalOpen) return

    const [listingData, setListingData] = useState({})
    const [error, setError] = useState(null)
    const { user } = useContext(UserContext)

    function createListing(event) {
        event.preventDefault()

        if (!listingData.city || listingData.dateFrom === undefined) {
            setError("Please fill out the required fields!")
            return
        }
        setError(null)
        addToFirebase("listings", {...listingData, createdAt: serverTimestamp(), userId: user.uid})
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
                    type="submit"
                    className="listing-modal_create-btn"
                >
                    Create listing
                </button>
                {error && <p className="error-msg">{error}</p>}
            </form>
        </>,
        document.getElementById("portal")
    )
}