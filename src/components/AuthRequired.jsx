import { useContext } from "react"
import { Outlet, Navigate } from "react-router"
import { UserAuthContext } from "../App"
import { TailSpin } from "react-loader-spinner"

export default function AuthRequired() {

    const { user, isAuthLoading } = useContext(UserAuthContext)

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

    return <Outlet />
}