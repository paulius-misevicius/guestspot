import { useState, useContext, useEffect } from "react"
import { nanoid } from "nanoid"
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
        
        if (!listingData.locations?.[0]?.city || listingData.from === undefined) {
            setError("Please fill out the required fields!")
            return
        }
        setError(null)
        const { from, to, ...rest } = listingData
        addToFirebase("listings", 
            {
                ...rest, 
                createdAt: serverTimestamp(), 
                userId: user.uid, 
                type: profile.type,
                dateFrom: from,
                dateTo: to
            }
        )
        setListingData({})
        setIsModalOpen(false)
    }

    function onClose() {
        setIsModalOpen(false)
        setListingData({})
        setError(null)
    }

    if(!isModalOpen) return
    
    return (
        <Modal 
            form 
            title="New listing"
            buttonText="Create Listing"
            onSubmit={createListing} 
            onClose={onClose} 
            error={error}
        >
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
                selected={listingData}
                setSelected={setListingData}
                error={error}
                setError={setError} 
                mode="range"
            />
        </Modal>
    )
}