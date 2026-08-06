import { useContext, useState, useEffect } from "react"
import { Outlet, Navigate, useLocation } from "react-router"
import { UserContext } from "../App"
import { TailSpin } from "react-loader-spinner"
import { getFirebaseDoc } from "../utils/firebase/firestore"
import { IS_DEMO } from "../utils/demo"

export default function AuthRequired() {

    const { user, isAuthLoading } = useContext(UserContext)

    const location = useLocation()

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
        if (IS_DEMO) {
            return (
                <div className="loading-screen">
                    <TailSpin width="120" height="120" color="var(--text-muted)" />
                </div>
            )
        }
        return <Navigate to="/auth" />
    }

    // if (!IS_DEMO && !user.emailVerified && location.pathname !== "/account") {
    //     return <Navigate to="/account"/>
    // }

    return <Outlet />
}