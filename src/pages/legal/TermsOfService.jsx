import ReactMarkdown from "react-markdown"
import tosText from "./text/terms-of-service.md?raw"
import "./legal.css"

export default function TermsOfService() {
    return (
        <div className="terms-of-service">
            <ReactMarkdown>{tosText}</ReactMarkdown>
        </div>
    )
}