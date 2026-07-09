import { useState } from "react"
import { signInExistingUser, checkErrorMessage, signInWithGoogle } from "../../utils"
import { Link, useNavigate } from "react-router"
import Email from "./components/Email"
import Password from "./components/Password"
import AuthGoogle from "./components/AuthGoogle"
import { TailSpin } from "react-loader-spinner"

export default function Login() {

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function logInWithEmailAndPassword(event) {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await signInExistingUser(email, password)
            setIsLoading(false)
            navigate("/")
        } catch(error) {
            const translatedError = checkErrorMessage(error)
            setError(translatedError)
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={logInWithEmailAndPassword} className="auth_form">
            <h2>Log in to your account</h2>
            <p>Enter your email and password to continue.</p>
            <div className="auth_fields">
                <Email 
                    value={email}
                    onChange={event => {
                        setEmail(event.target.value)
                        setError(null)
                    }}
                />
                <Password 
                    value={password}
                    onChange={event => {
                        setPassword(event.target.value)
                        setError(null)
                    }}
                    password={password}
                />
            </div>
            <div className="auth_forgot-password">
                <Link to="../password-reset">
                    Forgot your password?
                </Link>
            </div>
            {error && 
                <p className="error-msg">{error}</p>
                }
            <button className="auth_submit-button">
                {isLoading 
                    ? <TailSpin width="32" height="32" color="var(--text-muted)"/> 
                    : "Log in"
                }
            </button>
            <div className="auth_divider">
                <span className="auth_divider_line"></span>
                <span className="auth_divider_text">or</span>
                <span className="auth_divider_line"></span>
            </div>
            <AuthGoogle setError={setError} />
            <p className="auth_account-ask">Don't have an account? <Link to="../sign-up">Sign up</Link> </p>
        </form>
    )
}