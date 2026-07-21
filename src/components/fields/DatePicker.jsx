import { useState } from "react"
import { format } from "date-fns"
import { DayPicker } from "@daypicker/react"
import "@daypicker/react/style.css"
import { CalendarDays, MoveRight, ChevronDown, ChevronUp } from "lucide-react"

export default function DatePicker({data, setData, error, setError, noLabel}) {

    const today = new Date()

    const [selected, setSelected] = useState(undefined)

    const dateFrom = selected?.from ? format(selected.from, "MMM d, yyyy") : ""
    const dateTo = selected?.to ? format(selected.to, "MMM d, yyyy") : ""

    function handleEnterKey(event) {
        event.preventDefault()
    }

    function handleSelect(selected) {
        
        if (!selected) return

        setError(null)

        setData(prev => ({...prev, dateFrom: selected.from, dateTo: selected.to}))
        setSelected(selected)
    }

    return (
        <div className="date-picker">
            <div className="date-picker_date-fields">
                <div className="date-picker_date-field">
                    <label 
                        className={noLabel ? "sr-only" : ""}
                        htmlFor="date-from"
                    >
                        From
                    </label>
                    <div className="input-container">
                        <input 
                            className={error && !data.dateFrom && "input_error"}
                            id="date-from" 
                            name="date-from"
                            placeholder="From" 
                            value={dateFrom}
                            onKeyDown={handleEnterKey}
                            readOnly
                        />
                        <CalendarDays className="input-icon icon-14px" />
                    </div>
                </div>
                <MoveRight className={`date-fields_arrow-icon icon-14px icon-stroke ${!noLabel ? "icon_margin" : ""}`}/>
                <div className="date-picker_date-field">
                    <label 
                        className={noLabel ? "sr-only" : ""}
                        htmlFor="date-to"
                    >
                        To
                    </label>
                    <div className="input-container">
                        <input 
                            className={error && !data.dateFrom ? "input_error" : ""}
                            id="date-to" 
                            name="date-to"
                            placeholder="To" 
                            value={dateTo}
                            onKeyDown={handleEnterKey}
                            readOnly
                        />
                        <CalendarDays className="input-icon icon-14px"/>
                    </div>
                </div>
            </div>
                <DayPicker 
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
        </div>
    )
}