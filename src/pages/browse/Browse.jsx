import { useEffect, useContext, useState } from "react"
import { UserContext } from "../../App"
import { CalendarDays, ChevronRight } from "lucide-react"
import { getFirebaseDoc, queryCollectionFromFirebase, fetchBrowseListingsPage } from "../../utils/firebase/firestore"
import { translateDates } from "../../utils/general"
import { TailSpin } from "react-loader-spinner"

export default function Browse() {

    const { user } = useContext(UserContext)
    const [browseListings, setBrowseListings] = useState([])
    const [lastDoc, setLastDoc] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    async function loadMoreListings() {
        if (isLoading || !hasMore) return
        setIsLoading(true)

        try {
            const { listings, newLastDoc, hasMore: more } = await fetchBrowseListingsPage("studio", lastDoc, 5)

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

            setBrowseListings(prev => [...prev, ...formattedListings])
            setLastDoc(newLastDoc)
            setHasMore(more)
        } catch (error) {
            console.error (error.message)
        } finally {
            setIsLoading(false)
        }
    }
    
    useEffect(() => {
        loadMoreListings()
    }, [])

    return (
        <section className="browse_listings-section">
            <div>
                <h2>Browse listings</h2>
                <p>Find guestspotting opportunities with tattoo studios around Europe.</p>
            </div>
            {browseListings.map(item => 
                <div key={item.id} className="browse_listing">
                    <div className="browse_listing_image-row">
                        {item.galleryPreview.slice(0, 5).map(item => 
                            <img key={item.id} src={item.image} className="browse_listing_image"/>
                        )}
                    </div>
                    <div className="browse_listing_name-icon">
                        <h3>{item.profile.name}</h3>
                        <button className="browse_listing_chevron-btn">
                            <ChevronRight />
                        </button>
                    </div>
                    <p>{item.locations[0].city}, {item.locations[0].country}</p>
                    <div className="browse_date-calendar">
                        <CalendarDays className="icon-14px browse_calendar-icon"/>
                        <span className="browse_listing_date-range">{item.dateRange}</span>
                    </div>
                </div>
            )}
            {hasMore &&
                <button 
                    className="browse_load-more-btn"
                    onClick={loadMoreListings} 
                    disabled={isLoading}
                >
                    {isLoading ? <TailSpin width="32" height="32" color="var(--text-muted)" /> : "Load more"}
                </button>
                }
        </section>
    )
}