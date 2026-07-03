import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { deleteFromFirebase } from "../utils"

export default function Listing({id, city, country, dateFrom, dateTo}) {

  const fromDay = format(dateFrom, "d")
  const fromMonth = format(dateFrom, "MMM")
  const fromYear = format(dateFrom, "yyyy")

  const toDay = format(dateTo, "d")
  const toMonth = format(dateTo, "MMM")
  const toYear = format(dateTo, "yyyy")

  let dateRange
  if (fromYear !== toYear) {
      dateRange = `${fromMonth} ${fromDay}, ${fromYear} - ${toMonth} ${toDay}, ${toYear}`
  }
  if (fromYear === toYear) {
      dateRange = `${fromMonth} ${fromDay} - ${toMonth} ${toDay}, ${fromYear}`
  }
  if (fromMonth === toMonth && fromYear === toYear) {
      dateRange = `${fromMonth} ${fromDay} - ${toDay}, ${fromYear}`
  }
  if (fromDay === toDay && fromMonth === toMonth && fromYear === toYear) {
      dateRange = `${fromMonth} ${fromDay}, ${fromYear}`
  }

  return (
      <div className="listing">
        <div className="listing_details">
          <div>
            <h3>{city}, {country}</h3>
            <p>{dateRange}</p>
          </div>
          <button 
            className="listing_delete-btn"
            onClick={() => deleteFromFirebase("listings", id)}
          >
            <Trash2 className="delete-btn_trash-icon"/>
          </button>
        </div>
        <div className="listing_matches">
          <p>See matches</p>
          <span>3</span>
        </div>
      </div>
  )
}