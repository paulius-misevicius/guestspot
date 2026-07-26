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

export const UserContext = createContext()

export default function App() {

  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [profilePic, setProfilePic] = useState("")
  const [gallery, setGallery] = useState([])
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setUser(user)
      
      if (!user) {
        setProfile(null)
        setIsAuthLoading(false)
        return
      }

      const profileData = await getFirebaseDoc("profiles", user.uid)

      if (!profileData) {
        await addToFirebaseWithId("profiles", user.uid, {isProfileCompleted: false, hasProfilePicture: false})
        setProfile({isProfileCompleted: false})
      } else {
        setProfile(profileData)
      }

      setIsAuthLoading(false)
      
      try {
          if (profileData.hasProfilePicture) {
            const [thumb, small, large] = await downloadImageFromFirebase(`users/${user.uid}/profile`)
            setProfilePic({thumb: thumb, small: small, large: large})
          }
      } catch (error) {
          const translatedError = checkErrorMessage(error)
          console.error(translatedError)
      }

      try {
          const userGallery = await listAllDirectoryFiles(`users/${user.uid}/portfolio`)
          for (let i = 0; i < userGallery.items.length; i++) {
              const filePath = userGallery.items[i]._location.path
              const itemId = filePath.replace(`users/${user.uid}/portfolio/`, "")
              const imageUrl = await downloadImageFromFirebase(filePath)
              if (gallery.some(item => item.image === imageUrl)) return
              setGallery(prev => [{image: imageUrl, id: itemId}, ...prev])
          }
      } catch (error) {
          console.error(error.message)
      }

      try {
          const dbLocations = await getCollectionFromFirebase("locations")
          setLocations(dbLocations)
      } catch (error) {
          console.error(error.message)
      }

    })
    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{user, isAuthLoading, profile, setProfile, profilePic, setProfilePic, gallery, setGallery, locations}}>
      <BrowserRouter>
        <Routes>

          <Route element={<AuthRequired />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="listings" element={<Listings />}/>
              <Route path="browse" element={<Browse />}/>
              <Route path="profile" element={<Profile />}/>
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