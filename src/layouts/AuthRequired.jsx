import { useContext, useState, useEffect } from "react"
import { Outlet, Navigate } from "react-router"
import { UserContext } from "../App"
import { TailSpin } from "react-loader-spinner"
import { getFirebaseDoc } from "../utils/firebase/firestore"

export default function AuthRequired() {

    const { user, isAuthLoading } = useContext(UserContext)

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