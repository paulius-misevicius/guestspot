import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { deleteFromFirebase } from "../../../utils/firebase/firestore"
import { translateDates } from "../../../utils/general"

export default function Listing({id, city, country, dateFrom, dateTo}) {

  const dateRange = translateDates(dateFrom, dateTo)

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