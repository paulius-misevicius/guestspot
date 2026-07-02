import { useState } from "react"

import { format } from "date-fns"

import { DayPicker } from "@daypicker/react"
import "@daypicker/react/style.css"

import { CalendarDays, MoveRight } from "lucide-react"

export default function DatePicker({setListingData}) {

    const today = new Date()

    const [selected, setSelected] = useState(undefined)

    const dateFrom = selected?.from ? format(selected.from, "MMM d, yyyy") : ""
    const dateTo = selected?.to ? format(selected.to, "MMM d, yyyy") : ""

    function handleSelect(selected) {
        if (!selected) return

        const fromDay = format(selected.from, "d")
        const fromMonth = format(selected.from, "MMM")
        const fromYear = format(selected.from, "yyyy")

        const toDay = format(selected.to, "d")
        const toMonth = format(selected.to, "MMM")
        const toYear = format(selected.to, "yyyy")

        let selectedDates
        if (fromYear !== toYear) {
            selectedDates = `${fromMonth} ${fromDay}, ${fromYear} - ${toMonth} ${toDay}, ${toYear}`
        }
        if (fromYear === toYear) {
            selectedDates = `${fromMonth} ${fromDay} - ${toMonth} ${toDay}, ${fromYear}`
        }
        if (fromMonth === toMonth && fromYear === toYear) {
            selectedDates = `${fromMonth} ${fromDay} - ${toDay}, ${fromYear}`
        }
        if (fromDay === toDay && fromMonth === toMonth && fromYear === toYear) {
            selectedDates = `${fromMonth} ${fromDay}, ${fromYear}`
        }

        setListingData(prev => ({...prev, dateRange: selectedDates}))
        setSelected(selected)
    }

    return (
        <div className="date-picker">
            <div className="date-picker_date-fields">
                <div className="date-picker_date-field">
                    <label htmlFor="date-from">From</label>
                    <div className="date-field_input-container">
                        <input id="date-from" readOnly placeholder="From" value={dateFrom}/>
                        <CalendarDays className="date-field_calendar-icon" />
                    </div>
                </div>
                <MoveRight className="date-fields_arrow-icon"/>
                <div className="date-picker_date-field">
                    <label htmlFor="date-to">To</label>
                    <div className="date-field_input-container">
                        <input id="date-to" readOnly placeholder="To" value={dateTo}/>
                        <CalendarDays className="date-field_calendar-icon"/>
                    </div>
                </div>
            </div>
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
        </div>
    )
}