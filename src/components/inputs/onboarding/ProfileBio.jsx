export default function ProfileBio({profile, setProfile}) {

    return (
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
                id="bio" 
                rows="5"
            />
        </div>
    )
}