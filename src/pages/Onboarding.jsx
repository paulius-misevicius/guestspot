import { useContext, useState, useEffect } from "react"
import { questionsArtist } from "../onboardingQuestions"
import ProfileType from "../components/inputs/ProfileType"
import ProfileName from "../components/inputs/ProfileName"
import ProfileCity from "../components/inputs/ProfileCity"
import { UserContext } from "../App"
import { getCollectionFromFirebase } from "../utils"
import ProfileInstagram from "../components/inputs/ProfileInstagram"
import ProfileBio from "../components/inputs/ProfileBio"
import ProfilePortfolio from "../components/inputs/ProfilePortfolio"
import ProfileImage from "../components/inputs/ProfileImage"

export default function Onboarding() {

    const { user } = useContext(UserContext)

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [profile, setProfile] = useState({userId: user.uid})
    const [comboboxLocations, setComboboxLocations] = useState([])

    useEffect(() => {
        getCollectionFromFirebase("locations")
            .then(data => setComboboxLocations(data))
    }, [])

    function nextQuestion() {
        setCurrentQuestion(prev => prev + 1)
    }
    function previousQuestion() {
        setCurrentQuestion(prev => prev - 1)
    }

    function submitAnswer(event) {
        event.preventDefault()
        nextQuestion()
    }
    console.log(profile)
    const startButton =
        <button type="button" onClick={nextQuestion}>Get started</button>

    const backButton = 
        <button type="button" onClick={previousQuestion}>Back</button>

    const nextButton = 
        <button type="submit">{currentQuestion === (questionsArtist.length - 1) ? "Finish" : "Continue"}</button>

    let questionInput
    if (!questionsArtist[currentQuestion].input) {
        questionInput = null
    } else if (questionsArtist[currentQuestion].input === "type") {
        questionInput = <ProfileType profile={profile} setProfile={setProfile} />
    } else if (questionsArtist[currentQuestion].input === "name") {
        questionInput = <ProfileName profile={profile} setProfile={setProfile} />
    } else if (questionsArtist[currentQuestion].input === "city") {
        questionInput = <ProfileCity profile={profile} setProfile={setProfile} comboboxLocations={comboboxLocations}/>
    } else if (questionsArtist[currentQuestion].input === "instagram") {
        questionInput = <ProfileInstagram profile={profile} setProfile={setProfile} />
    } else if (questionsArtist[currentQuestion].input === "bio") {
        questionInput = <ProfileBio profile={profile} setProfile={setProfile} />
    } else if (questionsArtist[currentQuestion].input === "portfolio") {
        questionInput = <ProfilePortfolio profile={profile} setProfile={setProfile} />
    } else if (questionsArtist[currentQuestion].input === "profileImage") {
        questionInput = <ProfileImage profile={profile} setProfile={setProfile} />
    }

    return (
        <div className="onboarding">
            <section className="onboarding_left">
                <h2>Find studios or artists for guestspotting across Europe.</h2>
                <p>Ensure a good first impression by building out your profile.</p>
            </section>
            <form onSubmit={submitAnswer} className="onboarding_right">
                <h1>{questionsArtist[currentQuestion].title}</h1>
                <p>{questionsArtist[currentQuestion].description}</p>

                {questionInput}

                <div className="onboarding_navigation">
                    {currentQuestion > 0 && backButton}
                    {currentQuestion > 0 && nextButton}
                    {currentQuestion === 0 && startButton}
                </div>
            </form>
        </div>
    )
}