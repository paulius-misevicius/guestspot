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
            <MapPin className="combobox-city_map-pin-icon"/>
            {item.city}<span className="combobox-city_country">, {item.country}</span>
        </li>
    )

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsComboboxOpen(false)
                checkInputAgainstCities()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [inputValue])

    function checkInputAgainstCities() {
        const foundResult = lithuanianCities.find(item => toEnglishChars(item.city.toLowerCase()) === toEnglishChars(inputValue.toLowerCase()))

        if (lithuanianCities.some(item => toEnglishChars(item.city.toLowerCase()) === toEnglishChars(inputValue.toLowerCase()))) {
            setInputValue(foundResult.city)
            setListingData(prev => ({...prev, city: `${foundResult.city}, ${foundResult.country}`}))
        } else {
            setInputValue("")
            setListingData(prev => ({...prev, city: ""}))
        }

    }

    function toEnglishChars(string) {
        return string
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
    }

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
        <div ref={containerRef} className="listing-modal_city-field">
            <label htmlFor="city">City</label>
            <Search className="combobox-city_search-icon"/>
            <input 
                autoComplete="off"
                className="combobox-city"
                placeholder="I'm looking to guestspot in..."
                id="city" 
                type="text" 
                value={inputValue}
                onChange={event => {
                    setInputValue(event.target.value)
                    setIsComboboxOpen(true)
                    setHighlightedIndex(-1)
                    setListingData(prev => ({...prev, city: ""}))
                }}
                onFocus={() => setIsComboboxOpen(true)}
                onKeyDown={handleKeyDown}
            />
            {inputValue.length > 0 && <X className="combobox-city_clear-icon" onClick={clearInput}/>}
            {isComboboxOpen && searchResults.length > 0 && inputValue.length > 0 &&
                <ul>
                    {displayCities.slice(0, 5)}
                </ul>}
        </div>
    )
}