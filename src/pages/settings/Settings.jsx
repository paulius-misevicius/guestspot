import { useContext, useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, LogOut } from "lucide-react"
import { Link } from "react-router"
import { UserContext } from "../../App"
import { signOutUser, deleteAccount } from "../../utils/firebase/auth"
import BugReportModal from "./components/BugReportModal"
import { overwriteFirebaseDoc } from "../../utils/firebase/firestore"
import "./settings.css"
import PasswordModal from "./components/PasswordModal"
import EmailModal from "./components/EmailModal"
import { IS_DEMO } from "../../utils/demo"

export default function Settings() {

    const { user, profile, theme, setTheme, demoProfileType, setDemoProfileType } = useContext(UserContext)
    const [isDeletePressed, setIsDeletePressed] = useState(false)
    const [isBugModalOpen, setIsBugModalOpen] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

    async function logoutFromAccount() {
        try {
            await signOutUser()
        } catch (error) {
            console.error(error.message)
        }
    }

    async function deleteUserAccount() {
        try {
            await deleteAccount()
        } catch (error) {
            console.error(error.message)
        }
    }

    async function setThemePreference(event) {
        setTheme(event.target.value)

        try {
            await overwriteFirebaseDoc("profiles", user.uid, {...profile, themePref: event.target.value})
        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            {isBugModalOpen &&
                <BugReportModal
                    isModalOpen={isBugModalOpen}
                    setIsModalOpen={setIsBugModalOpen}
                />
                }
            {isPasswordModalOpen &&
                <PasswordModal
                    isModalOpen={isPasswordModalOpen}
                    setIsModalOpen={setIsPasswordModalOpen}
                />
                }
            {isEmailModalOpen &&
                <EmailModal
                    isModalOpen={isEmailModalOpen}
                    setIsModalOpen={setIsEmailModalOpen}
                />
                }
            <section className="settings">
                <div className="settings_header">
                    <Link
                        to="../profile"
                    >
                        <ChevronLeft className="icon-16px icon-stroke"/>
                        Profile
                    </Link>
                    <h1>Settings</h1>
                </div>
                <div className="settings_content">
                    <div>
                        <p className="settings_label">Account</p>
                        <div className="settings_block">
                            {IS_DEMO &&
                                <div className="settings_setting demo_profile_type_setting">
                                    <div>
                                        <p>Demo profile type</p>
                                    </div>
                                    <label className="sr-only" htmlFor="demo-profile-type-switcher">Theme</label>
                                    <select 
                                        id="demo-profile-type-switcher"
                                        className="settings_button"
                                        value={demoProfileType}
                                        onChange={event => setDemoProfileType(event.target.value)}
                                    >
                                        <option value="artist">Artist</option>
                                        <option value="studio">Studio</option>
                                    </select>
                                </div>
                            }
                            <div className="settings_setting">
                                <div className="email_setting">
                                    <p>Email</p>
                                    <p className="user-email trunctuate">{user.email}</p>
                                </div>
                                <button 
                                    onClick={() => setIsEmailModalOpen(true)}
                                    className={`settings_button ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                                    disabled={IS_DEMO}
                                    aria-label="Change email address"
                                >
                                    Change
                                </button>
                            </div>
                            <div className="settings_setting">
                                <p>Password</p>
                                <button 
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className={`settings_button ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                                    aria-label="Change password"
                                    disabled={IS_DEMO}
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="settings_label">Preferences</p>
                        <div className="settings_block">
                            <div className="settings_setting">
                                <p>Theme</p>
                                <label className="sr-only" htmlFor="theme-switcher">Theme</label>
                                <select 
                                    id="theme-switcher"
                                    className="settings_button"
                                    defaultValue={theme}
                                    onChange={setThemePreference}
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="settings_label">Support and legal</p>
                        <div className="settings_block">
                            <button 
                                onClick={() => setIsBugModalOpen(true)}
                                className="btn-setting settings_setting"
                            >
                                Report a bug
                                <ChevronRight className="icon-18px icon-stroke"/>
                            </button>
                            <Link 
                                target={IS_DEMO ? "" : "_blank"}
                                to={IS_DEMO ? "#" : "/privacy-policy"}
                                className={`btn-setting settings_setting ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                            >
                                Privacy policy
                                <ExternalLink className="icon-14px icon-stroke"/>
                            </Link>
                            <Link 
                                target={IS_DEMO ? "" : "_blank"}
                                to={IS_DEMO ? "#" : "/terms-of-service"}
                                className={`btn-setting settings_setting ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                            >
                                Terms of service
                                <ExternalLink className="icon-14px icon-stroke"/>
                            </Link>
                        </div>
                    </div>
                    <button 
                        onClick={logoutFromAccount}
                        className={`settings_setting log-out-btn ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                        aria-label="Log out of account"
                        disabled={IS_DEMO}
                    >
                        Log out
                        <LogOut className="icon-14px icon-stroke"/>
                    </button>
                    <div>
                        <p className="settings_label danger_label">Danger zone</p>
                        <div className={`settings_block danger-container ${isDeletePressed ? "" : "low-opacity"}`}>
                            <div className="settings_setting danger">
                                <div>
                                    <p>Delete account</p>
                                    <p className="user-email">
                                        {!isDeletePressed ? "This can't be undone" : "Are you sure you want to delete your account?"}
                                    </p>
                                </div>
                                {!isDeletePressed
                                    ?
                                        <button 
                                            onClick={() => setIsDeletePressed(true)}
                                            className={`settings_button ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                                            aria-label="Delete account"
                                            disabled={IS_DEMO}
                                        >
                                            Delete
                                        </button>
                                    :
                                        <button 
                                            onClick={deleteUserAccount}
                                            className={`settings_button ${IS_DEMO ? "demo_disabled-btn" : ""}`}
                                            aria-label="Confirm delete account - this action cannot be undone"
                                            disabled={IS_DEMO}
                                        >
                                            Confirm
                                        </button>
                                    }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}