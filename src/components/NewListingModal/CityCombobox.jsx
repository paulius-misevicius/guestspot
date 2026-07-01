import { useState, useRef, useEffect } from "react"
import { lithuanianCities } from "../../data"
import { Search, X, MapPin } from "lucide-react"

export default function CityCombobox({setListingData}) {

    const containerRef = useRef(null)
    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [highlightedIndex, setHighlightedIndex] = useState(-1)

    const searchResults = lithuanianCities.filter(item => item.city.toLowerCase().includes(inputValue.toLowerCase()))

    const displayCities = searchResults.map((item, index) => 
        <li 
            key={item.city} 
            onMouseDown={() => handleSelect(item)}
            onMouseEnter={() => setHighlightedIndex(index)}
        >
            <MapPin className="map-pin-icon"/>
            {item.city}<span className="combobox-country">, {item.country}</span>
        </li>
    )

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsComboboxOpen(false)

            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function clearInput() {
        setInputValue("")
        setListingData(prev => ({...prev, city: ""}))
        setIsComboboxOpen(false)
    }

    function handleSelect(item) {
        setInputValue(item.city)
        setListingData(prev => ({...prev, city: `${item.city}, ${item.country}`}))
        setIsComboboxOpen(false)
        setHighlightedIndex(-1)
    }

    function handleKeyDown(event) {
        if (!isComboboxOpen) return

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setHighlightedIndex(prev => Math.min(prev + 1, searchResults.length - 1))
        } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setHighlightedIndex(prev => Math.max(prev - 1, 0))
        } else if (event.key === "Enter") {
            if (highlightedIndex >= 0) {
                handleSelect(searchResults[highlightedIndex])
            }
        } else if (event.key === "Escape") {
            setIsComboboxOpen(false)
        }
    }

    return (
        <div ref={containerRef} className="modal-city">
            <label htmlFor="city">City</label>
            <Search className="search-icon"/>
            <input 
                autoComplete="off"
                className="city-combobox"
                placeholder="I'm looking to guestspot in..."
                id="city" 
                type="text" 
                value={inputValue}
                onChange={event => {
                    setInputValue(event.target.value)
                    setIsComboboxOpen(true)
                    setHighlightedIndex(-1)
                }}
                onFocus={() => setIsComboboxOpen(true)}
                onKeyDown={handleKeyDown}
            />
            {inputValue.length > 0 && <X className="clear-icon" onClick={clearInput}/>}
            {isComboboxOpen && searchResults.length > 0 && inputValue.length > 0 &&
                <ul>
                    {displayCities.slice(0, 5)}
                </ul>}
        </div>
    )
}