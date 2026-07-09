import { Outlet } from "react-router"
import Sidebar from "../components/Sidebar"

export default function AppLayout() {
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