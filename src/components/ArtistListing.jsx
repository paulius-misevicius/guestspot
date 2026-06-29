export default function ArtistListing({place, dateRange}) {
    return (
        <div className="listing">
          <div className="listing-details">
            <h3>{place}</h3>
            <p>{dateRange}</p>
          </div>
          <div className="listing-matches">
            <p>See matches</p>
            <span>3</span>
          </div>
        </div>
    )
}