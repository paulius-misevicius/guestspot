import { Mail, Lock } from "lucide-react"
import { signUpNewUser, verifyEmail, checkErrorMessage } from "../../utils"
import { Link, useNavigate } from "react-router"
import { useState } from "react"
import Email from "../../components/inputs/email"
import Password from "../../components/inputs/Password"
import AuthGoogle from "../../components/AuthGoogle"
import { TailSpin } from "react-loader-spinner"

export default function Signup() {

    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    async function createNewAccount(event) {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        try { 
            await signUpNewUser(email, password)
            setIsLoading(false)
            navigate("/")
        } catch (error) {
            const translatedError = checkErrorMessage(error)
            setError(translatedError)
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={createNewAccount} className="auth_form">
            <h2>Create a new account</h2>
            <p>Enter your email and choose a password.</p>
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
            {error && 
                <p className="error-msg">{error}</p>
                }
            <button className="auth_submit-button">
                {isLoading 
                    ? <TailSpin width="32" height="32" color="var(--text-muted)"/> 
                    : "Create account"
                }
            </button>
            <div className="auth_divider">
                <span className="auth_divider_line"></span>
                <span className="auth_divider_text">or</span>
                <span className="auth_divider_line"></span>
            </div>
            <AuthGoogle setError={setError} />
            <p className="auth_account-ask">Already have an account? <Link to="../log-in">Log in</Link> </p>
        </form>
    )
}