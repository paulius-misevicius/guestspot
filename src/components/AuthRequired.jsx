import { useContext } from "react"
import { Outlet, Navigate } from "react-router"
import { UserContext } from "../App"
import { TailSpin } from "react-loader-spinner"

export default function AuthRequired() {

    const { user, isAuthLoading, isProfileCompleted } = useContext(UserContext)

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
        return <Navigate to="/log-in" />
    }

    if (user && !isProfileCompleted) {
        return <Navigate to="/onboarding" />
    }

    return <Outlet />
}