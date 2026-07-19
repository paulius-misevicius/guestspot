import { createPortal } from "react-dom"

export default function Modal({ children }) {
    
    return createPortal(
        <>
            <div className="content_overlay"/>
            {children}
        </>,
        document.getElementById("portal")
    )
}