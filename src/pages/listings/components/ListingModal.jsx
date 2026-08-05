import { useState, useContext, useEffect } from "react"
import { nanoid } from "nanoid"
import { UserContext } from "../../../App"
import { serverTimestamp } from "firebase/firestore"
import { getCollectionFromFirebase, addToFirebase } from "../../../utils/firebase/firestore"
import "../listings.css"
import { cities } from "../../../utils/cities"

import DatePicker from "../../../components/fields/DatePicker"
import Combobox from "../../../components/fields/Combobox"
import Modal from "../../../components/Modal"
import { checkErrorMessage } from "../../../utils/general"

export default function ListingModal({isModalOpen, setIsModalOpen, COPY}) {
    
    const [listingData, setListingData] = useState({})
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { user, profile } = useContext(UserContext)
    
    async function createListing(event) {
        event.preventDefault()
        setIsLoading(true)
        
        if (!listingData.locations?.[0]?.city || listingData.from === undefined) {
            setError("Please fill out the required fields!")
            setIsLoading(false)
            return
        }
        setError(null)
        try {
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
        } catch (error) {
            const errMsg = checkErrorMessage(error)
            setError(errMsg)
        } finally {
            setIsModalOpen(false)
            setIsLoading(false)
        }
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
            isLoading={isLoading}
        >
            {profile.type === "studio"
                ?
                    <Combobox 
                        studio
                        data={listingData} 
                        setData={setListingData} 
                        error={error}
                        setError={setError}
                        itemList={profile.locations} 
                        index={0} 
                        placeholder={COPY.COMBOBOX}
                    />
                :
                    <Combobox 
                        data={listingData} 
                        setData={setListingData} 
                        error={error}
                        setError={setError}
                        itemList={cities} 
                        index={0} 
                        placeholder={COPY.COMBOBOX}
                    />
            }
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