

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
        <div className="app-content-listing">
          <div className="listing-details">
            <h3>Riga, Latvia</h3>
            <p>Sept 5 - 12, 2026</p>
          </div>
          <div className="listing-matches">
            <p>See matches</p>
            <span>3</span>
          </div>
        </div>
        <div className="app-content-listing">
          <div className="listing-details">
            <h3>Tallinn, Estonia</h3>
            <p>Oct 21 - 28, 2026</p>
          </div>
          <div className="listing-matches">
            <p>No matches yet</p>
            <span></span>
          </div>
        </div>
      </section>
    </main>
  )
}