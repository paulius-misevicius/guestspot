import { useEffect, useContext, useState } from "react"
import { UserContext } from "../../App"
import { CalendarDays, ChevronRight } from "lucide-react"
import { getFirebaseDoc, queryCollectionFromFirebase, fetchBrowseListingsPage } from "../../utils/firebase/firestore"
import { translateDates } from "../../utils/general"
import { TailSpin } from "react-loader-spinner"
import "./browse.css"

import BrowseModal from "./components/BrowseModal"
import Combobox from "../../components/fields/Combobox"
import DatePicker from "../../components/fields/DatePicker"

export default function Browse() {

    const { user, locations } = useContext(UserContext)
    const [browseListings, setBrowseListings] = useState([])
    const [clickedListing, setClickedListing] = useState(null)
    const [lastDoc, setLastDoc] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState({})

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen])

    console.log(filter)

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
        <>
            {isModalOpen && <BrowseModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} clickedListing={clickedListing}/>}
            <section className="browse_header">
                <div>
                    <h1>Browse listings</h1>
                    <p>Find guestspotting opportunities with tattoo studios around Europe.</p>
                </div>
                <div className="browse_filters">
                    <Combobox 
                        itemList={locations} 
                        index={0} 
                        data={filter} 
                        setData={setFilter}
                        placeholder="City"
                        noLabel
                    />
                    <DatePicker 
                        data={filter} 
                        setData={setFilter} 
                        noLabel
                    />
                </div>
            </section>
            <section>
                {browseListings.map(item =>
                    <div key={item.id} className="browse_listing">
                        <div className="browse_listing_image-row">
                            {item.galleryPreview.slice(0, 5).map(item =>
                                <img key={item.id} src={item.image} className="browse_listing_image"/>
                            )}
                        </div>
                        <div className="browse_listing_name-icon">
                            <h3>{item.profile.name}</h3>
                            <button
                                className="browse_listing_chevron-btn"
                                onClick={() => {
                                    setIsModalOpen(true)
                                    setClickedListing(browseListings.find(listing => listing.id === item.id))
                                }}
                            >
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
            </section>
            {hasMore &&
                <button 
                    className="browse_load-more-btn"
                    onClick={loadMoreListings} 
                    disabled={isLoading}
                >
                    {isLoading ? <TailSpin width="32" height="32" color="var(--text-muted)" /> : "Load more"}
                </button>
                }
        </>
    )
}