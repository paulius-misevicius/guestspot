import { useContext } from "react"
import { Outlet, Navigate } from "react-router"
import { UserAuthContext } from "../App"

export default function AuthRequired() {

    const user = useContext(UserAuthContext)

    if (!user) {
        return <Navigate to="/log-in" />
    }

    return <Outlet />
}