import { createPortal } from "react-dom"
import { useState, useContext, useEffect } from "react"
import { nanoid } from "nanoid"
import { X } from "lucide-react"
import DatePicker from "./inputs/DatePicker"
import Combobox from "./inputs/Combobox"
import { addToFirebase } from "../utils"
import { serverTimestamp } from "firebase/firestore"
import { UserContext } from "../App"
import { getCollectionFromFirebase } from "../utils"

export default function NewListingModal({isModalOpen, setIsModalOpen}) {
    
    
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

                <Combobox data={listingData} setData={setListingData} itemList={locations} />
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