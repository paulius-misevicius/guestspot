import { useState } from "react"
import { format } from "date-fns"
import { DayPicker } from "@daypicker/react"
import "@daypicker/react/style.css"
import { CalendarDays, MoveRight, ChevronDown, ChevronUp } from "lucide-react"

export default function DatePicker({setData}) {

    const today = new Date()

    const [selected, setSelected] = useState(undefined)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    const dateFrom = selected?.from ? format(selected.from, "MMM d, yyyy") : ""
    const dateTo = selected?.to ? format(selected.to, "MMM d, yyyy") : ""

    function handleEnterKey(event) {
        event.preventDefault()
    }

    function handleSelect(selected) {
        
        if (!selected) return

        setData(prev => ({...prev, dateFrom: selected.from, dateTo: selected.to}))
        setSelected(selected)
    }

    return (
        <div className="date-picker">
            <div className="date-picker_date-fields">
                <div className="date-picker_date-field">
                    <label htmlFor="date-from">From</label>
                    <div className="input-container">
                        <input 
                            id="date-from" 
                            name="date-from"
                            placeholder="From" 
                            value={dateFrom}
                            onKeyDown={handleEnterKey}
                            onClick={() => setIsCalendarOpen(true)}
                            readOnly
                        />
                        <CalendarDays className="input-icon icon-14px" />
                    </div>
                </div>
                <MoveRight className="date-fields_arrow-icon"/>
                <div className="date-picker_date-field">
                    <label htmlFor="date-to">To</label>
                    <div className="input-container">
                        <input 
                            id="date-to" 
                            name="date-to"
                            placeholder="To" 
                            value={dateTo}
                            onKeyDown={handleEnterKey}
                            onClick={() => setIsCalendarOpen(true)}
                            readOnly
                        />
                        <CalendarDays className="input-icon icon-14px"/>
                    </div>
                </div>
            </div>
            <button 
                className="date-picker_toggle-calendar-btn"
                type="button"
                onClick={() => setIsCalendarOpen(prev => !prev)}
            >
                {isCalendarOpen ? "Hide" : "Show"} calendar
                {isCalendarOpen 
                    ? <ChevronUp className="icon-14px" /> 
                    : <ChevronDown className="icon-14px" />
                    }
            </button>
            {isCalendarOpen &&
                <DayPicker 
                    mode="range" 
                    navLayout="around"
                    captionLayout="dropdown"
                    startMonth={today}
                    endMonth={new Date(2028, 11)}
                    showOutsideDays
                    weekStartsOn={1}
                    disabled={{before: today}}
                    selected={selected}
                    onSelect={handleSelect}
                />
                }
        </div>
    )
}