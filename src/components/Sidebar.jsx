export default function Sidebar() {
    return (
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
    )
}