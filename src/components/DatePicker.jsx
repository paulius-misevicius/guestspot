import { useState } from "react"

import { format } from "date-fns"

import { DayPicker } from "@daypicker/react"
import "@daypicker/react/style.css"

export default function DatePicker() {

    const today = new Date()

    const [selected, setSelected] = useState(undefined)

    console.log(selected)

    const dateFrom = selected?.from ? format(selected.from, "MMM d, yyyy") : "Pick a date"
    const dateTo = selected?.to ? format(selected.to, "MMM d, yyyy") : "Pick a date"

    function handleSelect(selected) {
        if (!selected) return

        setSelected(selected)
    }

    return (
        <div>
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
                disabled={{before: today}}
                selected={selected}
                onSelect={handleSelect}
            />
        </div>
    )
}