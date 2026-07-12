export default function Bio({profile, setProfile}) {
    return (
        <>
            <h1>Write a short bio</h1>
            <p>{profile.type === "artist" 
                    ? "Tell studios about your style, specialties, and experience."
                    : "Tell artist about your studio."
                    }
            </p>
            <div>
                <label htmlFor="bio">Profile bio</label>
                <textarea 
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
                />
            </div>
        </>
    )
}