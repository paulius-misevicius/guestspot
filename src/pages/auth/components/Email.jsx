import { Mail } from "lucide-react"

export default function Email({label = "Email", placeholder = "your@email.com", ...rest}) {
    return (
        <div className="auth_field">
            <label htmlFor="email">{label}</label>
            <div className="input-container">
                <Mail className="input-icon icon-14px" />
                <input 
                    {...rest}
                    name="email" 
                    id="email" 
                    type="email" 
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}