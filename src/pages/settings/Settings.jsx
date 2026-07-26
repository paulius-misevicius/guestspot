import { useContext } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, LogOut } from "lucide-react"
import { Link } from "react-router"
import { UserContext } from "../../App"
import "./settings.css"

export default function Settings() {

    const { user } = useContext(UserContext)

    return (
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
                        <div className="settings_setting">
                            <div>
                                <p>Email</p>
                                <p className="user-email">{user.email}</p>
                            </div>
                            <button className="settings_button">
                                Change
                            </button>
                        </div>
                        <div className="settings_setting">
                            <p>Password</p>
                            <button className="settings_button">
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
                            <select className="settings_button">
                                <option>Light</option>
                                <option>Dark</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="settings_label">Support and legal</p>
                    <div className="settings_block">
                        <button className="btn-setting settings_setting">
                            Report a bug
                            <ChevronRight className="icon-18px icon-stroke"/>
                        </button>
                        <Link className="btn-setting settings_setting">
                            Privacy policy
                            <ExternalLink className="icon-14px icon-stroke"/>
                        </Link>
                        <Link className="btn-setting settings_setting">
                            Terms of service
                            <ExternalLink className="icon-14px icon-stroke"/>
                        </Link>
                    </div>
                </div>
                <button className="settings_setting log-out-btn">
                    Log out
                    <LogOut className="icon-14px icon-stroke"/>
                </button>
                <div>
                    <p className="settings_label danger_label">Danger zone</p>
                    <div className="settings_block danger-container">
                        <div className="settings_setting danger">
                            <div>
                                <p>Delete account</p>
                                <p className="user-email">This can't be undone</p>
                            </div>
                            <button className="settings_button">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}