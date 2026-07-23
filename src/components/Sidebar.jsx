import { NavLink } from "react-router"
import { LogOut, MapPin, Search, User } from "lucide-react"
import { signOutUser } from "../utils/firebase/auth"
import { UserContext } from "../App"
import { useContext } from "react"
import "./components.css"
import ImageLoader from "./ImageLoader"

export default function Sidebar() {

    const { user, profile } = useContext(UserContext)

    async function logoutFromAccount() {
        try {
            await signOutUser()
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <section className="sidebar">
            <div className="sidebar_content">
                <h3>Guestspot app</h3>
                <nav className="sidebar_nav">
                    <NavLink
                        to="."
                        className="sidebar_nav_tab"
                    >
                        <MapPin className="icon-18px icon-stroke"/>
                        My listings
                    </NavLink>
                    <NavLink
                        to="browse"
                        className="sidebar_nav_tab"
                    >
                        <Search className="icon-17px icon-stroke"/>
                        Browse
                    </NavLink>
                    <NavLink
                        to="profile"
                        className="sidebar_nav_tab"
                    >
                        <User className="icon-18px icon-stroke"/>
                        Profile
                    </NavLink>
                </nav>
                <div className="sidebar_profile">
                    <div className="profile_pic_container">
                        {profile.profilePic?.small
                            ?
                                <ImageLoader
                                    border
                                    src={profile.profilePic.small}
                                />
                            :
                                <div className="profile_pic-preview profile_pic-placeholder">
                                    <User className="profile_pic-placeholder_icon"/>
                                </div>
                            }
                    </div>
                    <p
                        className="profile_user-email"
                        title={user.email}
                    >
                        {user.email}
                    </p>
                    <button
                        onClick={logoutFromAccount}
                        className="profile_log-out-btn input-icon_right-side input-icon"
                    >
                        <LogOut className="icon-18px icon-stroke" />
                    </button>
                </div>
            </div>
        </section>
    )
}