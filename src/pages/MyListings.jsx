import { useState, useEffect } from "react"

import ArtistListing from "../components/ArtistListing.jsx"
import NewListingModal from "../components/NewListingModal/NewListingModal.jsx"
import { getCollectionFromFirebase } from "../utils.js"

export default function MyListings() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [artistListings, setArtistListings] = useState([])

  useEffect(() => {
    getCollectionFromFirebase("listings")
      .then(data => setArtistListings(data))
  }, [])

  console.log(artistListings)

  return (
      <>
        <NewListingModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        <div className="content_header">
          <div>
            <h2>My travel plans</h2>
            <p>Cities and dates you're available to guest</p>
          </div>
          <button onClick={() => setIsModalOpen(true)}>+</button>
        </div>
        <section className="content_listings">
          {artistListings.map(item => 
            <ArtistListing 
              key={item.id} 
              city={item.city}
              country={item.country}
              dateRange="testDate"
            />
          )}
        </section>
      </>
    )
}