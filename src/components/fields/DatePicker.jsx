import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { DayPicker } from "@daypicker/react"
import { CalendarDays, MoveRight, ChevronDown, ChevronUp } from "lucide-react"
import "@daypicker/react/style.css"
import "../components.css"

export default function DatePicker({selected, setSelected, error, setError, noLabel, classes, isModal}) {

    const today = new Date()

    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const calendarRef = useRef(null)
    const triggerRef1 = useRef(null)
    const triggerRef2 = useRef(null)

    const dateFrom = selected?.from ? format(selected.from, "MMM d, yyyy") : ""
    const dateTo = selected?.to ? format(selected.to, "MMM d, yyyy") : ""

    const calendar = 
        <DayPicker 
            className={isModal ? "date-picker_modal" : ""}
            mode="range" 
            navLayout="around"
            startMonth={today}
            endMonth={new Date(2028, 11)}
            showOutsideDays
            weekStartsOn={1}
            disabled={[{before: today}, today]}
            selected={selected}
            onSelect={handleSelect}
        />


    useEffect(() => {
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target) &&
                triggerRef1.current && !triggerRef1.current.contains(event.target) &&
                triggerRef2.current && !triggerRef2.current.contains(event.target)) {
                setIsCalendarOpen(false)
            }
        }

        if (isCalendarOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isCalendarOpen])

    function handleEnterKey(event) {
        event.preventDefault()
    }

    function handleSelect(selected) {
        if (!selected) return
        if (error) setError(null)
        setSelected(prev => ({...prev, ...selected}))
    }

    return (
        <div className={`date-picker ${classes ? classes : ""}`}>
            <div className="date-picker_date-fields">
                <div className="date-picker_date-field" ref={triggerRef1}>
                    <label 
                        className={noLabel ? "sr-only" : ""}
                        htmlFor="date-from"
                    >
                        From
                    </label>
                    <div className="input-container">
                        <input 
                            className={error && !selected.from && "input_error"}
                            id="date-from" 
                            name="date-from"
                            placeholder="From" 
                            value={dateFrom}
                            onClick={isModal ? () => setIsCalendarOpen(prev => !prev) : null}
                            onKeyDown={handleEnterKey}
                            readOnly
                            aria-expanded={isCalendarOpen}
                        />
                        <CalendarDays className="input-icon icon-14px" />
                    </div>
                </div>
                <MoveRight className={`date-fields_arrow-icon icon-14px icon-stroke ${!noLabel ? "icon_margin" : ""}`}/>
                <div className="date-picker_date-field" ref={triggerRef2}>
                    <label 
                        className={noLabel ? "sr-only" : ""}
                        htmlFor="date-to"
                    >
                        To
                    </label>
                    <div className="input-container">
                        <input 
                            className={error && !selected.from ? "input_error" : ""}
                            id="date-to" 
                            name="date-to"
                            placeholder="To" 
                            value={dateTo}
                            onClick={isModal ? () => setIsCalendarOpen(prev => !prev) : null}
                            onKeyDown={handleEnterKey}
                            readOnly
                            aria-expanded={isCalendarOpen}
                        />
                        <CalendarDays className="input-icon icon-14px"/>
                    </div>
                </div>
            </div>
            <div ref={calendarRef}>
                {isModal ? isCalendarOpen && calendar : calendar}
            </div>
        </div>
    )
}