import { useState, useRef, useEffect } from "react"
import { Search, X, MapPin } from "lucide-react"
import { toEnglishChars } from "../../utils/general"
import "../components.css"

export default function Combobox({data, setData, itemList, noLabel, index, setIndex, placeholder, error, setError, classes, resetSignal = undefined, studio}) {

    const containerRef = useRef(null)
    const commitTypedValueRef = useRef()
    commitTypedValueRef.current = commitTypedValue
    const [isComboboxOpen, setIsComboboxOpen] = useState(false)
    const [inputValue, setInputValue] = useState(data.locations?.[index]?.city ?? "")
    const [highlightedIndex, setHighlightedIndex] = useState(-1)

    const searchResults = itemList.filter(item => 
        toEnglishChars(item.city.toLowerCase()).includes(toEnglishChars(inputValue.toLowerCase())) 
        && 
        !data?.locations?.some(location => location?.city === item.city)
    )
    const visibleResults = studio ? searchResults : searchResults.slice(0, 5)
    const showDropdown = studio 
        ? (isComboboxOpen && visibleResults.length > 0) 
        : (isComboboxOpen && visibleResults.length > 0 && inputValue.length > 0)

    function commitCity(item) {
        setInputValue(item ? item.city : "")
        setData(prev => {
            const next = [...(prev.locations ?? [])]
            next[index] = item ? {city: item.city, country: item.country} : undefined
            return {...prev, locations: next}
        })
        setIsComboboxOpen(false)
        setHighlightedIndex(-1)
    }

    function commitTypedValue() {
        if (!inputValue) return
        if (data?.locations?.some(item => 
            toEnglishChars(item?.city?.toLowerCase() ?? "") === toEnglishChars(inputValue.toLowerCase())
        )) return
        const match = itemList.find(item => 
            toEnglishChars(item.city.toLowerCase()) === toEnglishChars(inputValue.toLowerCase())
        )
        commitCity(match)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                commitTypedValueRef.current()
                setIsComboboxOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        if (resetSignal === undefined) return
        setInputValue("")
        setIsComboboxOpen(false)
        setHighlightedIndex(-1)
    }, [resetSignal])

    function handleInputChange(event) {
        setInputValue(event.target.value)
        if (error) setError(null)
        setIsComboboxOpen(true)
        setHighlightedIndex(-1)
        setData(prev => {
            const next = [...(prev.locations ?? [])]
            next[index] = undefined
            return {...prev, locations: next}
        })
    }

    function handleKeyDown(event) {
        if (!isComboboxOpen) return

        if (event.key === "ArrowDown") {
            event.preventDefault()
            setHighlightedIndex(prev => Math.min(prev + 1, visibleResults.length - 1))
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
            if (visibleResults.length === 0) return
            commitCity(highlightedIndex >= 0 ? visibleResults[highlightedIndex] : visibleResults[0])
        } 
        else if (event.key === "Escape") {
            setIsComboboxOpen(false)
        }
    }

    return (
        <div 
            className={`combobox-wrapper ${classes ? classes : ""}`}
            ref={containerRef} 
        >
            <label htmlFor="city" className={noLabel ? "sr-only" : undefined}>City</label>
            <div className="input-container">
                <Search className="input-icon icon-14px icon-stroke"/>
                <input
                    role="combobox"
                    aria-expanded={showDropdown}
                    aria-controls="city-listbox"
                    aria-autocomplete="list"
                    aria-activedescendant={highlightedIndex >= 0
                        ? `city-option-${highlightedIndex}`
                        : undefined}
                    autoComplete="off"
                    className={`combobox-city ${error && !data.locations?.[0]?.city ? "input_error" : ""}`}
                    placeholder={placeholder}
                    id="city"
                    name="city"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => setIsComboboxOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                {inputValue.length > 0 && 
                    <button
                        onClick={() => commitCity(null)}
                        aria-label="Clear city selection"
                        type="button"
                    >
                        <X
                            className="input-icon input-icon_right-side icon-16px"
                        />
                    </button>
                    }
            </div>

            {showDropdown &&
                <ul id="city-listbox" role="listbox">
                    {visibleResults.map((item, index) => 
                        <li 
                            className={index === highlightedIndex ? "highlight-li" : undefined}
                            key={`${item.city}-${item.country}`}
                            id={`city-option-${index}`} 
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