import { Link } from "react-router"

export default function PageNotFound() {
    return (
        <div className="not-found">
            <h1>Sorry! The page you're looking for doesn't exist.</h1>
            <Link to="/">Return home</Link>
        </div>
    )
}