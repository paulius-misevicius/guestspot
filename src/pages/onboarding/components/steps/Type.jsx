import { Brush, Store } from "lucide-react"

export default function Type({profile, setProfile}) {
    return (
        <>
            <div>
                <h1>Which are you?</h1>
                <p>This will determine your profile type and what content is shown to you.</p>
            </div>
            <div className="input_radio_container">
                <div className="input_radio_wrapper">
                    <input 
                        className="input_radio"
                        onChange={() => setProfile((
                            {
                                isProfileCompleted: false, 
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
                        <Brush className="input_radio_icon"/>
                        Tattoo artist
                        <p>I'm looking for studios to guest spot at</p>
                    </label>
                </div>
                <div className="input_radio_wrapper">
                    <input 
                        className="input_radio"
                        onChange={() => setProfile((
                            {
                                isProfileCompleted: false, 
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
                        <Store className="input_radio_icon"/>
                        Tattoo studio
                        <p>I'm looking to host guest spotting artists</p>
                    </label>
                </div>
            </div>
        </>
    )
}