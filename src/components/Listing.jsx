import { format } from "date-fns"

export default function Listing({city, country, dateFrom, dateTo}) {

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
          <h3>{city}, {country}</h3>
          <p>{dateRange}</p>
        </div>
        <div className="listing_matches">
          <p>See matches</p>
          <span>3</span>
        </div>
      </div>
  )
}