import { useState } from "react"

import ArtistListing from "../components/ArtistListing.jsx"
import { artistListingsData } from "../listings-data.js"
import NewListingModal from "../components/NewListingModal.jsx"

export default function MyListings() {

  const [isModalOpen, setModalOpen] = useState(false)

  const displayArtistListings = artistListingsData.map(item => 
      <ArtistListing key={item.id} place={item.place} dateRange={item.dateRange}/>
  )

  return (
      <>
        <NewListingModal isOpen={isModalOpen} setIsOpen={setModalOpen}/>
        <div className="app-content-header">
          <div>
            <h2>My travel plans</h2>
            <p>Cities and dates you're available to guest</p>
          </div>
          <button onClick={() => setModalOpen(true)}>+</button>
        </div>
        <section className="app-content-listings">
          {displayArtistListings}
        </section>
      </>
    )
}