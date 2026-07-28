export default function Navigation({currentStep, setCurrentStep, steps}) {

    const isNotFirstStep = currentStep > 0
    const isNotLastStep = currentStep < (steps.length - 1)
    const isSkippable = steps[currentStep].skippable
    const isFilled = steps[currentStep].isFilled

    return (
        <div className="onboarding_navigation">
            {isNotFirstStep && 
                <button 
                    className="onboarding_navigation_btn" 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                >
                    Back
                </button>
                }
            {isNotFirstStep &&
                <div className="navigation_next-skip-btn">
                    {isNotLastStep && isSkippable && !isFilled &&
                        <button 
                            className="onboarding_navigation_skip-btn"
                            onClick={() => setCurrentStep(prev => prev + 1)}
                        >
                            Skip for now
                        </button>
                        }
                    {isFilled || !isNotLastStep
                        ?
                            <button
                                form="onboarding"
                                className="onboarding_navigation_btn"
                            >
                                {!isNotLastStep ? "Finish" : "Continue"}
                            </button>
                        :
                            null
                        }
                </div>
                }
            {!isNotFirstStep && 
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