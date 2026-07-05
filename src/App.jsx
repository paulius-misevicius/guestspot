import { BrowserRouter, Routes, Route } from "react-router"
import { useState, useEffect, createContext } from "react"
import { auth } from "./firebase"
import { onAuthStateChanged } from "firebase/auth"

import AuthRequired from "./components/AuthRequired"

import AppLayout from "./components/AppLayout"
import AuthLayout from "./components/AuthLayout"

import MyListings from "./pages/MyListings"
import Browse from "./pages/Browse"
import Profile from "./pages/Profile"
import Signup from "./pages/auth/Signup"
import Login from "./pages/auth/Login"

export const UserAuthContext = createContext()

export default function App() {

  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user)
      setIsAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <UserAuthContext.Provider value={{user, isAuthLoading}}>
      <BrowserRouter>
        <Routes>

          <Route element={<AuthRequired />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<MyListings />}/>
              <Route path="browse" element={<Browse />}/>
              <Route path="profile" element={<Profile />}/>
            </Route>
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="sign-up" element={<Signup />}/>
            <Route path="log-in" element={<Login />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserAuthContext.Provider>
  )
}