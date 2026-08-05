import { MoveDown, User, Split } from "lucide-react"
import "./home.css"
import Hero from "../../assets/guestme-hero-image.webp"
import { Link } from "react-router"
import { useRef } from "react"

export default function Home() {

    const sectionRef = useRef(null)
    const igIcon = <svg fill="currentColor" viewBox="0 0 32 32" id="Camada_1" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M22.3,8.4c-0.8,0-1.4,0.6-1.4,1.4c0,0.8,0.6,1.4,1.4,1.4c0.8,0,1.4-0.6,1.4-1.4C23.7,9,23.1,8.4,22.3,8.4z"></path> <path d="M16,10.2c-3.3,0-5.9,2.7-5.9,5.9s2.7,5.9,5.9,5.9s5.9-2.7,5.9-5.9S19.3,10.2,16,10.2z M16,19.9c-2.1,0-3.8-1.7-3.8-3.8 c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C19.8,18.2,18.1,19.9,16,19.9z"></path> <path d="M20.8,4h-9.5C7.2,4,4,7.2,4,11.2v9.5c0,4,3.2,7.2,7.2,7.2h9.5c4,0,7.2-3.2,7.2-7.2v-9.5C28,7.2,24.8,4,20.8,4z M25.7,20.8 c0,2.7-2.2,5-5,5h-9.5c-2.7,0-5-2.2-5-5v-9.5c0-2.7,2.2-5,5-5h9.5c2.7,0,5,2.2,5,5V20.8z"></path> </g> </g></svg>

    function scrollIntoView() {
        sectionRef.current.scrollIntoView({behavior: "smooth"})
    }

    return (
        <>
            <section className="home_hero">
                <img className="hero_image" src={Hero}/>
                <div className="hero_image_overlay"/>
                <div className="hero_content">
                    <h1>Find your next <span className="accent-span">guest spot</span> today</h1>
                    <p>Guestme is the first guest spotting platform built specifically to connect tattoo artists and studios across Europe.</p>
                    <div className="hero_buttons">
                        <Link 
                            to="auth?type=sign-up"
                            className="home_button home_primary-btn"
                        >
                            Join for free
                        </Link>
                        <button 
                            onClick={scrollIntoView}
                            className="home_button hero_see-how-it-works"
                        >
                            How it works 
                            <MoveDown className="icon-18px"/>
                        </button>
                    </div>
                </div>
            </section>
            <section ref={sectionRef} className="home_how-it-works">
                <div className="how-it-works_intro">
                    <h2>How <span className="accent-span">Guestme</span> helps you guest spot</h2>
                    <p>Guestme makes it easy to find studios and artists across Europe looking to fill or find an open guest spot.</p>
                </div>
                <div className="how-it-works_steps">
                    <div className="step">
                        <User />
                        <span>Step 1</span>
                        <h3>Build your profile</h3>
                        <p>Create an account as a studio or artist. Add your name, location, portfolio pictures, and other details.</p>
                    </div>
                    <div className="home_divider"/>
                    <div className="step wide">
                        <Split />
                        <span>Step 2</span>
                        <h3>Find listings yourself, or wait to be found</h3>
                        <p>Create an account as a studio or artist. Add your name, location, portfolio pictures and other details.</p>
                        <div className="step_middle">
                            <div className="step_middle_child">
                                <h4>Post a listing</h4>
                                <p>Artists share where and when they're travelling. Studios share when a guest spot is open. It shows up in the other side's browse tab.</p>
                            </div>
                            <span className="home_or">or</span>
                            <div className="divider-row">
                                <div className="divider-line"></div>
                                <span>
                                    or
                                </span>
                                <div className="divider-line"></div>
                            </div>
                            <div className="step_middle_child">
                                <h4>Browse listings</h4>
                                <p>Scroll artists and studios across 17 European countries, and filter by location and dates until something catches your eye.</p>
                            </div>
                        </div>
                    </div>
                    <div className="home_divider"/>
                    <div className="step">
                        {igIcon}
                        <span>Step 3</span>
                        <h3>Connect on Instagram</h3>
                        <p>Guestme is for discovery only. All further communication happens off-platform. Every listing includes a link to the user's Instagram to take the conversation from there.</p>
                    </div>
                </div>
            </section>
        </>
    )
}