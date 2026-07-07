import { useState } from "react"

export default function ProfileType({profile, setProfile}) {

    const artistValue = "artist"
    const studioValue = "studio"

    return (
        <div>
            <input 
                onClick={() => setProfile((
                    {
                        ...profile, 
                        type: "artist"
                    }
                ))} 
                type="radio" 
                id="artist" 
                defaultChecked={artistValue === profile.type}
                value={artistValue} 
                name="type"
            />
            <label htmlFor="artist">Tattoo artist</label>
            <input 
                onClick={() => setProfile((
                    {
                        ...profile, 
                        type: "studio"
                    }
                ))} 
                type="radio" 
                id="studio" 
                defaultChecked={studioValue === profile.type}
                value={studioValue}
                name="type"
            />
            <label htmlFor="studio">Tattoo studio</label>
        </div>
    )
}