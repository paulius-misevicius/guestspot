import { useContext } from "react"
import { UserContext } from "../App"
import { Navigate, Outlet } from "react-router"
import { TailSpin } from "react-loader-spinner"

export default function OnboardingGate() {

    const { user, isAuthLoading, profile } = useContext(UserContext)

    if (isAuthLoading) {
        return <TailSpin wrapperClass="listings_loader" color="var(--text-muted)"/>
    }

    if (!user) {
        return <Navigate to="/auth"/>
    }
    if (!profile) {
        return <TailSpin wrapperClass="listings_loader" color="var(--text-muted)"/>
    }

    if (profile.isProfileCompleted) {
        return <Navigate to="/listings" />
    }

    return <Outlet />
}