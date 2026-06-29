import { NavLink } from "react-router"

export default function Sidebar() {
    return (
        <section className="app-sidebar">
            <h1>Guestspot app</h1>
            <div className="app-sidebar-profile">
                <p>Vardenis Pavardenis</p>
            </div>
            <nav className="app-sidebar-nav">
                <NavLink 
                    to="."
                    className={({ isActive }) => isActive ? "active-tab" : null}
                    >My listings</NavLink>
                <NavLink 
                    to="browse"
                    className={({ isActive }) => isActive ? "active-tab" : null}
                    >Browse</NavLink>
                <NavLink 
                    to="profile"
                    className={({ isActive }) => isActive ? "active-tab" : null}
                    >Profile</NavLink>
            </nav>
        </section>
    )
}