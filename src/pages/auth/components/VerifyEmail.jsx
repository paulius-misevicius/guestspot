import { useContext, useEffect, useState } from "react"
import { Link } from "react-router"
import { UserContext } from "../../../App"
import { signOutUser } from "../../../utils/firebase/auth"
import { LogOut, Send, BadgeCheck, BadgeX } from "lucide-react"
import { verifyEmail } from "../../../utils/firebase/auth"
import { checkErrorMessage } from "../../../utils/general"
import Logo from "../../../components/Logo"
import OnboardingScreen from "../../../components/OnboardingScreen"
import { TailSpin } from "react-loader-spinner"

export default function VerifyEmail() {

    const STATUS = {
        PENDING: "PENDING",
        SUCCESS: "SUCCESS",
        EXPIRED: "EXPIRED",
        ALREADY_VERIFIED: "ALREADY_VERIFIED"
    }

    const { user } = useContext(UserContext)
    const [error, setError] = useState(null)
    const [info, setInfo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState()

    useEffect(() => {
        if (user.emailVerified) setStatus(STATUS.ALREADY_VERIFIED)
    },[])

    console.log(user)

    async function sendEmailVerification() {
        setIsLoading(true)
        setError(null)
        setInfo("")

        if (status === STATUS.PENDING) {
            try {
                await verifyEmail()
                setInfo("Email sent!")
            } catch (error) {
                const errorMessage = checkErrorMessage(error)
                setError(errorMessage)
            } finally {
                setIsLoading(false)
            }
        }
        if (status === STATUS.EXPIRED) {
            try {
                await verifyEmail()
                setStatus(STATUS.PENDING)
            } catch (error) {
                const errorMessage = checkErrorMessage(error)
                setError(errorMessage)
            } finally {
                setIsLoading(false)
            }
        }
    }

    const CONTENT = {
        PENDING: {
            ICON: <Send />,
            TITLE: <h1>Verify your email</h1>,
            DESCRIPTION: <p>A verification link was sent to your email<span> {user?.email}</span>. Verify your email to start using the app.</p>,
            BUTTON: 
                <button
                    onClick={sendEmailVerification}
                >
                    {isLoading 
                        ?   <TailSpin wrapperClass="create_btn_loader" color="var(--surface-1)"/>
                        :   "Resend email"
                        }
                </button>
        },
        SUCCESS: {
            ICON: <BadgeCheck />,
            TITLE: <h1>Success! Your email is now verified.</h1>,
            DESCRIPTION: <p>Click the button below to continue to the app.</p>,
            BUTTON: 
                <Link
                    to="/listings"
                >
                    Continue
                </Link>
        },
        EXPIRED: {
            ICON: <BadgeX />,
            TITLE: <h1>Verification link has expired</h1>,
            DESCRIPTION: <p>The verification link you clicked has since expired. Press the button below to receive a new one.</p>,
            BUTTON: 
                <button
                    onClick={() => sendEmailVerification()}
                >
                    {isLoading 
                        ?   <TailSpin wrapperClass="create_btn_loader" color="var(--surface-1)"/>
                        :   "Receive a new link"
                        }
                </button>
        },
        ALREADY_VERIFIED: {
            ICON: <BadgeCheck />,
            TITLE: <h1>Your email has already been verified</h1>,
            DESCRIPTION: <p>No further verification is needed at this time.</p>,
            BUTTON: 
                <Link
                    to="/listings"
                >
                    Return home
                </Link>
        }
    }

    return (
        <OnboardingScreen>
            <div className="verification">
                {CONTENT?.[status]?.ICON}
                {CONTENT?.[status]?.TITLE}
                {CONTENT?.[status]?.DESCRIPTION}
                <div className="verification_btn-info">
                    {CONTENT?.[status]?.BUTTON}
                    {info && <p>{info}</p>}
                </div>
                {error && <p className="error-msg">{error}</p>}
            </div>
            <div></div>
        </OnboardingScreen>
    )
}