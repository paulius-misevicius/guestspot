import { useContext, useState, useEffect } from "react"
import { questionsArtist } from "../onboardingQuestions"
import { UserContext } from "../App"
import OnboardingInput from "../components/OnboardingInput"

export default function Onboarding() {

    const { user } = useContext(UserContext)

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [profile, setProfile] = useState({userId: user.uid})

    function nextQuestion() {
        setCurrentQuestion(prev => prev + 1)
    }
    function previousQuestion() {
        setCurrentQuestion(prev => prev - 1)
    }

    function submitAnswer(event) {
        event.preventDefault()
        nextQuestion()

        if (
            questionsArtist[currentQuestion].input === "portfolio" 
            || questionsArtist[currentQuestion].input === "profileImage"
        ) {
            return
        }

        console.log("submitting")
    }

    console.log(profile)

    const startButton =
        <button type="button" className="onboarding_navigation_btn" onClick={nextQuestion}>Get started</button>

    const backButton = 
        <button type="button" className="onboarding_navigation_btn" onClick={previousQuestion}>Back</button>

    const nextButton = 
        <button type="submit" className="onboarding_navigation_btn">
            {currentQuestion === (questionsArtist.length - 1) ? "Finish" : "Continue"}
        </button>

    return (
        <div className="onboarding">
            <section className="onboarding_left">
                <h2>Find studios or artists for guestspotting across Europe.</h2>
                <p>Ensure a good first impression by building out your profile.</p>
            </section>
            <form onSubmit={submitAnswer} className="onboarding_right">
                <h1>{questionsArtist[currentQuestion].title}</h1>
                <p>{questionsArtist[currentQuestion].description}</p>

                <OnboardingInput currentQuestion={currentQuestion} profile={profile} setProfile={setProfile} />

                <div className="onboarding_navigation">
                    {currentQuestion > 0 && backButton}
                    {currentQuestion > 0 && nextButton}
                    {currentQuestion === 0 && startButton}
                </div>
            </form>
        </div>
    )
}