import { useContext, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { UserContext } from "../../../App"
import { signOutUser } from "../../../utils/firebase/auth"
import { LogOut, Send, BadgeCheck, BadgeX, BadgeAlert } from "lucide-react"
import { verifyEmail } from "../../../utils/firebase/auth"
import { checkErrorMessage } from "../../../utils/general"
import Logo from "../../../components/Logo"
import OnboardingScreen from "../../../components/OnboardingScreen"
import { TailSpin } from "react-loader-spinner"

export default function Account() {

    const STATUS = {
        PENDING: "pending",
        SUCCESS: "SUCCESS",
        EXPIRED: "EXPIRED",
        ALREADY_VERIFIED: "ALREADY_VERIFIED",
        NOT_VERIFIED: "NOT_VERIFIED",
        RESET_PASSWORD: "RESET_PASSWORD"
    }

    const { user } = useContext(UserContext)
    const [error, setError] = useState(null)
    const [info, setInfo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [status, setStatus] = useState(searchParams.get("status") ?? null)
     
    console.log(status)

    useEffect(() => {
        if (!user) return

        if (searchParams.get("status") === null) {
            if (user.emailVerified) setStatus(STATUS.SUCCESS)
            if (!user.emailVerified) setStatus(STATUS.NOT_VERIFIED)
        }
        if (searchParams.get("status") === STATUS.PENDING && user.emailVerified) {
            setStatus(STATUS.SUCCESS)
        }
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
        if (status === STATUS.EXPIRED || status === STATUS.NOT_VERIFIED) {
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
        pending: {
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
                    Continue to app
                </Link>
        },
        NOT_VERIFIED: {
            ICON: <BadgeAlert />,
            TITLE: <h1>Your email has not yet been verified</h1>,
            DESCRIPTION: <p>You must verify your email to use the app. Press the button below to receive a verification link.</p>,
            BUTTON: 
                <button
                    onClick={() => sendEmailVerification()}
                >
                    {isLoading 
                        ?   <TailSpin wrapperClass="create_btn_loader" color="var(--surface-1)"/>
                        :   "Verify email"
                        }
                </button>
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