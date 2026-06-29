import Sidebar from "./Sidebar"
import { Outlet } from "react-router"

export default function Layout() {
    return (
        <main>
            <Sidebar />
            <section className="app-content">
                <Outlet />
            </section>
        </main>
    )
}