import { useState } from "react"
import { questionsArtist } from "../onboardingQuestions"

export default function Onboarding() {

    const [currentQuestion, setCurrentQuestion] = useState(0)

    function nextQuestion() {
        setCurrentQuestion(prev => prev + 1)
    }
    function previousQuestion() {
        setCurrentQuestion(prev => prev - 1)
    }

    const nextButton = 
        <button onClick={nextQuestion}>{currentQuestion === 0 ? "Get started": "Continue"}</button>

    const backButton = 
        <button onClick={previousQuestion}>Back</button>

    const finishButton =
        <button>Finish</button>

    // let questionInput
    // if (!questionsArtist[currentQuestion].input) {
    //     questionInput = null
    // } else if (questionsArtist[currentQuestion].input === "profile type") {
    //     questionInput = 
    //     <>
    //         <button 
    //             className="onboarding_which-one_btn"
    //         >
    //             Tattoo artist
    //         </button>
    //         <button 
    //             className="onboarding_which-one_btn"
    //         >
    //             Tattoo studio
    //         </button>
    //     </>
    // }

    return (
        <div className="onboarding">
            <section className="onboarding_left">
                <h2>Find studios or artists for guestspotting across Europe.</h2>
                <p>Ensure a good first impression by building out your profile.</p>
            </section>
            <section className="onboarding_right">
                <h1>{questionsArtist[currentQuestion].title}</h1>
                <p>{questionsArtist[currentQuestion].description}</p>

                {/* {questionInput} */}

                <div className="onboarding_navigation">
                    {currentQuestion > 0 && backButton}
                    {currentQuestion === (questionsArtist.length - 1)
                        ? finishButton
                        : nextButton
                        }
                </div>
            </section>
        </div>
    )
}