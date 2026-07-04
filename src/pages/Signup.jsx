import { Mail, Lock } from "lucide-react"
import { addUserToFirebase } from "../utils"

export default function Signup() {

    function createNewAccount(formData) {
        const email = formData.get("email")
        const password = formData.get("password")

        addUserToFirebase(email, password)
    }

    return (
        <section className="sign-up">
            <form action={createNewAccount} className="sign-up_form">
                <div className="sign-up_fields">
                    <div className="sign-up_field">
                        <label htmlFor="email">Email</label>
                        <div className="input-container">
                            <Mail className="input-icon sign-up_mail-icon" />
                            <input required name="email" id="email" type="email" />
                        </div>
                    </div>
                    <div className="sign-up_field">
                        <label htmlFor="password">Password</label>
                        <div className="input-container">
                            <Lock className="input-icon sign-up_password-icon" />
                            <input required name="password" id="password" type="password" />
                        </div>
                    </div>
                </div>
                <button className="sign-up_button">Create account</button>
            </form>
        </section>
    )
}