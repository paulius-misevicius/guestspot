import ArtistListing from "./ArtistListing.jsx"
import { artistListingsData } from "../listings-data.js"

export default function MyListings() {

    const displayArtistListings = artistListingsData.map(item => 
        <ArtistListing key={item.id} place={item.place} dateRange={item.dateRange}/>
    )

    return (
        <>
          <div className="app-content-header">
            <div>
              <h2>My travel plans</h2>
              <p>Cities and dates you're available to guest</p>
            </div>
            <span>+</span>
          </div>
          <section className="app-content-listings">
            {displayArtistListings}
          </section>
        </>
    )
}