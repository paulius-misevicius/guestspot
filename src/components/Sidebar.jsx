import { NavLink } from "react-router"

export default function Sidebar() {
    return (
        <section className="sidebar">
            <h1>Guestspot app</h1>
            <div className="sidebar_profile">
                <p>Vardenis Pavardenis</p>
            </div>
            <nav className="sidebar_nav">
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