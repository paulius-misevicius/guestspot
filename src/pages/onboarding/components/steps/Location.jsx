import { useState } from "react"
import Combobox from "../../../../components/fields/Combobox"
import { X } from "lucide-react"
import { cities } from "../../../../utils/cities"

export default function Location({profile, setProfile}) {

    const [locationCount, setLocationCount] = useState(profile.locations?.length || 1)

    const locationComboboxes = Array.from({length: locationCount}).map((item, index) => 
        <div key={index} className="onboarding_location-multiple">
            {index > 0 && index === (locationCount - 1) &&
                <button 
                    type="button"
                    className="onboarding_location-delete-btn"
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
            <h1>{profile.type === "artist" 
                    ? "Where are you based?" 
                    : "Where's your studio located?"
                    }
            </h1>
            <p>{profile.type === "artist" 
                    ? "This will let studios know where you're coming from." 
                    : "This will let artists know where you're based."
                    }
            </p>
            {locationComboboxes}
            {profile.type === "studio" && (profile?.locations?.filter(Boolean).length ?? 0) >= locationCount && locationCount < 5 &&
                <button 
                    className="onboarding_add-location-btn"
                    type="button"
                    onClick={() => setLocationCount(prev => prev + 1)}
                >
                    Add another
                </button>
            }
        </>
    )
}