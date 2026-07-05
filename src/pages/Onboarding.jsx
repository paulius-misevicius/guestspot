import { useState } from "react"

export default function Onboarding() {

    const [profileType, setProfileType] = useState(null)

    if (!profileType) {
        return (
            <div className="onboarding-screen">
                <h2>Which one are you?</h2>
                <div className="onboarding_which-one">
                    <button 
                        className="onboarding_which-one_btn"
                        onClick={() => setProfileType("artist")}
                    >
                        Tattoo artist
                    </button>
                    <button 
                        className="onboarding_which-one_btn"
                        onClick={() => setProfileType("studio")}
                    >
                        Tattoo studio
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="onboarding-screen">
            <div>
                <label>Username</label>
                <input />
                <label>Profile bio</label>
                <input />
                <label>Country</label>
                <input />
                <label>City</label>
                <input />
                <label>Instagram username</label>
                <input />
            </div>
        </div>
    )
}