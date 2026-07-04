import Sidebar from "./Sidebar"
import { Outlet } from "react-router"

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