export default function Type({profile, setProfile}) {
    return (
        <>
            <h1>Which one are you?</h1>
            <p>Choose what type of profile to create.</p>
            <div className="input_radio_container">
                <div>
                    <input 
                        className="input_radio"
                        onChange={() => setProfile((
                            {
                                ...profile, 
                                type: "artist"
                            }
                        ))} 
                        type="radio" 
                        id="artist" 
                        checked={profile.type === "artist"}
                        value="artist" 
                        name="type"
                    />
                    <label 
                        className={profile.type === "artist" ? "input_radio_label radio_checked" : "input_radio_label"}
                        htmlFor="artist"
                    >
                        Tatoo artist
                    </label>
                </div>
                <div>
                    <input 
                        className="input_radio"
                        onChange={() => setProfile((
                            {
                                ...profile, 
                                type: "studio"
                            }
                        ))} 
                        type="radio" 
                        id="studio" 
                        checked={profile.type === "studio"}
                        value="studio" 
                        name="type"
                    />
                    <label 
                        className={profile.type === "studio" ? "input_radio_label radio_checked" : "input_radio_label"}
                        htmlFor="studio"
                    >
                        Tatoo studio
                    </label>
                </div>
            </div>
        </>
    )
}