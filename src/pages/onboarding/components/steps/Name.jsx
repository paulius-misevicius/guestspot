import { User } from "lucide-react"

export default function Name({profile, setProfile}) {
    return (
        <>
            <h1>What's your name or pseudonym?</h1>
            <p>This is how you'll appear to studios.</p>
            <div className="auth_field">
                <label htmlFor="name">Name / pseudonym</label>
                <div className="input-container">
                    <User className="input-icon icon-16px" />
                    <input 
                        value={profile.name || ""}
                        onChange={event => setProfile((
                            {
                                ...profile,
                                name: event.target.value
                            }
                        ))} 
                        name="name"
                        id="name"
                        type="text" 
                    />
                </div>
            </div>
        </>
    )
}