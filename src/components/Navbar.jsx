import { NavLink } from "react-router"
import { MapPin, Search, User } from "lucide-react"

export default function Navbar() {
    return (
        <nav className="navbar">
            <NavLink
                to="listings"
                className="navbar_tab"
            >
                <MapPin className="icon-20px icon-stroke-2"/>
            </NavLink>
            <NavLink
                to="browse"
                className="navbar_tab"
            >
                <Search className="icon-19px icon-stroke"/>
            </NavLink>
            <NavLink
                to="profile"
                className="navbar_tab"
            >
                <User className="icon-20px icon-stroke"/>
            </NavLink>
        </nav>
    )
}