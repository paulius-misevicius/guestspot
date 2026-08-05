import { NavLink } from "react-router"
import { MapPin, Search, User } from "lucide-react"

export default function Navbar() {
    return (
        <nav className="navbar" aria-label="Main navigation">
            <NavLink
                to="listings"
                className="navbar_tab"
                aria-label="My listings"
            >
                <MapPin className="icon-20px icon-stroke-2"/>
            </NavLink>
            <NavLink
                to="browse"
                className="navbar_tab"
                aria-label="Browse listings"
            >
                <Search className="icon-19px icon-stroke"/>
            </NavLink>
            <NavLink
                to="profile"
                className="navbar_tab"
                aria-label="My profile"
            >
                <User className="icon-20px icon-stroke"/>
            </NavLink>
        </nav>
    )
}