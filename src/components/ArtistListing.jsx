export default function ArtistListing({city, dateRange}) {
    return (
        <div className="listing">
          <div className="listing-details">
            <h3>{city}</h3>
            <p>{dateRange}</p>
          </div>
          <div className="listing-matches">
            <p>See matches</p>
            <span>3</span>
          </div>
        </div>
    )
}