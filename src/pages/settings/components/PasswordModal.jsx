import Modal from "../../../components/Modal"
import Password from "../../auth/components/Password"
import { useState, useContext } from "react"
import { UserContext } from "../../../App"
import { changePassword } from "../../../utils/firebase/auth"
import { checkErrorMessage } from "../../../utils/general"

export default function PasswordModal({isModalOpen, setIsModalOpen}) {

    const { user, profile } = useContext(UserContext)
    const [error, setError] = useState(null)
    const [info, setInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    async function changeUserPassword() {
        event.preventDefault()
        setError(null)
        setInfo(null)
        setIsLoading(true)

        if (password.length < 8) {
            setError("Password must be at least 8 characters long!")
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError("Password confirmation doesn't match!")
            setIsLoading(false)
            return
        }

        try {
            await changePassword(password)
            setInfo("Your password has been changed!")
        } catch (error) {
            const translatedError = checkErrorMessage(error)
            setError(translatedError)
        } finally {
            setIsLoading(false)
        }
    }

    function onClose() {
        setIsModalOpen(false)
    }

    return (
        <Modal
            form
            onSubmit={changeUserPassword}
            onClose={onClose}
            title="Change password"
            buttonText="Set new password"
            error={error}
            setError={setError}
            info={info}
            setInfo={setInfo}
            isLoading={isLoading}
            ariaLabel="Confirm password change"
        >
            <div className="auth_fields">
                <Password 
                    className={error && (error === "Please check your password." || error === "Password must be at least 8 characters long!") ? "input_error" : undefined}
                    value={password}
                    onChange={event => {
                        setPassword(event.target.value)
                        setError(null)
                        setInfo(null)
                    }}
                    password={password}
                    label="New password"
                />
                <Password 
                    className={error && error === "Password confirmation doesn't match!" ? "input_error" : undefined}
                    value={confirmPassword}
                    onChange={event => {
                        setConfirmPassword(event.target.value)
                        setError(null)
                        setInfo(null)
                    }}
                    password={confirmPassword}
                    label="Confirm password"
                    confirm
                />
            </div>
        </Modal>
    )
}