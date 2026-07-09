import { NavLink } from "react-router"
import { LogOut } from "lucide-react"
import { signOutUser } from "../utils/firebase/auth"
import { UserContext } from "../App"
import { useContext } from "react"

export default function Sidebar() {

    const { user } = useContext(UserContext)

    async function logoutFromAccount() {
        try {
            await signOutUser()
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <section className="sidebar">
            <h1>Guestspot app</h1>
            <div className="sidebar_profile">
                <p>{user.email}</p>
                <button 
                    onClick={logoutFromAccount} 
                    className="log-out_btn"
                >
                    <LogOut className="log-out_icon" />
                </button>
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