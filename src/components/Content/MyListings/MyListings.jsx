import ArtistListing from "./ArtistListing.jsx"
import { artistListingsData } from "../../../listings-data.js"

import Header from "./Header"

export default function MyListings() {

    const displayArtistListings = artistListingsData.map(item => 
        <ArtistListing place={item.place} dateRange={item.dateRange}/>
    )

    return (
        <>
          <Header>
            <h2>My travel plans</h2>
            <p>Cities and dates you're available to guest</p>
          </Header>
          <section className="app-content-listings">
            {displayArtistListings}
          </section>
        </>
    )
}