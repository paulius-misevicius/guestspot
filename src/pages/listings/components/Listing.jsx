import { format } from "date-fns"
import { Trash2, CalendarDays, Search, User } from "lucide-react"
import { deleteFromFirebase } from "../../../utils/firebase/firestore"
import { translateDates, toDateParam } from "../../../utils/general"
import "../listings.css"
import { fetchBrowseListingsPage } from "../../../utils/firebase/firestore"
import { useState, useContext, useEffect } from "react"
import { UserContext } from "../../../App"
import { Link } from "react-router"
import { useNavigate } from "react-router"
import { IS_DEMO } from "../../../utils/demo"

export default function Listing({id, city, country, dateFrom, dateTo, isActive, setListings}) {

  const { profile } = useContext(UserContext)
  const [matches, setMatches] = useState([])

  const navigate = useNavigate()
  const params = new URLSearchParams({
    city: city,
    country: country,
    dateFrom: toDateParam(dateFrom),
    dateTo: toDateParam(dateTo)
  })

  async function checkForMatches() {
    if (!isActive) return

    try {
      const fetchUserType = profile.type === "studio" ? "artist" : "studio"
      const listingMatches = await fetchBrowseListingsPage(
        {
          userType: fetchUserType, 
          dateFrom: dateFrom, 
          dateTo: dateTo, 
          location: [{city: city, country: country}]
        }
      )
      setMatches(listingMatches.listings)
    } catch (error) {
      console.error (error.message)
    }
  }

  useEffect(() => {
    checkForMatches()
  }, [])

  const dateRange = translateDates(dateFrom, dateTo)

  return (
      <div className={`user_listing ${!isActive ? "user_listing_expired" : ""}`}>
        <div className="listing_main">
          <div className="listing_left">
              <h3>{city}, {country}</h3>
              <div className="listing_date">
                <CalendarDays className="icon-16px"/>
                <p>{dateRange}</p>
              </div>
          </div>
          <div className="listing_right">
            {isActive && matches.length > 0 &&
              <Link 
                to={`/browse?${params.toString()}`}
                className="listing_matches desktop-only"
              >
                See matches
                <span>{matches.length}</span>
              </Link>
              }
            <button
              aria-label={`Delete listing for ${city}, ${country}`}
              className="listing_delete-btn"
              onClick={() => {
                if (IS_DEMO) {
                  setListings(prev => prev.filter(item => item.id !== id))
                } else {
                  deleteFromFirebase("listings", id)
                }
              }}
            >
              <Trash2 className="icon-16px"/>
            </button>
          </div>
        </div>
        {isActive && matches.length > 0 &&
            <Link 
              to={`/browse?${params.toString()}`}
              className="listing_matches mobile-only"
            >
              See matches
              <span>{matches.length}</span>
            </Link>
            }
      </div>
  )
}