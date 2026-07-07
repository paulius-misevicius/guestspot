import { Mail } from "lucide-react"

export default function Email({...rest}) {
    return (
        <div className="auth_field">
            <label htmlFor="email">Email</label>
            <div className="input-container">
                <Mail className="input-icon icon-14px" />
                <input 
                    {...rest}
                    name="email" 
                    id="email" 
                    type="email" 
                />
            </div>
        </div>
    )
}