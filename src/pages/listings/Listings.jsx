import { useState, useEffect, useContext } from "react"
import { Plus, Archive, ChevronDown, Map } from "lucide-react"
import { getRealTimeCollectionFromFirebase } from "../../utils/firebase/firestore.js"
import { UserContext } from "../../App.jsx"

import Listing from "./components/Listing.jsx"
import ListingModal from "./components/ListingModal.jsx"
import { TailSpin } from "react-loader-spinner"

export default function Listings() {

  const [isExpiredOpen, setIsExpiredOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listings, setListings] = useState([])
  const { user, profile } = useContext(UserContext)

  const activeListings = listings.filter(item => item.isActive)
  const expiredListings = listings.filter(item => !item.isActive)

  const COPY = 
    profile.type === "studio"
      ?
        {
          TITLE: "Open guest spots",
          DESCRIPTION: "Your studio's guest spot openings",
          EMPTY: "Add a new listing to start matching with artists",
          MODAL: {
            COMBOBOX: "We'll have an available guest spot in..."
          }
        }
      :
        {
          TITLE: "My travel plans",
          DESCRIPTION: "When and where you're looking to guestspot",
          EMPTY: "Add a new listing to start matching with studios",
          MODAL: {
            COMBOBOX: "I'm looking to guestspot in..."
          }
        }

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = getRealTimeCollectionFromFirebase("listings", data => {
      setListings(data),
      setIsLoading(false)
    }, user.uid)
    return () => unsubscribe()
  }, [])

  useEffect(() => {
      if (isModalOpen) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = ''; };
  }, [isModalOpen])

  return (
      <>
        <ListingModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen}
          COPY={COPY.MODAL}
        />
        <section>
          <div className="user_listings_header">
            <h1>{COPY.TITLE}</h1>
            <button 
              className="header_new-listing-btn desktop-only"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="icon-16px icon-stroke" />
              New Listing
            </button>
            <button 
              aria-label="Add new listing"
              className="header_new-listing-btn mobile-only btn_mobile-padding"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="icon-16px icon-stroke" />
            </button>
          </div>
          <p>{COPY.DESCRIPTION}</p>
        </section>
        {!isLoading 
          ?
            listings.length > 0
              ?
                <>
                  <section className="user_listings_active">
                  {activeListings.map(item => 
                    <Listing 
                      isActive={item.isActive}
                      key={item.id} 
                      id={item.id}
                      city={item.locations[0].city}
                      country={item.locations[0].country}
                      dateFrom={item.dateFrom}
                      dateTo={item.dateTo}
                    />
                  )}
                </section>
                <section id="expired-listings-section" className="user_listings_expired_section">
                  <button 
                    aria-expanded={isExpiredOpen}
                    aria-controls="expired-listings-section"
                    className="expired_expand_btn"
                    onClick={() => setIsExpiredOpen(prev => !prev)}
                  >
                    <div className="expand_btn_left">
                      <Archive className="icon-14px"/>
                      <p>Expired listings</p>
                    </div>
                    <div className="expand_btn_right">
                      <span>{expiredListings.length}</span>
                      <ChevronDown className={`icon-16px chevron ${isExpiredOpen ? "chevron-open" : ""}`}/>
                    </div>
                  </button>
                  {isExpiredOpen &&
                    <div className="user_listings_expired">
                      {expiredListings.map(item => 
                        <Listing 
                          isActive={item.isActive}
                          key={item.id} 
                          id={item.id}
                          city={item.locations[0].city}
                          country={item.locations[0].country}
                          dateFrom={item.dateFrom}
                          dateTo={item.dateTo}
                        />
                      )}
                    </div>
                    }
                    {isExpiredOpen && expiredListings.length === 0 &&
                      <p className="user_listings_expired_empty">No expired listings!</p>
                      }
                  </section>
                </>
              : 
                <section className="user_listings_empty">
                  <Map className="map-icon"/>
                  <p className="user_listings_empty_message">{COPY.EMPTY}</p>
                  <button 
                    className="header_new-listing-btn"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="icon-16px icon-stroke" />
                    Add listing
                  </button>
                </section>
            : <TailSpin color="var(--text-muted)" wrapperClass="listings_loader"/>
          }
      </>
    )
}