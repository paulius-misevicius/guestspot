export default function ProfileType({profile, setProfile}) {

    return (
        <div className="input_radio_container">
            <input 
                className="input_radio"
                onClick={() => setProfile((
                    {
                        ...profile, 
                        type: "artist"
                    }
                ))} 
                type="radio" 
                id="artist" 
                defaultChecked={profile.type === "artist"}
                value="artist" 
                name="type"
            />
            <label 
                className={profile.type === "artist" ? "input_radio_label radio_checked" : "input_radio_label"}
                htmlFor="artist"
            >
                Tattoo artist
            </label>
            <input 
                className="input_radio"
                onClick={() => setProfile((
                    {
                        ...profile, 
                        type: "studio"
                    }
                ))} 
                type="radio" 
                id="studio" 
                defaultChecked={profile.type === "studio"}
                value="studio"
                name="type"
            />
            <label 
                className={profile.type === "studio" ? "input_radio_label radio_checked" : "input_radio_label"}
                htmlFor="studio"
            >
                Tattoo studio
            </label>
        </div>
    )
}