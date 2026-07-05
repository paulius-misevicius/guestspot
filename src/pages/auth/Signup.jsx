import { Mail, Lock } from "lucide-react"
import { signUpNewUser, verifyEmail } from "../../utils"
import { Link, useNavigate } from "react-router"

export default function Signup() {

    const navigate = useNavigate()

    async function createNewAccount(formData) {
        const email = formData.get("email")
        const password = formData.get("password")

        try { 
            await signUpNewUser(email, password)
            await verifyEmail()
            navigate("/")
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <form action={createNewAccount} className="auth_form">
            <h2>Create a new account</h2>
            <p>Enter your email and choose a password.</p>
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
            <button className="auth_submit-button">Create account</button>
            <p className="auth_account-ask">Already have an account? <Link to="../log-in">Log in</Link> </p>
        </form>
    )
}