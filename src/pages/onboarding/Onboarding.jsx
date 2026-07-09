import { useContext, useState, useEffect } from "react"
import { UserContext } from "../../App"
import { getCollectionFromFirebase, getFirebaseDoc } from "../../utils/firebase/firestore"
import { listAllDirectoryFiles, downloadImageFromFirebase } from "../../utils/firebase/storage"

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
                setProfile({...profileData, userId: user.uid})
                
                const dbLocations = await getCollectionFromFirebase("locations")
                setLocations(dbLocations)
                
                const userGallery = await listAllDirectoryFiles(`users/${user.uid}/portfolio`)
                for (let i = 0; i < userGallery.items.length; i++) {
                    const filePath = userGallery.items[i]._location.path
                    const itemId = filePath.replace(`users/${user.uid}/portfolio/`, "")
                    const imageUrl = await downloadImageFromFirebase(filePath)
                    setGallery(prev => [{image: imageUrl, id: itemId}, ...prev])
                }
                
                const profilePicUrl = await downloadImageFromFirebase(`users/${user.uid}/profile.webp`)
                setProfilePic(profilePicUrl)
            } catch (error) {
                console.error(error.message)
            }
        }
        getInfoForOnboarding()
    }, [])
    
    async function submitAnswer(event) {
        event.preventDefault()
        
        if (currentStep < 7) {
            setCurrentStep(prev => prev + 1)
        }
    }
    
    const STEPS = [
        {key: "welcome", component: Welcome},
        {key: "type", component: Type},
        {key: "name", component: Name},
        {key: "location", component: Location},
        {key: "instagram", component: Instagram},
        {key: "bio", component: Bio},
        {key: "portfolio", component: Portfolio},
        {key: "profilePic", component: ProfilePic}
    ]

    const CurrentComponent = STEPS[currentStep].component

    const stepProps = {
        profile, setProfile, locations, gallery, setGallery, profilePic, setProfilePic
    }
    
    return (
        <div className="onboarding">
            <section className="onboarding_left">
                <h2>Find studios or artists for guestspotting across Europe.</h2>
                <p>Ensure a good first impression by building out your profile.</p>
            </section>
            <section className="onboarding_right">
                <form onSubmit={submitAnswer} id="onboarding">
                    <CurrentComponent {...stepProps} />
                </form>
                <Navigation currentStep={currentStep} setCurrentStep={setCurrentStep}/>
            </section>
        </div>
    )
}