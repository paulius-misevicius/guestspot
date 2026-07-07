import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function Password({password, ...rest}) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const passwordToggleIcon = 
        isPasswordVisible
            ? <EyeOff 
                className="input-icon input-icon_right-side icon-16px"
                onClick={() => setIsPasswordVisible(prev => !prev)} 
                /> 
            : <Eye 
                className="input-icon input-icon_right-side icon-16px"
                onClick={() => setIsPasswordVisible(prev => !prev)} 
                />

    return (
        <div className="auth_field">
            <label htmlFor="password">Password</label>
            <div className="input-container">
                <Lock className="input-icon icon-14px" />
                <input 
                    {...rest}
                    name="password" 
                    id="password" 
                    type={isPasswordVisible ? "text" : "password"}
                />
                {password.length > 0 && passwordToggleIcon}
            </div>
        </div>
    )
}