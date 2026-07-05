import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { signInExistingUser, checkErrorMessage } from "../../utils"
import { Link, useNavigate } from "react-router"

export default function Login() {

    const [error, setError] = useState(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function loginToAccount(event) {
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
        <form onSubmit={loginToAccount} className="auth_form">
            <h2>Login with email</h2>
            <p>Enter your email and password.</p>
            <div className="auth_fields">
                <div className="auth_field">
                    <label htmlFor="email">Email</label>
                    <div className="input-container">
                        <Mail className="input-icon auth_mail-icon" />
                        <input 
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            name="email" 
                            id="email" 
                            type="email" 
                        />
                    </div>
                </div>
                <div className="auth_field">
                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                        <Lock className="input-icon auth_password-icon" />
                        <input 
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            name="password" 
                            id="password" 
                            type="password" 
                        />
                    </div>
                </div>
            </div>
            {error && 
                <p className="error-msg">{error}</p>
                }
            <button className="auth_submit-button">Log in</button>
            <p className="auth_account-ask">Don't have an account? <Link to="../sign-up">Sign up</Link> </p>
        </form>
    )
}