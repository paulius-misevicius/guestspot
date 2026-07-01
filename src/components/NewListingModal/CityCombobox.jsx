import { useState, useRef, useEffect } from "react"
import { lithuanianCities } from "../../data"

export default function CityCombobox({setListingData}) {

    const [inputValue, setInputValue] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef(null)

    const searchResults = lithuanianCities.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))

    const displayCities = searchResults.map(item => <li key={item}>{item}</li>)

    return (
        <div className="modal-city">
            <label htmlFor="city">City:</label>
            <input 
                id="city" 
                type="text" 
                value={inputValue}
                onChange={event => {
                    setListingData(prev => ({...prev, city: event.target.value}))
                    setInputValue(event.target.value)
                    setIsOpen(true)
                }} 
            />
            {isOpen && inputValue.length > 0 &&
                <ul>
                    {displayCities.slice(0, 5)}
                </ul>}
        </div>
    )
}