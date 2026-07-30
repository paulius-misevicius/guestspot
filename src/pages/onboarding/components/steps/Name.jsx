import { User } from "lucide-react"

export default function Name({profile, setProfile, error, setError, COPY}) {
    return (
        <>
            <h1>{COPY.HEADING}</h1>
            <p>{COPY.DESCRIPTION}</p>
            <div className="onboarding_input-field">
                <label htmlFor="name">Name</label>
                <div className="input-container">
                    <User className="input-icon icon-16px" />
                    <input 
                        value={profile.name || ""}
                        onChange={event => {
                            setProfile((
                                {
                                    ...profile,
                                    name: event.target.value
                                }
                            ))
                            setError(null)
                        }} 
                        name="name"
                        id="name"
                        type="text" 
                    />
                </div>
            </div>
            {error && <p className="error-msg">{error}</p>}
        </>
    )
}