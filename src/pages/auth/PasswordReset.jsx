import { useState } from "react"
import { resetPassword } from "../../utils/firebase/auth"
import Logo from "../../components/Logo"
import Email from "./components/Email"
import { Link } from "react-router"
import { TailSpin } from "react-loader-spinner"
import { checkErrorMessage } from "../../utils/general"
import { MoveLeft } from "lucide-react"

export default function PasswordReset() {

    const [email, setEmail] = useState("")
    const [error, setError] = useState(null)
    const [info, setInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function sendResetEmail(event) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)
        setInfo(null)

        try {
            await resetPassword(email)
            setInfo("Password reset email sent!")
        } catch (error) {
            const errorMsg = checkErrorMessage(error)
            setError(errorMsg)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="auth">
            <Logo classes="auth_logo"/>
            <form className="auth_form" onSubmit={sendResetEmail}>
                <Link
                    to="/auth?log-in"
                    className="password-reset_return-btn"
                    aria-label="Return to log-in page"
                >
                    <MoveLeft className="icon-14px icon-stroke-2"/>
                    Return to log-in
                </Link>
                <div className="password-reset_intro">
                    <h1>Reset your password</h1>
                    <p>Enter your email to receive a reset link.</p>
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
                </div>
                {error && 
                    <p className="error-msg">{error}</p>
                    }
                {info && 
                    <p className="info-msg">{info}</p>
                    }
                <button className="auth_submit-button">
                    {isLoading 
                        ?   <TailSpin wrapperClass="create_btn_loader" color="var(--text-muted)"/> 
                        :   "Send reset link"
                    }
                </button>
            </form>
        </main>
    )
}