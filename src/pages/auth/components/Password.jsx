import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function Password({password, label = "Password", confirm, ...rest}) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const passwordToggleIcon = 
        isPasswordVisible
            ? <EyeOff 
                    className="icon-16px"
                /> 
            : <Eye 
                    className="icon-16px"
                />

    return (
        <div className="auth_field">
            <label htmlFor={confirm ? "confirm-password" : "password"}>{label}</label>
            <div className="input-container">
                <Lock className="input-icon icon-14px" />
                <input 
                    {...rest}
                    name={confirm ? "confirm-password" : "password"} 
                    id={confirm ? "confirm-password" : "password"} 
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="********"
                />
                {password.length > 0 && 
                    <button
                        className="input-icon input-icon_right-side"
                        type="button"
                        aria-pressed={isPasswordVisible}
                        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                        onClick={() => setIsPasswordVisible(prev => !prev)}
                    >
                        {passwordToggleIcon}
                    </button>
                }
            </div>
        </div>
    )
}