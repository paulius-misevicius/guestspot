import { Outlet, Link } from "react-router"
import Logo from "../components/Logo"

export default function HomeLayout() {
    return (
        <div className="home">
            <header className="home_header">
                <div className="header_content">
                    <Logo light classes="header_logo"/>
                    <div className="header_buttons">
                        <Link 
                            to="auth?type=log-in"
                            className="home_button"
                        >
                            Log in
                        </Link>
                        <Link 
                            to="auth?type=sign-up"
                            className="home_button home_primary-btn"
                        >
                            Join now
                        </Link>
                    </div>
                </div>
            </header>
            <main className="home_main">
                <Outlet />
            </main>
            <footer className="home_footer">
                <Link to="terms-of-service">Terms of Service</Link>
                <Link to="privacy-policy">Privacy policy</Link>
            </footer>
        </div>
    )
}