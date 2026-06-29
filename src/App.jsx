import { artistListingsData } from "./listings-data"
import ArtistListing from "./components/ArtistListing"

export default function App() {

  return (
    <main>
      <section className="app-sidebar">
        <h1>Guestspot app</h1>
        <div className="app-sidebar-profile">
          <p>Vardenis Pavardenis</p>
        </div>
        <nav className="app-sidebar-nav">
            <a href="#">My listings</a>
            <a href="#">Browse</a>
            <a href="#">Profile</a>
        </nav>
      </section>
      <section className="app-content">
        <div className="app-content-header">
          <div>
            <h2>My travel plans</h2>
            <p>Cities and dates you're available to guest</p>
          </div>
          <span>+</span>
        </div>
          <ArtistListing />
          <ArtistListing />
          <ArtistListing />
      </section>
    </main>
  )
}