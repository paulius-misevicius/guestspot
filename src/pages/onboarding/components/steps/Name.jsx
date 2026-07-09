import { User } from "lucide-react"

export default function Name({profile, setProfile}) {
    return (
        <>
            <h1>Which one are you?</h1>
            <p>Choose what type of profile to create.</p>
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