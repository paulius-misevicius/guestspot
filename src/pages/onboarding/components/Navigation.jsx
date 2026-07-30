export default function Navigation({currentStep, setCurrentStep, steps}) {

    const isNotFirstStep = currentStep > 0
    const isNotLastStep = currentStep < (steps.length - 1)
    const isSkippable = steps[currentStep].skippable
    const isFilled = steps[currentStep].isFilled

    return (
        <div className="onboarding_navigation">
            <div className="onboarding_navigation_grouped">
                <button
                    type="button"
                    className="onboarding_navigation_btn back-btn"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                >
                    Back
                </button>
                <button
                    form="onboarding"
                    disabled={!isFilled && isNotLastStep}
                    className="onboarding_navigation_btn mobile-only next-btn"
                >
                    {!isNotLastStep ? "Finish" : "Continue"}
                </button>
            </div>
            {isNotLastStep && isSkippable && !isFilled &&
                <button
                    type="button"
                    className="mobile-only skip-btn"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                >
                    Skip for now
                </button>
                }
            <div className="desktop-only skip-next-wrapper">
                {isNotLastStep && isSkippable && !isFilled &&
                    <button
                        type="button"
                        className="skip-btn"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                    >
                        Skip for now
                    </button>
                    }
                <button
                    form="onboarding"
                    disabled={!isFilled && isNotLastStep}
                    className="onboarding_navigation_btn next-btn"
                >
                    {!isNotLastStep ? "Finish" : "Continue"}
                </button>
            </div>
        </div>
    )
}