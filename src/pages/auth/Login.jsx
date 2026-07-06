import { useState } from "react"
import { signInExistingUser, checkErrorMessage, signInWithGoogle } from "../../utils"
import { Link, useNavigate } from "react-router"
import Email from "../../components/inputs/email"
import Password from "../../components/inputs/Password"
import AuthGoogle from "../../components/AuthGoogle"

export default function Login() {

    const [error, setError] = useState(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function logInWithEmailAndPassword(event) {
        event.preventDefault()
        setError(null)

        try {
            await signInExistingUser(email, password)
            navigate("/")
        } catch(error) {
            const translatedError = checkErrorMessage(error)
            setError(translatedError)
        }
    }

    return (
        <form onSubmit={logInWithEmailAndPassword} className="auth_form">
            <h2>Log in to your account</h2>
            <p>Enter your email and password to continue.</p>
            <div className="auth_fields">
                <Email 
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                />
                <Password 
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    password={password}
                />
            </div>
            <p className="auth_forgot-password">Forgot your password?</p>
            {error && 
                <p className="error-msg">{error}</p>
                }
            <button className="auth_submit-button">Log in</button>
            <div className="auth_divider">
                <span className="auth_divider_line"></span>
                <span className="auth_divider_text">or</span>
                <span className="auth_divider_line"></span>
            </div>
            <AuthGoogle />
            <p className="auth_account-ask">Don't have an account? <Link to="../sign-up">Sign up</Link> </p>
        </form>
    )
}