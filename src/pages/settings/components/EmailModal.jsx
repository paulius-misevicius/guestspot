import Modal from "../../../components/Modal"
import Email from "../../auth/components/Email"
import { useState, useContext } from "react"
import { UserContext } from "../../../App"
import { changeEmail } from "../../../utils/firebase/auth"
import { checkErrorMessage } from "../../../utils/general"

export default function EmailModal({isModalOpen, setIsModalOpen}) {

    const { user, profile } = useContext(UserContext)
    const [error, setError] = useState(null)
    const [info, setInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [confirmEmail, setConfirmEmail] = useState("")

    async function changeUserEmail() {
        event.preventDefault()
        setError(null)
        setInfo(null)
        setIsLoading(true)

        if (email.length === 0) {
            setError("Email field can't be empty!")
            setIsLoading(false)
            return
        }

        if (email !== confirmEmail) {
            setError("Email confirmation doesn't match!")
            setIsLoading(false)
            return
        }

        try {
            await changeEmail(email)
            setInfo(`Verification email sent to ${email}`)
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
            onSubmit={changeUserEmail}
            onClose={onClose}
            title="Change email"
            buttonText="Set new email"
            error={error}
            setError={setError}
            info={info}
            setInfo={setInfo}
            isLoading={isLoading}
        >
            <div className="auth_fields">
                <Email 
                    className={error && error === ("Please check your email address." || "Email field can't be empty!") ? "input_error" : undefined}
                    value={email}
                    onChange={event => {
                        setEmail(event.target.value)
                        setError(null)
                        setInfo(null)
                    }}
                    label="New email"
                    placeholder="new@email.com"
                />
                <Email 
                    className={error && error === "Email confirmation doesn't match!" ? "input_error" : undefined}
                    value={confirmEmail}
                    onChange={event => {
                        setConfirmEmail(event.target.value)
                        setError(null)
                        setInfo(null)
                    }}
                    label="Confirm email"
                    placeholder="new@email.com"
                />
            </div>
        </Modal>
    )
}