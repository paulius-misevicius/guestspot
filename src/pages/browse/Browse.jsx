import { useEffect, useContext, useState } from "react"
import { UserContext } from "../../App"
import { getFirebaseDoc, queryCollectionFromFirebase } from "../../utils/firebase/firestore"
import { translateDates } from "../../utils/general"

export default function Browse() {

    const { user } = useContext(UserContext)
    const [browseListings, setBrowseListings] = useState([])

    useEffect(() => {
        async function getBrowseListings() {
            try {
                const listings = await queryCollectionFromFirebase("listings", "type", "studio")
                const uniqueUserIds = [...new Set(listings.map(item => item.userId))]
                const profileEntries = await Promise.all(
                    uniqueUserIds.map(async userId => {
                        const profile = await getFirebaseDoc("profiles", userId)
                        return [userId, profile]
                    })
                )
                const profileMap = new Map(profileEntries)

                const formattedListings = listings.map(item => {
                    const dateRange = translateDates(item.dateFrom.toDate(), item.dateTo.toDate())
                    const profile = profileMap.get(item.userId)
                    const galleryPreview = profile?.gallery ?? []

                    return {...item, profile, dateRange, galleryPreview}
                })
                console.log(formattedListings)
                setBrowseListings(formattedListings)
            } catch (error) {
                console.error(error.message)
            }
        }
        getBrowseListings()
    }, [])

    return (
        <section className="browse_listings-section">
            {browseListings.map(item => 
                <div key={item.id} className="browse_listing">
                    <div className="browse_listing_image-row">
                        {item.galleryPreview.map(item => 
                            <img key={item.id} src={item.image} className="browse_listing_image"/>
                        )}
                    </div>
                    <h3>{item.profile.name}</h3>
                    <p>{item.locations[0].city}, {item.locations[0].country}</p>
                    <span>{item.dateRange}</span>
                </div>
            )}
        </section>
    )
}