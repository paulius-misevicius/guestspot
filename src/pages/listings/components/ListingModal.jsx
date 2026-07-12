import { createPortal } from "react-dom"
import { useState, useContext, useEffect } from "react"
import { nanoid } from "nanoid"
import { X } from "lucide-react"
import { UserContext } from "../../../App"
import { serverTimestamp } from "firebase/firestore"
import { getCollectionFromFirebase, addToFirebase } from "../../../utils/firebase/firestore"

import DatePicker from "./DatePicker"
import Combobox from "../../../components/fields/Combobox"

export default function ListingModal({isModalOpen, setIsModalOpen}) {
    
    
    const [listingData, setListingData] = useState({})
    const [locations, setLocations] = useState([])
    const [error, setError] = useState(null)
    const { user } = useContext(UserContext)
    
    useEffect(() => {
        getCollectionFromFirebase("locations")
        .then(data => setLocations(data))
    }, [])
    
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

    if(!isModalOpen) return
    
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
                        <X className="icon-14px"/>
                    </button>
                </div>

                <Combobox data={listingData} setData={setListingData} itemList={locations} placeholder="I'm looking to guestspot in..."/>
                <DatePicker setData={setListingData} />

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