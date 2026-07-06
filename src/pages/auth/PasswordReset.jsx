import { useState } from "react"
import Email from "../../components/inputs/email"
import { resetPassword } from "../../utils"

export default function PasswordReset() {

    const [email, setEmail] = useState("")

    async function sendResetEmail(event) {
        event.preventDefault()

        try {
            await resetPassword(email)
            console.log("email sent")
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <form onSubmit={sendResetEmail}>
            <h2>Reset your password</h2>
            <p>Enter your email to receive a reset link.</p>
            <div className="auth_fields">
                <Email 
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                />
            </div>
            <button className="auth_submit-button">Send reset email</button>
        </form>
    )
}