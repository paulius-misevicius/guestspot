import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useState, useEffect, createContext } from "react"
import { auth } from "./utils/firebase/config"
import { getFirebaseDoc, addToFirebaseWithId, getCollectionFromFirebase } from "./utils/firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"
import { downloadImageFromFirebase, listAllDirectoryFiles } from "./utils/firebase/storage"
import { checkErrorMessage } from "./utils/general"
import { IS_DEMO } from "./utils/demo"
import { signInExistingUser, signOutUser } from "./utils/firebase/auth"

import AuthRequired from "./layouts/AuthRequired"

import AppLayout from "./layouts/AppLayout"
import HomeLayout from "./layouts/HomeLayout"

import Listings from "./pages/listings/Listings"
import Browse from "./pages/browse/Browse"
import Profile from "./pages/profile/Profile"
import Onboarding from "./pages/onboarding/Onboarding"
import OnboardingGate from "./layouts/OnboardingGate"
import Settings from "./pages/settings/Settings"
import PageNotFound from "./components/PageNotFound"
import Auth from "./pages/auth/Auth"
import Home from "./pages/home/Home"
import Account from "./pages/auth/components/Account"
import PrivacyPolicy from "./pages/legal/PrivacyPolicy"
import TermsOfService from "./pages/legal/TermsOfService"
import PasswordReset from "./pages/auth/PasswordReset"

export const UserContext = createContext()

export default function App() {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [listings, setListings] = useState([])
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [theme, setTheme] = useState(profile?.themePref ?? "light")
  const [demoProfileType, setDemoProfileType] = useState((() =>
    IS_DEMO ? (localStorage.getItem("demo_profile_type") ?? "artist") : null
  ))

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    if (!IS_DEMO) return
    
    async function SignInDemoAccount() {
      setIsAuthLoading(true)
      setListings([])
      localStorage.setItem("demo_profile_type", demoProfileType)

      try {
        const demoUser = {
          artist: {
            email: import.meta.env.VITE_DEMO_ARTIST_EMAIL,
            password: import.meta.env.VITE_DEMO_ARTIST_PASSWORD
          },
          studio: {
            email: import.meta.env.VITE_DEMO_STUDIO_EMAIL,
            password: import.meta.env.VITE_DEMO_STUDIO_PASSWORD
          }
        }
        await signInExistingUser(demoUser[demoProfileType].email, demoUser[demoProfileType].password)
      } catch (error) {
        console.error(error.message)
        setIsAuthLoading(false)
      }
    }

    SignInDemoAccount()
  }, [demoProfileType])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)
      
      if (!user) {
        if (IS_DEMO) return
        setProfile(null)
        setIsAuthLoading(false)
        return
      }

      try {
        const profileData = await getFirebaseDoc("profiles", user.uid)
        if (!profileData) {
          if (IS_DEMO) {
            console.error(`No seeded profile doc found for demo user ${user.uid}`)
            setIsAuthLoading(false)
            return
          }
          await addToFirebaseWithId("profiles", user.uid, {isProfileCompleted: false})
          setProfile({isProfileCompleted: false})
        } else {
          setProfile(profileData)
          setTheme(profileData?.themePref ?? "light")
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
    <UserContext.Provider value={{user, isAuthLoading, profile, setProfile, theme, setTheme, demoProfileType, setDemoProfileType, listings, setListings}}>
      <BrowserRouter>
        <Routes key={user?.uid ?? "logged-out"}>

          {!IS_DEMO && (
            <>
              <Route element={<HomeLayout/>}>
                <Route index element={<Home />}/>
                <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
                <Route path="/terms-of-service" element={<TermsOfService />}/>
              </Route>

              <Route path="/auth" element={<Auth />}/>
              <Route path="/password-reset" element={<PasswordReset />}/>
            </>
          )}
          

          <Route element={<AuthRequired />}>
            <Route element={<AppLayout />}>
              <Route path="/listings" element={<Listings />}/>
              <Route path="/browse" element={<Browse />}/>
              <Route path="/profile" element={<Profile />}/>
              <Route path="/settings" element={<Settings />}/>
            </Route>

            {!IS_DEMO && (
              <>
                <Route path="/account" element={<Account />}/>
                
                <Route element={<OnboardingGate />}>
                  <Route path="/onboarding" element={<Onboarding />}/>
                </Route>
              </>
            )}
          </Route>

          <Route 
            path="*" 
            element={IS_DEMO ? <Navigate to="/listings" replace /> : <PageNotFound />}
          />

        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}