import { useState, useContext, useEffect } from "react"
import { nanoid } from "nanoid"
import { X } from "lucide-react"
import { UserContext } from "../../../App"
import { serverTimestamp } from "firebase/firestore"
import { getCollectionFromFirebase, addToFirebase } from "../../../utils/firebase/firestore"
import "../listings.css"

import DatePicker from "../../../components/fields/DatePicker"
import Combobox from "../../../components/fields/Combobox"
import Modal from "../../../components/Modal"

export default function ListingModal({isModalOpen, setIsModalOpen}) {
    
    const [listingData, setListingData] = useState({})
    const [locations, setLocations] = useState([])
    const [error, setError] = useState(null)
    const { user, profile } = useContext(UserContext)

    useEffect(() => {
        getCollectionFromFirebase("locations")
        .then(data => setLocations(data))
    }, [])
    
    function createListing(event) {
        event.preventDefault()
        
        if (!listingData.locations?.[0]?.city || listingData.dateFrom === undefined) {
            setError("Please fill out the required fields!")
            return
        }
        setError(null)
        addToFirebase("listings", 
            {
                ...listingData, 
                createdAt: serverTimestamp(), 
                userId: user.uid, 
                type: profile.type
            }
        )
        setListingData({})
        setIsModalOpen(false)
    }

    if(!isModalOpen) return
    
    return (
        <Modal>
            <form
                className="modal"
                onSubmit={createListing}
            >
                <div className="listing-modal_header">
                    <h2>New listing</h2>
                    <button
                        className="listing-modal_close-btn"
                        onClick={() => {
                            setIsModalOpen(false)
                            setListingData({})
                            setError(null)
                        }}
                    >
                        <X className="icon-14px icon-stroke"/>
                    </button>
                </div>
                <div className="listing-modal_inputs">
                    <Combobox 
                        data={listingData} 
                        setData={setListingData} 
                        error={error}
                        setError={setError}
                        itemList={locations} 
                        index={0} 
                        placeholder="I'm looking to guestspot in..."
                    />
                    <DatePicker 
                        data={listingData}
                        setData={setListingData}
                        error={error}
                        setError={setError} 
                        mode="range"
                    />
                </div>
                <div className="listing-modal_footer">
                    <button
                        type="submit"
                        className="listing-modal_create-btn"
                    >
                        Create listing
                    </button>
                    {error && <p className="error-msg">{error}</p>}
                </div>
            </form>
        </Modal>
    )
}