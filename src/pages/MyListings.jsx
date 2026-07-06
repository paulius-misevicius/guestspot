import { useState, useEffect, useContext } from "react"
import { Plus } from "lucide-react"
import Listing from "../components/Listing.jsx"
import NewListingModal from "../components/NewListingModal/NewListingModal.jsx"
import { getRealTimeCollectionFromFirebase } from "../utils.js"
import { UserContext } from "../App.jsx"

export default function MyListings() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [artistListings, setArtistListings] = useState([])
  const { user } = useContext(UserContext)

  useEffect(() => {
    const unsubscribe = getRealTimeCollectionFromFirebase("listings", setArtistListings, user.uid)

    return () => unsubscribe()
  }, [])

  return (
      <>
        <NewListingModal 
          isModalOpen={isModalOpen} 
          setIsModalOpen={setIsModalOpen}
        />
        <div className="content_header">
          <div>
            <h2>My travel plans</h2>
            <p>Cities and dates you're available to guest</p>
          </div>
          <button 
            className="header_create-btn"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="create-btn_plus-icon" />
          </button>
        </div>
        <section className="content_listings">
          {artistListings.map(item => 
            <Listing 
              key={item.id} 
              id={item.id}
              city={item.city}
              country={item.country}
              dateFrom={item.dateFrom}
              dateTo={item.dateTo}
            />
          )}
        </section>
      </>
    )
}