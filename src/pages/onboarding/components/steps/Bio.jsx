export default function Bio({profile, setProfile, COPY}) {
    return (
        <>
            <h1>{COPY.HEADING}</h1>
            <p>{COPY.DESCRIPTION}</p>
            <div className="onboarding_bio onboarding_input-field">
                <label htmlFor="bio">Profile bio</label>
                <textarea 
                    className="bio_textarea"
                    value={profile.bio || ""}
                    onChange={event => setProfile((
                        {
                            ...profile,
                            bio: event.target.value
                        }
                    ))} 
                    name="bio"
                    id="bio"
                    rows="5"
                    maxLength="165"
                />
                <span>{profile?.bio?.length ?? 0}/165</span>
            </div>
        </>
    )
}