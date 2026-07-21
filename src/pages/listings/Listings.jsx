import { useState, useEffect, useContext } from "react"
import { Plus, Archive, ChevronDown, Map } from "lucide-react"
import { getRealTimeCollectionFromFirebase } from "../../utils/firebase/firestore.js"
import { UserContext } from "../../App.jsx"

import Listing from "./components/Listing.jsx"
import ListingModal from "./components/ListingModal.jsx"

export default function Listings() {

  const [isExpiredOpen, setIsExpiredOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [listings, setListings] = useState([])
  const { user } = useContext(UserContext)

  const activeListings = listings.filter(item => item.isActive)
  const expiredListings = listings.filter(item => !item.isActive)

  useEffect(() => {
    const unsubscribe = getRealTimeCollectionFromFirebase("listings", setListings, user.uid)

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
        />
        <section className="user_listings_header">
          <div>
            <h1>My travel plans</h1>
            <p>Cities and dates you're available to guest</p>
          </div>
          <button 
            className="header_new-listing-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="icon-16px icon-stroke" />
            New Listing
          </button>
        </section>
        {listings.length > 0 
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
            <section className="user_listings_expired_section">
              <button 
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
              <p className="user_listings_empty_message">Add a new listing to start matching with studios</p>
              <button 
                className="header_new-listing-btn"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="icon-16px icon-stroke" />
                Add travel plan
              </button>
            </section>
        }
      </>
    )
}