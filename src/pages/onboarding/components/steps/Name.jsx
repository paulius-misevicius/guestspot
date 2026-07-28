import { User } from "lucide-react"

export default function Name({profile, setProfile, error, setError}) {
    return (
        <>
            <h1>{profile.type === "artist" ? "What's your name or pseudonym?" : "What's the name of your studio"}</h1>
            <p>{profile.type === "artist" ? "This is how you'll appear to studios." : "This is how you'll appear to artists."}</p>
            <div className="auth_field">
                <label htmlFor="name">Name / pseudonym</label>
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