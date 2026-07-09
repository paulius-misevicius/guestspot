import { BrowserRouter, Routes, Route } from "react-router"
import { useState, useEffect, createContext } from "react"
import { auth } from "./utils/firebase/config"
import { onAuthStateChanged } from "firebase/auth"

import AuthRequired from "./layouts/AuthRequired"

import AppLayout from "./layouts/AppLayout"
import AuthLayout from "./layouts/AuthLayout"

import Listings from "./pages/listings/Listings"
import Browse from "./pages/browse/Browse"
import Profile from "./pages/profile/Profile"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"
import PasswordReset from "./pages/auth/PasswordReset"
import Onboarding from "./pages/onboarding/Onboarding"

export const UserContext = createContext()

export default function App() {

  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isProfileCompleted, setIsProfileCompleted] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setIsAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{user, isAuthLoading, isProfileCompleted}}>
      <BrowserRouter>
        <Routes>

          <Route element={<AuthRequired />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Listings />}/>
              <Route path="browse" element={<Browse />}/>
              <Route path="profile" element={<Profile />}/>
            </Route>

            <Route path="onboarding" element={<Onboarding />}/>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="sign-up" element={<Signup />}/>
            <Route path="log-in" element={<Login />}/>
            <Route path="password-reset" element={<PasswordReset />}/>
          </Route>

        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}