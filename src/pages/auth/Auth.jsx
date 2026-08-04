import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { TailSpin } from "react-loader-spinner"
import { signInExistingUser, signInWithGoogle, signUpNewUser, verifyEmail } from "../../utils/firebase/auth"
import { checkErrorMessage } from "../../utils/general"
import { addToFirebaseWithId } from "../../utils/firebase/firestore"
import "./auth.css"

import Email from "./components/Email"
import Password from "./components/Password"
import AuthGoogle from "./components/AuthGoogle"
import Logo from "../../components/Logo"

export default function Auth() {

    const [searchParams, setSearchParams] = useSearchParams()

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [authType, setAuthType] = useState(searchParams.get("type") ?? "log-in")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [hasConsented, setHasConsented] = useState(false)

    const navigate = useNavigate()

    function reset() {
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setHasConsented(false)
        setError(null)
        setSearchParams({})
    }

    async function submitAuth(event) {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        if (authType === "log-in") {
            try {
                await signInExistingUser(email, password)
                navigate("/")
            } catch(error) {
                const translatedError = checkErrorMessage(error)
                setError(translatedError)
            } finally {
                setIsLoading(false)
            }
        }

        if (authType === "sign-up") {

            if (password !== confirmPassword) {
                setError("Password confirmation doesn't match!")
                setIsLoading(false)
                return
            }
            if (hasConsented === false) {
                setError("Please agree to the Terms of Service and Privacy Policy!")
                setIsLoading(false)
                return
            }

            try { 
                const userCredential = await signUpNewUser(email, password)
                const user = userCredential.user
                await addToFirebaseWithId("profiles", user.uid, {isProfileCompleted: false})
                navigate("/onboarding")
            } catch (error) {
                const translatedError = checkErrorMessage(error)
                setError(translatedError)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <main className="auth">
            <Logo classes="auth_logo"/>
            <form 
                onSubmit={submitAuth} 
                className="auth_form"
            >
                <div className="auth_switch">
                    <button 
                        onClick={() => {
                            setAuthType("log-in")
                            reset()
                        }}
                        type="button"
                        className={`auth_type ${authType === "log-in" ? "chosen" : undefined}`}
                    >
                        Log in
                    </button>
                    <button 
                        onClick={() => {
                            setAuthType("sign-up")
                            reset()
                        }}
                        type="button"
                        className={`auth_type ${authType === "sign-up" ? "chosen" : undefined}`}
                    >
                        Sign up
                    </button>
                </div>
                <div className="auth_intro-text">
                    <h1>
                        {authType === "log-in"
                            ?   "Welcome back"
                            :   "Create an account"
                        }
                    </h1>
                    <p>
                        {authType === "log-in"
                            ?   "Log in to your guestme account"
                            :   "Find guest spotting opportunities in Europe"
                        }
                    </p>
                </div>
                <div className="auth_fields">
                    <Email 
                        className={error && error === "Please check your email address." ? "input_error" : undefined}
                        value={email}
                        onChange={event => {
                            setEmail(event.target.value)
                            setError(null)
                        }}
                    />
                    <Password 
                        className={error && error === "Please check your password." ? "input_error" : undefined}
                        value={password}
                        onChange={event => {
                            setPassword(event.target.value)
                            setError(null)
                        }}
                        password={password}
                    />
                    {authType === "sign-up" &&
                        <Password 
                            className={error && error === "Password confirmation doesn't match!" ? "input_error" : undefined}
                            value={confirmPassword}
                            onChange={event => {
                                setConfirmPassword(event.target.value)
                                setError(null)
                            }}
                            password={confirmPassword}
                            label="Confirm password"
                        />
                        }
                </div>
                {authType === "log-in"
                    ?
                        <div className="auth_forgot-password">
                            <Link to="../password-reset">
                                Forgot your password?
                            </Link>
                        </div>
                    :
                        <div className="auth_consent">
                            <input 
                                value={hasConsented}
                                onChange={() => setHasConsented(prev => !prev)}
                                id="consent"
                                type="checkbox"
                            />
                            <label
                                htmlFor="consent"
                            >
                                I agree to the <Link target="_blank" to="/terms-of-service">Terms of Service</Link> and <Link target="_blank" to="/privacy-policy">Privacy Policy</Link>
                            </label>
                        </div>
                    }
                {error && 
                    <p className="error-msg">{error}</p>
                    }
                <button className="auth_submit-button">
                    {isLoading 
                        ?   <TailSpin wrapperClass="create_btn_loader" color="var(--text-muted)"/> 
                        :   authType === "log-in" ? "Log in" : "Sign up"
                    }
                </button>
                <div className="auth_divider">
                    <span className="auth_divider_line"></span>
                    <span className="auth_divider_text">or</span>
                    <span className="auth_divider_line"></span>
                </div>
                <AuthGoogle setError={setError} />
            </form>
        </main>
    )
}