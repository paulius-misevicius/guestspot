export default function Navigation({currentStep, setCurrentStep}) {

    return (
        <div className="onboarding_navigation">
            {currentStep > 0 && 
                <button 
                    className="onboarding_navigation_btn" 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                >
                    Back
                </button>
                }
            {currentStep > 0 && 
                <button 
                    form="onboarding"
                    className="onboarding_navigation_btn"
                >
                    {currentStep === 8 ? "Finish" : "Continue"}
                </button>
                }
            {currentStep === 0 && 
                <button 
                    className="onboarding_navigation_btn" 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                >
                    Get started
                </button>
                }
        </div>
    )
}