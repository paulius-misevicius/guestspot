import { useState } from "react"
import Combobox from "../../../../components/fields/Combobox"
import { X } from "lucide-react"
import { cities } from "../../../../utils/cities"

export default function Location({profile, setProfile, COPY}) {

    const [locationCount, setLocationCount] = useState(profile.locations?.length || 1)

    const locationComboboxes = Array.from({length: locationCount}).map((item, index) => 
        <div key={index} className="onboarding_location-multiple onboarding_input-field">
            {index > 0 && index === (locationCount - 1) &&
                <button 
                    type="button"
                    aria-label={`Delete location ${index + 1}`}
                    className="location_delete-btn"
                    onClick={() => {
                        setLocationCount(prev => prev - 1)
                        setProfile(prev => (
                            {
                                ...prev, 
                                locations: prev.locations.slice(0, -1)
                            }
                        ))
                    }}
                >
                    <X className="icon-16px" />
                </button>
                }
            <Combobox 
                noLabel={index > 0} 
                data={profile} 
                setData={setProfile} 
                itemList={cities} 
                index={index}
                placeholder="Enter the city in which you're based..."
            />
        </div>
    )

    return (
        <>
            <h1>{COPY.HEADING}</h1>
            <p>{COPY.DESCRIPTION}</p>
            {locationComboboxes}
            {profile.type === "studio" && (profile?.locations?.filter(Boolean).length ?? 0) >= locationCount && locationCount < 5 &&
                <button 
                    className="add-location-btn"
                    type="button"
                    aria-label="Add another studio location"
                    onClick={() => setLocationCount(prev => prev + 1)}
                >
                    Add another
                </button>
            }
        </>
    )
}