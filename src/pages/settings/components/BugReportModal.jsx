import { useState, useContext } from "react"
import { UserContext } from "../../../App"
import Modal from "../../../components/Modal"
import { addToFirebase } from "../../../utils/firebase/firestore"
import { checkErrorMessage } from "../../../utils/general"
import { serverTimestamp } from "firebase/firestore"

export default function BugReportModal({isModalOpen, setIsModalOpen}) {

    const { user, profile } = useContext(UserContext)
    const [error, setError] = useState(null)
    const [info, setInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [bugText, setBugText] = useState("")

    async function reportBug(event) {
        event.preventDefault()
        setError(null)
        setInfo(null)
        setIsLoading(true)

        if (bugText.length === 0) {
            setError("Report can't be empty!")
            setIsLoading(false)
            return
        }

        try {
            await addToFirebase("bugs", {
                bugReport: bugText,
                createdAt: serverTimestamp(), 
                userId: user.uid, 
                type: profile.type
            })
            setInfo("Your report was submitted. Thank you!")
        } catch (error) {
            const errMsg = checkErrorMessage(error)
            setError(errMsg)
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
            onSubmit={reportBug}
            onClose={onClose}
            title="Report a bug"
            buttonText="Submit report"
            error={error}
            setError={setError}
            info={info}
            setInfo={setInfo}
            isLoading={isLoading}
        >
            <div className="profile_modal_bio">
                <label htmlFor="bio">Bug description</label>
                <textarea
                    className="bio_textarea"
                    placeholder="Describe the bug you encountered in detail..."
                    value={bugText}
                    onChange={event => {
                        setBugText(event.target.value)
                        setError(null)
                        setInfo(null)
                    }}
                    name="bio"
                    id="bio"
                    rows="5"
                    maxLength="265"
                />
                <span>{bugText.length}/265</span>
            </div>
        </Modal>
    )
}