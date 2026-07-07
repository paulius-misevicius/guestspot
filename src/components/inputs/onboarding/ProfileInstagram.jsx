export default function ProfileInstagram({profile, setProfile}) {

    const instagramLink = "instagram.com/"

    return (
        <div>
            <label htmlFor="instagram">Instagram username</label>
            <input 
                value={profile.instagram || ""}
                onChange={event => setProfile((
                    {
                        ...profile,
                        instagram: event.target.value
                    }
                ))} 
                id="instagram" 
                type="text" 
            />
            <p>Preview: {instagramLink + (profile.instagram || "")}</p>
        </div>
    )
}