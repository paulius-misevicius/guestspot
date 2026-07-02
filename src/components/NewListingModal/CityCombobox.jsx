import { useState, useRef, useEffect } from "react"
import { lithuanianCities } from "../../data"
import { Search, X, MapPin } from "lucide-react"
import { toEnglishChars } from "../../utils"

export default function CityCombobox({ setListingData }) {

    const containerRef = useRef(null)
    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const [inputValue, setInputValue] = useState("")
    const [highlightedIndex, setHighlightedIndex] = useState(-1)

    const searchResults = lithuanianCities.filter(item => 
        toEnglishChars(item.city.toLowerCase()).includes(inputValue.toLowerCase())
    )

    const showDropdown = isComboboxOpen && searchResults.length > 0 && inputValue.length > 0

    function commitCity(item) {
        setInputValue(item ? item.city : "")
        setListingData(prev => (
            {...prev, city: item ? `${item.city}, ${item.country}` : ""}
        ))
        setIsComboboxOpen(false)
        setHighlightedIndex(-1)
    }

    function commitTypedValue() {
        const match = lithuanianCities.find(item => 
            toEnglishChars(item.city.toLowerCase()) === toEnglishChars(inputValue.toLowerCase())
        )
        commitCity(match)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                commitTypedValue()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [inputValue])

    function handleInputChange(event) {
        setInputValue(event.target.value)
        setIsComboboxOpen(true)
        setHighlightedIndex(-1)
        setListingData(prev => ({...prev, city: ""}))
    }

    function handleKeyDown(event) {
        if (!isComboboxOpen) return

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setHighlightedIndex(prev => Math.min(prev + 1, searchResults.length - 1))
        } 
        else if (event.key === "ArrowUp") {
            event.preventDefault()
            setHighlightedIndex(prev => Math.max(prev - 1, 0))
        } 
        else if (event.key === "Enter" && highlightedIndex >= 0) {
            event.preventDefault()
            commitCity(searchResults[highlightedIndex])
        } 
        else if (event.key === "Enter") {
            event.preventDefault()
            commitCity(searchResults[highlightedIndex + 1])
        } 
        else if (event.key === "Escape") {
            setIsComboboxOpen(false)
        }
    }

    return (
        <div 
            className="listing-modal_city-field"
            ref={containerRef} 
        >
            <label htmlFor="city">City</label>
            <Search className="combobox-city_search-icon"/>
            <input 
                role="combobox"
                aria-expanded={showDropdown}
                aria-controls="city-listbox"
                aria-activedescendant={highlightedIndex >= 0 
                    ? `city-option-${highlightedIndex}` 
                    : undefined}
                autoComplete="off"
                required
                className="combobox-city"
                placeholder="I'm looking to guestspot in..."
                id="city" 
                name="city"
                type="text" 
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsComboboxOpen(true)}
                onKeyDown={handleKeyDown}
            />

            {inputValue.length > 0 && 
                <X className="combobox-city_clear-icon" onClick={() => commitCity(null)}/>
                }

            {showDropdown &&
                <ul id="city-listbox" role="listbox">
                    {searchResults.slice(0, 5).map((item, index) => 
                        <li 
                            className={index === highlightedIndex ? "highlight-li" : undefined}
                            key={item.city}
                            id={`city-option-${highlightedIndex}`} 
                            role="option"
                            aria-selected={index === highlightedIndex}
                            onMouseDown={() => commitCity(item)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            <MapPin className="combobox-city_map-pin-icon"/>
                            {item.city}<span className="combobox-city_country">, {item.country}</span>
                        </li>
                    )}
                </ul>
                }
        </div>
    )
}