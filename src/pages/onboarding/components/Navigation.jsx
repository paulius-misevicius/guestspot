export default function Navigation({currentStep, setCurrentStep, steps}) {
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
            <div className="navigation_next-skip-btn">
                {currentStep < (steps.length - 1) && steps[currentStep].skippable && 
                    <button 
                        className="onboarding_navigation_skip-btn"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                    >
                        Skip for now
                    </button>
                    }
                {currentStep > 0 && steps[currentStep].isFilled &&
                    <button
                        form="onboarding"
                        className="onboarding_navigation_btn"
                    >
                        {currentStep === (steps.length - 1) ? "Finish" : "Continue"}
                    </button>
                    }
            </div>
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