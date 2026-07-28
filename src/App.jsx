import { BrowserRouter, Routes, Route } from "react-router"
import { useState, useEffect, createContext } from "react"
import { auth } from "./utils/firebase/config"
import { getFirebaseDoc, addToFirebaseWithId, getCollectionFromFirebase } from "./utils/firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { downloadImageFromFirebase, listAllDirectoryFiles } from "./utils/firebase/storage"
import { checkErrorMessage } from "./utils/general"

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
import OnboardingGate from "./layouts/OnboardingGate"
import Settings from "./pages/settings/Settings"
import PageNotFound from "./components/PageNotFound"

export const UserContext = createContext()

export default function App() {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)
      
      if (!user) {
        setProfile(null)
        setIsAuthLoading(false)
        return
      }

      try {
        const profileData = await getFirebaseDoc("profiles", user.uid)
        if (!profileData) {
          await addToFirebaseWithId("profiles", user.uid, {isProfileCompleted: false})
          setProfile({isProfileCompleted: false})
        } else {
          setProfile(profileData)
        }
      } catch (error) {
        console.error(error.message)
      } finally {
        setIsAuthLoading(false)
      }

    })
    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{user, isAuthLoading, profile, setProfile}}>
      <BrowserRouter>
        <Routes>

          <Route path="*" element={<PageNotFound />}/>

          <Route element={<AuthRequired />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="listings" element={<Listings />}/>
              <Route path="browse" element={<Browse />}/>
              <Route path="profile" element={<Profile />}/>
              <Route path="settings" element={<Settings />}/>
            </Route>
          </Route>

          <Route element={<OnboardingGate />}>
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