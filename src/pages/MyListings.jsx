import { useState, useContext } from "react"

import { ListingsContext } from "../App.jsx"
import ArtistListing from "../components/ArtistListing.jsx"
import NewListingModal from "../components/NewListingModal/NewListingModal.jsx"

export default function MyListings() {

  const { allListings } = useContext(ListingsContext)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const displayArtistListings = allListings.map(item => 
      <ArtistListing key={item.id} city={item.city} dateRange={item.dateRange}/>
  )

  return (
      <>
        <NewListingModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        <div className="app-content-header">
          <div>
            <h2>My travel plans</h2>
            <p>Cities and dates you're available to guest</p>
          </div>
          <button onClick={() => setIsModalOpen(true)}>+</button>
        </div>
        <section className="app-content-listings">
          {displayArtistListings}
        </section>
      </>
    )
}