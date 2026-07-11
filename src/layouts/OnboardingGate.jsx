import { useContext } from "react"
import { UserContext } from "../App"
import { Navigate, Outlet } from "react-router"
import { TailSpin } from "react-loader-spinner"

export default function OnboardingGate() {

    const { user, isAuthLoading, profile } = useContext(UserContext)

    if (isAuthLoading) {
        return (
            <div className="loading-screen">
                <TailSpin 
                    width="120"
                    height="120"
                    color="var(--text-muted)"
                />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/log-in"/>
    }

    if (profile.isProfileCompleted) {
        return <Navigate to="/" />
    }

    return <Outlet />
}