import { useState, useRef, useEffect } from "react"
import { lithuanianCities } from "../../data"

export default function CityCombobox({setListingData}) {

    const containerRef = useRef(null)
    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")

    const searchResults = lithuanianCities.filter(item => item.city.toLowerCase().includes(inputValue.toLowerCase()))

    const displayCities = searchResults.map(item => 
        <li key={item.city}>{item.city}<span className="combobox-country">, {item.country}</span></li>
    )

    return (
        <div className="modal-city">
            <label className="sr-only" htmlFor="city">City</label>
            <input 
                className="city-combobox"
                placeholder="Pick a city"
                id="city" 
                type="text" 
                value={inputValue}
                onChange={event => {
                    setListingData(prev => ({...prev, city: event.target.value}))
                    setInputValue(event.target.value)
                    setIsComboboxOpen(true)
                }} 
            />
            {isComboboxOpen && inputValue.length > 0 &&
                <ul>
                    {displayCities.slice(0, 3)}
                </ul>}
        </div>
    )
}