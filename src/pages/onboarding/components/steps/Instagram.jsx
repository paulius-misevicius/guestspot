import { AtSign } from "lucide-react"

export default function Instagram({profile, setProfile}) {
    return (
        <>
            <h1>Link your Instagram</h1>
            <p>Make sure to enter your correct username since this is how studios will contact you.</p>
            <div className="auth_field">
                <label htmlFor="instagram">Instagram username</label>
                <div className="input-container">
                    <AtSign className="input-icon icon-14px" />
                    <input 
                        value={profile.instagram || ""}
                        onChange={event => setProfile((
                            {
                                ...profile,
                                instagram: event.target.value
                            }
                        ))} 
                        name="instragram"
                        id="instragram"
                        type="text" 
                    />
                </div>
            </div>
        </>
    )
}