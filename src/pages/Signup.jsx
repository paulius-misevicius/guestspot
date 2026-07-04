import { Mail, Lock } from "lucide-react"

export default function Signup() {
    return (
        <section className="sign-up">
            <form className="sign-up_form">
                <div className="sign-up_fields">
                    <div className="sign-up_field">
                        <label htmlFor="email">Email</label>
                        <div className="input-container">
                            <Mail className="input-icon sign-up_mail-icon" />
                            <input id="email" type="email" />
                        </div>
                    </div>
                    <div className="sign-up_field">
                        <label htmlFor="password">Password</label>
                        <div className="input-container">
                            <Lock className="input-icon sign-up_password-icon" />
                            <input id="password" type="password" />
                        </div>
                    </div>
                </div>
                <button className="sign-up_button">Create account</button>
            </form>
        </section>
    )
}