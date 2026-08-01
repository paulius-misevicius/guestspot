import { useContext } from "react"
import { LogOut, User } from "lucide-react"
import { UserContext } from "../App"
import { signOutUser } from "../utils/firebase/auth"
import "../pages/onboarding/onboarding.css"
import Logo from "./Logo"

export default function OnboardingScreen({progressBar = false, children, step, stepCount}) {

    const { user } = useContext(UserContext)

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
                    <Logo classes="onboarding_logo"/>
                    <h2>Find guest spotting opportunities across Europe</h2>
                </div>
                <div className="onboarding_left_content">
                    {progressBar && 
                        <div>
                            <p className="progress-bar_title">Onboarding progress</p>
                            <div className="progress-bar">
                                {Array(stepCount).fill().map((item, index) =>
                                    <div key={index} className={`progress-bar_step ${(index + 1) <= step ? "step_filled" : ""}`}/>
                                )}
                            </div>
                            <p className="progress-bar_count">Step {step} out of {stepCount}</p>
                        </div>
                        }
                    <div className="sidebar_profile">
                        <p
                            className="trunctuate"
                            title={user?.email}
                        >
                            {user?.email}
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
                        <Logo classes="onboarding_logo_mobile"/>
                        <button className="onboarding_mobile_log-out-btn">
                            <LogOut onClick={logoutFromAccount} className="icon-18px"/>
                        </button>
                    </div>
                    {progressBar && 
                        <div className="progress-bar">
                            {Array(stepCount).fill().map((item, index) =>
                                <div key={index} className={`progress-bar_step ${(index + 1) <= step ? "step_filled" : ""}`}/>
                            )}
                        </div>
                        }
                </div>
                {children}
            </section>
        </div>
    )
}