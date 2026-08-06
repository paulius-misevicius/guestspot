import { useContext, useEffect, useState } from "react"
import { Link, useSearchParams, Navigate, useNavigate } from "react-router"
import { UserContext } from "../../../App"
import { checkEmailVerification, reloadUser, resetUserPassword, signOutUser, verifyPasswordReset } from "../../../utils/firebase/auth"
import { LogOut, Send, BadgeCheck, BadgeX, BadgeAlert, KeyRound } from "lucide-react"
import { verifyEmail } from "../../../utils/firebase/auth"
import { checkErrorMessage } from "../../../utils/general"
import Logo from "../../../components/Logo"
import OnboardingScreen from "../../../components/OnboardingScreen"
import { TailSpin } from "react-loader-spinner"
import Password from "./Password"

export default function Account() {

    const STATUS = {
        PENDING: "pending",
        SUCCESS: "SUCCESS",
        EXPIRED: "EXPIRED",
        NOT_VERIFIED: "NOT_VERIFIED",
        RESET_PASSWORD: "RESET_PASSWORD",
        RESET_PASSWORD_EXPIRED: "RESET_PASSWORD_EXPIRED",
        RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",
        CHANGE_EMAIL: "CHANGE_EMAIL",
        CHANGE_EMAIL_EXPIRED: "CHANGE_EMAIL_EXPIRED"
    }

    const { user } = useContext(UserContext)
    const [error, setError] = useState(null)
    const [info, setInfo] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setSearchParams] = useSearchParams()
    const [status, setStatus] = useState(null)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [passResetEmail, setPassResetEmail] = useState("")

    let navigate = useNavigate()
     
    const mode = searchParams.get("mode")
    const oobCode = searchParams.get("oobCode")
    const paramStatus = searchParams.get("status")

    useEffect(() => {

        if (user && mode === "verifyEmail" && user.emailVerified) {
            setStatus(STATUS.SUCCESS)
            return
        }

        if (mode === "verifyEmail" || mode === "verifyAndChangeEmail") {
            async function isEmailVerificationValid() {
                try {
                    const response = await checkEmailVerification(oobCode)
                    if (mode === "verifyEmail") {
                        await reloadUser()
                        setStatus(STATUS.SUCCESS)
                    }
                    if (mode === "verifyAndChangeEmail") setStatus(STATUS.CHANGE_EMAIL)
                } catch (error) {
                    console.error(error.message)
                    if (error.message === "Firebase: Error (auth/invalid-action-code).") {
                        if (mode === "verifyEmail") setStatus(STATUS.EXPIRED)
                        if (mode === "verifyAndChangeEmail") setStatus(STATUS.CHANGE_EMAIL_EXPIRED)
                    }
                }
            }
            isEmailVerificationValid()
        } 
        if (mode === "resetPassword") {
            async function passwordReset() {
                try {
                    const userEmail = await verifyPasswordReset(oobCode)
                    setPassResetEmail(userEmail)
                    setStatus(STATUS.RESET_PASSWORD)
                } catch (error) {
                    console.error(error.message)
                    setStatus(STATUS.RESET_PASSWORD_EXPIRED)
                }
            }
            passwordReset()
        }
        if (paramStatus === "pending") {
            setStatus(STATUS.PENDING)
        }
        if (user && !mode && !paramStatus) {
            if (user.emailVerified) setStatus(STATUS.SUCCESS)
            if (!user.emailVerified) setStatus(STATUS.NOT_VERIFIED)
        }

    },[])

    async function changeUserPassword() {
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
            await resetUserPassword(oobCode, password)
            setStatus(STATUS.RESET_PASSWORD_SUCCESS)
        } catch (error) {
            const translatedError = checkErrorMessage(error)
            setError(translatedError)
        } finally {
            setIsLoading(false)
        }
    }

    async function sendEmailVerification() {
        if (!user) {
            navigate("/auth")
            return
        }

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

    async function logoutFromAccount() {
        try {
            await signOutUser()
            navigate("/auth")
        } catch (error) {
            console.error(error.message)
        }
    }

    const CONTENT = {
        pending: {
            ICON: <Send />,
            TITLE: <h1>Verify your email</h1>,
            DESCRIPTION: <p>A verification link was sent to your email<span> {user?.email}</span>. Verify your email to start using the app.</p>,
            BUTTON: 
                <button
                    className="verification_button"
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
                    className="verification_button"
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
                    className="verification_button"
                    onClick={() => sendEmailVerification()}
                >
                    {isLoading 
                        ?   <TailSpin wrapperClass="create_btn_loader" color="var(--surface-1)"/>
                        :   "Receive a new link"
                        }
                </button>
        },
        NOT_VERIFIED: {
            ICON: <BadgeAlert />,
            TITLE: <h1>Your email has not yet been verified</h1>,
            DESCRIPTION: <p>You must verify your email to use the app. Press the button below to receive a verification link.</p>,
            BUTTON: 
                <button
                    className="verification_button"
                    onClick={() => sendEmailVerification()}
                >
                    {isLoading 
                        ?   <TailSpin wrapperClass="create_btn_loader" color="var(--surface-1)"/>
                        :   "Verify email"
                        }
                </button>
        },
        CHANGE_EMAIL: {
            ICON: <BadgeCheck />,
            TITLE: <h1>Your email has been successfully changed!</h1>,
            DESCRIPTION: <p>Please sign in with your new email.</p>,
            BUTTON: 
                <button
                    className="verification_button"
                    onClick={logoutFromAccount}
                    aria-label="Sign out and go to log in"
                >
                    Return to log-in
                </button>
        },
        CHANGE_EMAIL_EXPIRED: {
            ICON: <BadgeX />,
            TITLE: <h1>Email change link has expired</h1>,
            DESCRIPTION: <p>You can request a new link in your account settings.</p>,
            BUTTON: 
                <Link
                    className="verification_button"
                    to="/listings"
                >
                    Continue to app
                </Link>
        },
        RESET_PASSWORD: {
            ICON: <KeyRound />,
            TITLE: <h1>Reset your password</h1>,
            DESCRIPTION: <p>Choose a new password for {passResetEmail === "" ? "account" : passResetEmail}</p>,
            BUTTON: 
            <div className="reset-password_container">
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
                <button
                    className="verification_button"
                    onClick={changeUserPassword}
                >
                    Set new password
                </button>
            </div>
        },
        RESET_PASSWORD_EXPIRED: {
            ICON: <BadgeX />,
            TITLE: <h1>Your password reset link has expired</h1>,
            DESCRIPTION: <p>You can request a new one by clicking "Forgot password?" in the log-in page.</p>,
            BUTTON: 
                <Link
                    className="verification_button"
                    to="/auth"
                >
                    Return to log-in
                </Link>
        },
        RESET_PASSWORD_SUCCESS: {
            ICON: <BadgeCheck />,
            TITLE: <h1>Your password has been successfully changed!</h1>,
            DESCRIPTION: <p>Please sign in using your new password.</p>,
            BUTTON: 
                <button
                    className="verification_button"
                    onClick={logoutFromAccount}
                    aria-label="Sign out and go to log in"
                >
                    Return to log-in
                </button>
        },
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
                {error && <p role="alert" className="error-msg">{error}</p>}
            </div>
            <div></div>
        </OnboardingScreen>
    )
}