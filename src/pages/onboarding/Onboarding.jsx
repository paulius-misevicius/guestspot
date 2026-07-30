import { useContext, useState } from "react"
import { Navigate } from "react-router"
import { LogOut, User } from "lucide-react"
import { UserContext } from "../../App"
import { overwriteFirebaseDoc } from "../../utils/firebase/firestore"
import { signOutUser } from "../../utils/firebase/auth"
import { checkUsername } from "../../utils/general"
import "./onboarding.css"
import Navigation from "./components/Navigation"

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
    const [error, setError] = useState(null)

    const COPY = 
        profile.type === "studio"
            ?   
                [
                    {HEADING: "What's the name of your studio?", DESCRIPTION: "This name will be visible to tattoo artists."},
                    {HEADING: "Where's your studio located?", DESCRIPTION: "This will let artists know where you're based."},
                    {HEADING: "What's your studio's Instagram username?", DESCRIPTION: "This is how tattoo artists will contact you, so double-check that the link below leads to your studio's profile."},
                    {HEADING: "Write a few words about your studio", DESCRIPTION: "Feel free to mention how long you've been open, the tattoo styles your artists specialize in, or anything else you'd like to share with potential guests."},
                    {HEADING: "Upload pictures of your studio's work", DESCRIPTION: "This will help tattoo artists get a feel for your studio's vibe. Feel free to also add pictures of yourself, your artists or your studio."},
                    {HEADING: "Upload your studio's logo", DESCRIPTION: "This will help artists recognize your studio across platforms right away."}
                ]
            :   
                [
                    {HEADING: "What's your name / pseudonym?", DESCRIPTION: "Enter the name you're best known by as a tattoo artist."},
                    {HEADING: "Where are you currently based?", DESCRIPTION: "This will let studios know where you're coming from."},
                    {HEADING: "What's your Instagram username?", DESCRIPTION: "This is how tattoo studios will contact you, so double-check that the link below leads to your profile."},
                    {HEADING: "Write a few words about yourself as a tattoo artist", DESCRIPTION: "Feel free to mention your experience, style, or anything else you'd like to share with potential hosts."},
                    {HEADING: "Upload pictures of your best work", DESCRIPTION: "This will help tattoo studios get familiar with your style right away and decide if you're the right fit for them."},
                    {HEADING: "Upload a profile picture", DESCRIPTION: "Feel free to use a photo of yourself or your logo. This will help tattoo studios recognize you across platforms"}
                ]
                

    const STEPS = [
        {key: "welcome"},
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
        profile, setProfile, error, setError, COPY: COPY[currentStep - 2]
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
                    updatedProfile = {...updatedProfile, name: ""}
                    setProfile(updatedProfile)
                    return
                }
            }
            if (STEPS[currentStep].key === "instagram" && updatedProfile.instagram) {
                const instagramMatch = await checkUsername("instagram", updatedProfile.instagram)
                if (instagramMatch && instagramMatch !== user.uid) {
                    setError("Instagram handle already taken!")
                    updatedProfile = {...updatedProfile, instagram: ""}
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
                <div className="onboarding_left_intro">
                    <h3>Guestspot app</h3>
                    <h2>Find guest spotting opportunities across Europe</h2>
                </div>
                <div className="onboarding_left_content">
                    <div>
                        <p className="progress-bar_title">Onboarding progress</p>
                        <div className="progress-bar">
                            {Array(STEPS.length - 1).fill().map((item, index) =>
                                <div key={index} className={`progress-bar_step ${(index + 1) <= currentStep ? "step_filled" : ""}`}/>
                            )}
                        </div>
                        <p className="progress-bar_count">Step {currentStep} out of {STEPS.length - 1}</p>
                    </div>
                    <div className="sidebar_profile">
                        <p
                            className="trunctuate"
                            title={user.email}
                        >
                            {user.email}
                        </p>
                        <button
                            onClick={logoutFromAccount}
                            className="profile_log-out-btn input-icon_right-side input-icon"
                        >
                            <LogOut className="icon-16px icon-stroke" />
                        </button>
                    </div>
                </div>
            </section>
            <section className="onboarding_right">
                <div className="onboarding_mobile_header">
                    <div className="onboarding_mobile_header_top">
                        <h3>Guestspot app</h3>
                        <button className="onboarding_mobile_log-out-btn">
                            <LogOut className="icon-18px"/>
                        </button>
                    </div>
                    <div className="progress-bar">
                        {Array(STEPS.length - 1).fill().map((item, index) =>
                            <div key={index} className={`progress-bar_step ${(index + 1) <= currentStep ? "step_filled" : ""}`}/>
                        )}
                    </div>
                </div>
                <form onSubmit={submitAnswer} id="onboarding">
                    {currentStep === 0 
                        ?
                            <div className="onboarding_welcome_step">
                                <h1>Welcome!</h1>
                                <p>Set up your profile now to start connecting with other users.</p>
                                <button 
                                    type="button"
                                    className="onboarding_navigation_btn" 
                                    onClick={() => setCurrentStep(prev => prev + 1)}
                                >
                                    Get started
                                </button>
                            </div>
                        :
                            <CurrentComponent {...stepProps} />
                        }
                </form>
                    {currentStep > 0 
                        ?
                            <Navigation 
                                currentStep={currentStep} 
                                setCurrentStep={setCurrentStep} 
                                steps={STEPS} 
                            />
                        :
                            <div></div>
                        }
            </section>
        </div>
    )
}