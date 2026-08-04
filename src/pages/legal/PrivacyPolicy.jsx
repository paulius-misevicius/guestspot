import ReactMarkdown from "react-markdown"
import privacyText from "./text/privacy-policy.md?raw"
import "./legal.css"

export default function PrivacyPolicy() {
    return (
        <div className="privacy-policy">
            <ReactMarkdown>{privacyText}</ReactMarkdown>
        </div>
    )
}