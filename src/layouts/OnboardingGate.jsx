import { useContext } from "react"
import { UserContext } from "../App"
import { Navigate, Outlet } from "react-router"

export default function OnboardingGate() {

    const { user } = useContext(UserContext)

    if (!user) {
        return <Navigate to="/log-in"/>
    }

    return <Outlet />
}