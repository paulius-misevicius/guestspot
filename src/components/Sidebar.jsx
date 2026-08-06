import { NavLink } from "react-router"
import { LogOut, MapPin, Search, User } from "lucide-react"
import { signOutUser } from "../utils/firebase/auth"
import { UserContext } from "../App"
import { useContext } from "react"
import "./components.css"
import ImageLoader from "./ImageLoader"
import Logo from "./Logo"
import { IS_DEMO } from "../utils/demo"

export default function Sidebar() {

    const { user, profile, demoProfileType, setDemoProfileType } = useContext(UserContext)

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
                <Logo classes="sidebar_logo" />
                <nav className="sidebar_nav" aria-label="Main navigation">
                    <NavLink
                        to="listings"
                        className="sidebar_nav_tab"
                        aria-label="My listings"
                    >
                        <MapPin className="icon-18px icon-stroke-2"/>
                        My listings
                    </NavLink>
                    <NavLink
                        to="browse"
                        className="sidebar_nav_tab"
                        aria-label="Browse listings"
                    >
                        <Search className="icon-17px icon-stroke"/>
                        Browse
                    </NavLink>
                    <NavLink
                        to="profile"
                        className="sidebar_nav_tab"
                        aria-label="My profile"
                    >
                        <User className="icon-18px icon-stroke"/>
                        Profile
                    </NavLink>
                </nav>
                <div className="margin-top_auto">
                    {IS_DEMO &&
                        <div className="demo_profile-type_switcher">
                            <p>Demo profile type:</p>
                            <div className="demo_switcher_buttons">
                                <button 
                                    onClick={() => setDemoProfileType("artist")}
                                    aria-label="Switch profile type to artist"
                                    className={demoProfileType === "artist" ? "demo_active-button" : undefined}
                                >
                                    Artist
                                </button>
                                <button
                                    onClick={() => setDemoProfileType("studio")}
                                    aria-label="Switch profile type to studio"
                                    className={demoProfileType === "studio" ? "demo_active-button" : undefined}
                                >
                                    Studio
                                </button>
                            </div>
                        </div>
                    }
                    <div className="sidebar_profile">
                        <div className="profile_pic_container">
                            {profile.profilePic?.small
                                ?
                                    <ImageLoader
                                        alt="Profile picture"
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
                            className="trunctuate"
                            title={user.email}
                        >
                            {user.email}
                        </p>
                        <button
                            onClick={logoutFromAccount}
                            aria-label="Log out from account"
                            className={`profile_log-out-btn input-icon_right-side input-icon ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                            disabled={IS_DEMO}
                        >
                            <LogOut className="icon-18px icon-stroke" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}