import { useContext, useState } from "react"
import { Navigate } from "react-router"
import { LogOut } from "lucide-react"
import { UserContext } from "../../App"
import { overwriteFirebaseDoc } from "../../utils/firebase/firestore"
import { signOutUser } from "../../utils/firebase/auth"
import { checkUsername } from "../../utils/general"

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

    const { user, profile, setProfile } = useContext(UserContext)
    const [currentStep, setCurrentStep] = useState(0)
    const [error, setError] = useState()

    const STEPS = [
        {key: "welcome", component: Welcome},
        {key: "type", component: Type, skippable: false, isFilled: profile.type && profile.type !== ""},
        {key: "name", component: Name, skippable: false, isFilled: profile.name && profile.name !== ""},
        {key: "location", component: Location, skippable: false, isFilled: profile.locations && profile.locations[0]?.city !== undefined},
        {key: "instagram", component: Instagram, skippable: false, isFilled: profile.instagram && profile.instagram !== ""},
        {key: "bio", component: Bio, skippable: true, isFilled: profile.bio && profile.bio !== ""},
        {key: "portfolio", component: Portfolio, skippable: true, isFilled: profile?.gallery?.length > 0},
        {key: "profilePic", component: ProfilePic, skippable: true, isFilled: profile.profilePic && Object.keys(profile.profilePic) > 0}
    ]
    
    const CurrentComponent = STEPS[currentStep].component
    
    const stepProps = {
        profile, setProfile, error, setError
    }
    
    async function submitAnswer(event) {
        event.preventDefault()
        setError(null)
        let updatedProfile = {...profile}
        
        if (!STEPS[currentStep].isFilled && currentStep !== (STEPS.length - 1)) return

        try {
            if (STEPS[currentStep].key === "name" && updatedProfile.name) {
                const nameMatch = await checkUsername("name", updatedProfile.name)
                if (nameMatch && nameMatch !== user.uid) {
                    setError("Name already taken!")
                    updatedProfile = {... updatedProfile, name: ""}
                    setProfile(updatedProfile)
                    return
                }
            }
            if (STEPS[currentStep].key === "instagram" && updatedProfile.instagram) {
                const instagramMatch = await checkUsername("instagram", updatedProfile.instagram)
                if (instagramMatch && instagramMatch !== user.uid) {
                    setError("Instagram handle already taken!")
                    updatedProfile = {... updatedProfile, instagram: ""}
                    setProfile(updatedProfile)
                    return
                }
            }
        } catch(error) {
            console.error(error.message)
        }

        try {
            if (currentStep < (STEPS.length - 1)) {
                updatedProfile = profile.locations
                    ?   {
                            ...updatedProfile, 
                            locations: updatedProfile.locations.filter(item => item !== undefined)
                        }
                    :   updatedProfile
                setProfile(updatedProfile)
                setCurrentStep(prev => prev + 1)
                await overwriteFirebaseDoc("profiles", user.uid, updatedProfile)
            } else {
                updatedProfile = {...updatedProfile, isProfileCompleted: true}
                setProfile(updatedProfile)
                await overwriteFirebaseDoc("profiles", user.uid, updatedProfile)
                return <Navigate to="/listings" />
            }
        } catch (error) {
            console.error(error.message)
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