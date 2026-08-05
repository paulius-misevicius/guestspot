import { useEffect, useContext, useState, useRef } from "react"
import { UserContext } from "../../App"
import { CalendarDays, ChevronRight, MapPin, RotateCcw, X, CameraOff } from "lucide-react"
import { getFirebaseDoc, queryCollectionFromFirebase, fetchBrowseListingsPage } from "../../utils/firebase/firestore"
import { translateDates, filterFromSearchParams, filterToSearchParams, toDateParam } from "../../utils/general"
import { TailSpin } from "react-loader-spinner"
import { useSearchParams } from "react-router"
import "./browse.css"
import { cities } from "../../utils/cities"

import BrowseModal from "./components/BrowseModal"
import BrowseListing from "./components/BrowseListing"
import Combobox from "../../components/fields/Combobox"
import DatePicker from "../../components/fields/DatePicker"
import ImageLoader from "../../components/ImageLoader"

export default function Browse() {

    const { user, profile } = useContext(UserContext)
    const [browseListings, setBrowseListings] = useState([])
    const [clickedListing, setClickedListing] = useState(null)
    const [lastDoc, setLastDoc] = useState(null)
    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [filter, setFilter] = useState(() => filterFromSearchParams(searchParams))
    const [activeFilter, setActiveFilter] = useState(() => {
        const initial = filterFromSearchParams(searchParams)
        return Object.keys(initial).length > 0 ? initial : null
    })
    const [resetSignal, setResetSignal] = useState(0)
    const sentinelRef = useRef(null)

    const COPY = 
    profile.type === "studio"
      ?
        {
          TITLE: "Browse artist listings",
          DESCRIPTION: "Find artists that are looking to guestspot from all over Europe",
          LISTING: {
            TITLE: "Artist's profile",
            HEADER: "Travel plans"
          }
        }
      :
        {
          TITLE: "Browse studio listings",
          DESCRIPTION: "Find guestspotting opportunities from studios all over Europe",
          LISTING: {
            TITLE: "Studio's profile",
            HEADER: "Open spots"
          }
        }

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
        const fetchUserType = profile.type === "studio" ? "artist" : "studio"

        try {
            const { listings, newLastDoc, hasMore: more } = await fetchBrowseListingsPage(
                {
                    userType: fetchUserType, 
                    lastDoc, 
                    pageSize: 5, 
                    location: activeFilter?.locations, 
                    dateFrom: activeFilter?.from, 
                    dateTo: activeFilter?.to
                }
            )

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

    function padGallery(images, count) {
        const padded = [...images]
        while (padded.length < count) {
            padded.push({id: `placeholder-${padded.length}`, isPlaceholder: true})
        }
        return padded
    }

    return (
        <>
            {isModalOpen && 
                <BrowseModal 
                    isModalOpen={isModalOpen} 
                    setIsModalOpen={setIsModalOpen} 
                    clickedListing={clickedListing}
                    setClickedListing={setClickedListing}
                    padGallery={padGallery}
                    COPY={COPY.LISTING}
                />
                }
            <section className="browse_header">
                <div>
                    <h1>{COPY.TITLE}</h1>
                    <p>{COPY.DESCRIPTION}</p>
                </div>
                <div className="browse_filter-row">
                    <div className="browse_filters">
                        <Combobox
                            classes="browse_filter"
                            itemList={cities}
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
                            aria-label="Reset filters"
                            onClick={() => {
                                if (Object.keys(filter).length === 0 && !filter?.locations?.[0]) return
                                setFilter({})
                                setActiveFilter(null)
                                setResetSignal(prev => prev + 1)
                                setSearchParams({})
                            }}
                        >
                            <RotateCcw className="icon-17px icon-stroke"/>
                        </button>
                        <button 
                            className="filter-btn"
                            aria-label="Apply filter"
                            onClick={() => {
                                if (Object.keys(filter).length === 0 && !filter?.locations?.[0]) return
                                setActiveFilter(filter)
                                setSearchParams(filterToSearchParams(filter))
                            }}
                        >
                            Filter
                        </button>
                    </div>
                </div>
                {activeFilter && Object.keys(filter).length !== 0 &&
                    <div className="active-filters">
                        {activeFilter?.locations?.[0]?.city && 
                            <button 
                                className="filter-pill"
                                aria-label={`Remove ${activeFilter.locations[0].city}, ${activeFilter.locations[0].country} filter`}
                                onClick={() => {
                                    const { locations, ...rest } = filter
                                    setResetSignal(prev => prev + 1)
                                    setFilter(rest)
                                    setActiveFilter(prev => {
                                        const { locations, ...restActive } = prev
                                        return restActive
                                    })
                                    setSearchParams(filterToSearchParams(rest))
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
                                aria-label="Remove date filter"
                                onClick={() => {
                                    setFilter(prev => {
                                        const { from, to, ...rest } = prev
                                        setSearchParams(filterToSearchParams(rest))
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
                                padGallery={padGallery}
                            />
                        )}
                    </section>
                :
                    !isLoading && hasLoadedOnce && 
                        <p className="empty_section_message" role="status">
                            No listings found for your search!
                        </p>
                }
            {hasMore && <div aria-hidden="true" ref={sentinelRef} style={{ height: 1 }} />}
            {isLoading && <TailSpin wrapperClass="listings_loader" color="var(--text-muted)" />}
        </>
    )
}