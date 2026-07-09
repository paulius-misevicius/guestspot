export default function Navigation({currentStep, setCurrentStep, totalSteps, steps}) {
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
            {currentStep > 0 && steps[currentStep].isFilled && 
                <button 
                    form="onboarding"
                    className="onboarding_navigation_btn"
                >
                    {currentStep === totalSteps ? "Finish" : "Continue"}
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