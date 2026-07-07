export default function ProfileName({profile, setProfile}) {

    return (
        <div>
            <label htmlFor="name">Name / pseudonym</label>
            <input 
                value={profile.name || ""}
                onChange={event => setProfile((
                    {
                        ...profile,
                        name: event.target.value
                    }
                ))} 
                id="name" 
                type="text" 
            />
        </div>
    )
}