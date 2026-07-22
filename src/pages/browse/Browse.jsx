import { useEffect, useContext, useState, useRef } from "react"
import { UserContext } from "../../App"
import { CalendarDays, ChevronRight, MapPin, RotateCcw, X, CameraOff } from "lucide-react"
import { getFirebaseDoc, queryCollectionFromFirebase, fetchBrowseListingsPage } from "../../utils/firebase/firestore"
import { translateDates } from "../../utils/general"
import { TailSpin } from "react-loader-spinner"
import "./browse.css"

import BrowseModal from "./components/BrowseModal"
import BrowseListing from "./components/BrowseListing"
import Combobox from "../../components/fields/Combobox"
import DatePicker from "../../components/fields/DatePicker"
import ImageLoader from "../../components/ImageLoader"

export default function Browse() {

    const { user, locations } = useContext(UserContext)
    const [browseListings, setBrowseListings] = useState([])
    const [clickedListing, setClickedListing] = useState(null)
    const [lastDoc, setLastDoc] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filter, setFilter] = useState({})
    const [activeFilter, setActiveFilter] = useState(null)
    const [resetSignal, setResetSignal] = useState(0)
    const sentinelRef = useRef(null)

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isModalOpen])

    useEffect(() => {
        setBrowseListings([])
        setLastDoc(null)
        setHasMore(true)
        setHasLoadedOnce(false)
    }, [activeFilter])

    async function loadMoreListings() {
        if (isLoading || !hasMore) return
        setIsLoading(true)

        try {
            const { listings, newLastDoc, hasMore: more } = await fetchBrowseListingsPage("studio", lastDoc, 5, activeFilter?.locations, activeFilter?.from, activeFilter?.to)

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
            console.error(error.message)
        } finally {
            setIsLoading(false)
            setHasLoadedOnce(true)
        }
    }
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) loadMoreListings()
            },
            {rootMargin: "200px"}
        )
        
        if (sentinelRef.current) observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [lastDoc, hasMore, isLoading])

    return (
        <>
            {isModalOpen && <BrowseModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} clickedListing={clickedListing}/>}
            <section className="browse_header">
                <div>
                    <h1>Browse listings</h1>
                    <p>Find guestspotting opportunities with tattoo studios around Europe.</p>
                </div>
                <div className="browse_filter-row">
                    <div className="browse_filters">
                        <Combobox
                            classes="browse_filter"
                            itemList={locations}
                            index={0}
                            data={filter}
                            setData={setFilter}
                            resetSignal={resetSignal}
                            placeholder="City"
                            noLabel
                        />
                        <DatePicker
                            classes="browse_filter"
                            selected={filter}
                            setSelected={setFilter}
                            noLabel
                            isModal
                        />
                    </div>
                    <div className="browse_filter_buttons">
                        <button 
                            className="filter-reset-btn"
                            onClick={() => {
                                if (Object.keys(filter).length === 0 && !filter?.locations?.[0]) return
                                setFilter({})
                                setActiveFilter(null)
                                setResetSignal(prev => prev + 1)
                            }}
                        >
                            <RotateCcw className="icon-17px icon-stroke"/>
                        </button>
                        <button 
                            className="filter-btn"
                            onClick={() => {
                                if (Object.keys(filter).length === 0 && !filter?.locations?.[0]) return
                                setActiveFilter(filter)
                            }}
                        >
                            Filter
                        </button>
                    </div>
                </div>
                {activeFilter &&
                    <div className="active-filters">
                        {activeFilter?.locations?.[0]?.city && 
                            <button 
                                className="filter-pill"
                                onClick={() => {
                                    setResetSignal(prev => prev + 1)
                                    setFilter(prev => {
                                        const { locations, ...rest } = prev
                                        return rest
                                    })
                                    setActiveFilter(prev => {
                                        const { locations, ...rest } = prev
                                        return rest
                                    })
                                }}
                            >
                                <MapPin className="icon-16px icon-stroke-2" />
                                <span>{`${activeFilter.locations[0].city}, ${activeFilter.locations[0].country}`}</span>
                                <X className="icon-14px filter-pill_clear-icon icon-stroke-2"/>
                            </button>
                            }
                        {activeFilter.from && 
                            <button 
                                className="filter-pill"
                                onClick={() => {
                                    setFilter(prev => {
                                        const { from, to, ...rest } = prev
                                        return rest
                                    })
                                    setActiveFilter(prev => {
                                        const { from, to, ...rest } = prev
                                        return rest
                                    })
                                }}
                            >
                                <CalendarDays className="icon-16px"/>
                                <span>{translateDates(activeFilter.from, activeFilter.to)}</span>
                                <X className="icon-14px filter-pill_clear-icon icon-stroke-2"/>
                            </button>
                            }
                    </div>
                    }
            </section>
            {browseListings.length > 0
                ?
                    <section className="browse_listings">
                        {browseListings.map(item =>
                            <BrowseListing 
                                key={item.id}
                                setIsModalOpen={setIsModalOpen} 
                                setClickedListing={() => setClickedListing(browseListings.find(listing => listing.id === item.id))}
                                gallery={item.galleryPreview.slice(0, 3)}
                                name={item.profile.name}
                                location={`${item.locations[0].city}, ${item.locations[0].country}`}
                                dateRange={item.dateRange}
                            />
                        )}
                    </section>
                :
                    !isLoading && hasLoadedOnce && <p className="browse_listings_empty_message">No listings found for your search!</p>
                }
            {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
            {isLoading && 
                <div className="browse_listings_loader">
                    <TailSpin height="50px" width="50px" color="var(--text-muted)" />
                </div>
            }
        </>
    )
}