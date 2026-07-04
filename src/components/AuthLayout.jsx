import Auth from "./Auth"
import { Outlet } from "react-router"

export default function AppLayout() {
    return (
        <Auth>
            <Outlet />
        </Auth>
    )
}