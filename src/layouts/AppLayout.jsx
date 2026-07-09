import { useContext } from "react"
import { UserContext } from "../App"
import { Navigate, Outlet } from "react-router"
import Sidebar from "../components/Sidebar"

export default function AppLayout() {

    const { userProfile } = useContext(UserContext)

    if (!userProfile?.isProfileCompleted) {
        return <Navigate to="/onboarding" />
    }

    return (
        <main>
            <Sidebar />
            <section className="content">
                <Outlet />
                <div id="portal"></div>
            </section>
        </main>
    )
}