import { useContext, useState } from "react"
import { UserContext } from "../App"
import { X } from "lucide-react"
import { Link, Navigate, Outlet } from "react-router"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import { IS_DEMO } from "../utils/demo"
import { TailSpin } from "react-loader-spinner"
import "./layouts.css"

export default function AppLayout() {

    const { profile } = useContext(UserContext)
    const [isDemoBannerActive, setIsDemoBannerActive] = useState(true)

    if (!profile?.isProfileCompleted) {
        if (IS_DEMO) {
            return (
                <div className="loading-screen">
                    <TailSpin width="120" height="120" color="var(--text-muted)" />
                </div>
            )
        }
        return <Navigate to="/onboarding" />
    }

    return (
        <>
            <main>
                <Sidebar />
                <section className="content">
                    {IS_DEMO && isDemoBannerActive &&
                        <div className="demo_banner">
                            <div className="demo_banner_title-icon">
                                <h3>This is a demo version</h3>
                                <button
                                    onClick={() => setIsDemoBannerActive(false)}
                                >
                                    <X className="icon-16px icon-stroke"/>
                                </button>
                            </div>
                            <p>
                                All listing information is fake and for display purposes only.{" "}
                                <a href="https://guestme.eu">Click here to access the live version of Guestme.</a>
                            </p>
                        </div>
                    }
                    <Outlet />
                    <div id="portal"></div>
                </section>
            </main>
            <Navbar />
        </>
    )
}