import { useContext, useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import { UserContext } from "../../App"
import { getCollectionFromFirebase, getFirebaseDoc, addToFirebaseWithId } from "../../utils/firebase/firestore"
import { listAllDirectoryFiles, downloadImageFromFirebase } from "../../utils/firebase/storage"
import { signOutUser } from "../../utils/firebase/auth"

import Navigation from "./components/Navigation"

import Welcome from "./components/steps/Welcome"
import Type from "./components/steps/Type"
import Name from "./components/steps/Name"
import Location from "./components/steps/Location"
import Instagram from "./components/steps/Instagram"
import Bio from "./components/steps/Bio"
import Portfolio from "./components/steps/Portfolio"
import ProfilePic from "./components/steps/ProfilePic"

export default function Onboarding() {

    const { user } = useContext(UserContext)
    const [currentStep, setCurrentStep] = useState(0)
    const [profile, setProfile] = useState({})
    const [locations, setLocations] = useState([])
    const [gallery, setGallery] = useState([])
    const [profilePic, setProfilePic] = useState("")
    
    useEffect(() => {
        async function getInfoForOnboarding() {
            try {
                const profileData = await getFirebaseDoc("profiles", user.uid)
                setProfile({...profileData})
            } catch (error) {
                console.error(error.message)
            }
            
            try {
                const dbLocations = await getCollectionFromFirebase("locations")
                setLocations(dbLocations)
            } catch (error) {
                console.error(error.message)
            }

            try {
                const userGallery = await listAllDirectoryFiles(`users/${user.uid}/portfolio`)
                for (let i = 0; i < userGallery.items.length; i++) {
                    const filePath = userGallery.items[i]._location.path
                    const itemId = filePath.replace(`users/${user.uid}/portfolio/`, "")
                    const imageUrl = await downloadImageFromFirebase(filePath)
                    setGallery(prev => [{image: imageUrl, id: itemId}, ...prev])
                }
            } catch (error) {
                console.error(error.message)
            }
            
            try {
                const profilePicUrl = await downloadImageFromFirebase(`users/${user.uid}/profile.webp`)
                setProfilePic(profilePicUrl)
            } catch (error) {
                console.error(error.message)
            }
        }
        getInfoForOnboarding()
    }, [])
    
    const STEPS = [
        {key: "welcome", component: Welcome},
        {key: "type", component: Type, skippable: false, isFilled: profile.type !== undefined && profile.type !== ""},
        {key: "name", component: Name, skippable: false, isFilled: profile.name !== undefined && profile.name !== ""},
        {key: "location", component: Location, skippable: false, isFilled: profile.city !== undefined && profile.city !== null && profile.city !== ""},
        {key: "instagram", component: Instagram, skippable: false, isFilled: profile.instagram !== undefined && profile.instagram !== ""},
        {key: "bio", component: Bio, skippable: true, isFilled: profile.bio !== undefined && profile.bio !== ""},
        {key: "portfolio", component: Portfolio, skippable: true, isFilled: gallery.length > 0},
        {key: "profilePic", component: ProfilePic, skippable: true, isFilled: profilePic !== undefined && profilePic !== ""}
    ]
    
    const CurrentComponent = STEPS[currentStep].component
    
    const stepProps = {
        profile, setProfile, locations, gallery, setGallery, profilePic, setProfilePic
    }
    
    async function submitAnswer(event) {
        event.preventDefault()

        if (!STEPS[currentStep].isFilled) return
        
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1)
        } 

    }

    async function logoutFromAccount() {
        try {
            await signOutUser()
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <div className="onboarding">
            <section className="onboarding_left">
                <h2>Find studios or artists for guestspotting across Europe.</h2>
                <p>Ensure a good first impression by building out your profile.</p>
                <button 
                    onClick={logoutFromAccount} 
                    className="log-out_btn"
                >
                    <LogOut className="log-out_icon" />
                </button>
            </section>
            <section className="onboarding_right">
                <form onSubmit={submitAnswer} id="onboarding">
                    <CurrentComponent {...stepProps} />
                </form>
                <Navigation 
                    currentStep={currentStep} 
                    setCurrentStep={setCurrentStep} 
                    steps={STEPS} 
                />
            </section>
        </div>
    )
}