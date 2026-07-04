import { Mail, Lock } from "lucide-react"
import { signInExistingUser } from "../../utils"
import { Link } from "react-router"

export default function Login() {

    function loginToAccount(formData) {
        const email = formData.get("email")
        const password = formData.get("password")

        signInExistingUser(email, password)
    }

    return (
        <form action={loginToAccount} className="auth_form">
            <h2>Login with email</h2>
            <p>Enter your email and password.</p>
            <div className="auth_fields">
                <div className="auth_field">
                    <label htmlFor="email">Email</label>
                    <div className="input-container">
                        <Mail className="input-icon auth_mail-icon" />
                        <input required name="email" id="email" type="email" />
                    </div>
                </div>
                <div className="auth_field">
                    <label htmlFor="password">Password</label>
                    <div className="input-container">
                        <Lock className="input-icon auth_password-icon" />
                        <input required name="password" id="password" type="password" />
                    </div>
                </div>
            </div>
            <button className="auth_submit-button">Log in</button>
            <p className="auth_account-ask">Don't have an account? <Link to="../sign-up">Sign up</Link> </p>
        </form>
    )
}