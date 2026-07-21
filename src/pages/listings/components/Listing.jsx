import { format } from "date-fns"
import { Trash2, CalendarDays, Search } from "lucide-react"
import { deleteFromFirebase } from "../../../utils/firebase/firestore"
import { translateDates } from "../../../utils/general"
import "../listings.css"

export default function Listing({id, city, country, dateFrom, dateTo, isActive}) {

  const dateRange = translateDates(dateFrom, dateTo)

  return (
      <div className={`user_listing ${!isActive ? "user_listing_expired" : ""}`}>
        <div className="listing_left">
            <h3>{city}, {country}</h3>
            <div className="listing_date">
              <CalendarDays className="icon-16px"/>
              <p>{dateRange}</p>
            </div>
        </div>
        <div className="listing_right">
          {isActive &&
            <button className="listing_matches">
              <p>See matches</p>
              <span>3</span>
            </button>
            }
          <button 
            className="listing_delete-btn"
            onClick={() => deleteFromFirebase("listings", id)}
          >
            <Trash2 className="icon-16px"/>
          </button>
        </div>
      </div>
  )
}