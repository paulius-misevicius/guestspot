import { useState } from "react"

import { format } from "date-fns"

import { DayPicker } from "@daypicker/react"
import "@daypicker/react/style.css"

export default function DatePicker({setListingData}) {

    const today = new Date()

    const [selected, setSelected] = useState(undefined)

    const dateFrom = selected?.from ? format(selected.from, "MMM d, yyyy") : "Pick a date"
    const dateTo = selected?.to ? format(selected.to, "MMM d, yyyy") : "Pick a date"

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
            <div className="date-picker-fields">
                <div className="date-field">
                    <p>{dateFrom}</p>
                </div>
                <div className="date-field">
                    <p>{dateTo}</p>
                </div>
            </div>
            <DayPicker 
                mode="range" 
                navLayout="around"
                showOutsideDays
                weekStartsOn={1}
                disabled={{before: today}}
                selected={selected}
                onSelect={handleSelect}
            />
        </div>
    )
}