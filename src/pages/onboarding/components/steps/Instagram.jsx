import { AtSign, ExternalLink } from "lucide-react"
import { Link } from "react-router"

export default function Instagram({profile, setProfile, error, setError, COPY}) {

    const igPreview = `instagram.com/${profile.instagram || ""}`

    return (
        <>
            <h1>{COPY.HEADING}</h1>
            <p>{COPY.DESCRIPTION}</p>
            <div className="onboarding_input-field">
                <label htmlFor="instagram">Instagram username</label>
                <div className="input-container">
                    <AtSign className="input-icon icon-14px" />
                    <input 
                        value={profile.instagram || ""}
                        onChange={event => {
                            setProfile((
                                {
                                    ...profile,
                                    instagram: event.target.value
                                }
                            ))
                            setError(null)
                        }} 
                        name="instagram"
                        id="instagram"
                        type="text" 
                    />
                </div>
            </div>
            <div className="onboarding_instagram-link_wrapper">
                <a className="onboarding_instagram-link trunctuate" target="_blank" href={`https://${igPreview}`}>
                    {igPreview}
                </a>
                <ExternalLink className="icon-14px"/>
            </div>
            {error && <p className="error-msg">{error}</p>}
        </>
    )
}