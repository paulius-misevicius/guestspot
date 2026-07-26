import { createPortal } from "react-dom"
import { X } from "lucide-react"
import "./components.css"
import FocusTrap from "focus-trap-react"
import { TailSpin } from "react-loader-spinner"

export default function Modal({ children, form, onSubmit, onClose, error, title, buttonText, link, buttonIcon, isLightboxOn, isLoading }) {
    
    return createPortal(
        <>
            <FocusTrap active={!isLightboxOn} focusTrapOptions={{clickOutsideDeactivates: true}} >
                <div>
                    <div className="content_overlay"/>
                    {form
                        ?
                            <form
                                className="modal"
                                onSubmit={onSubmit}
                            >
                                <div className="modal_header">
                                    <h2>{title}</h2>
                                    <button
                                        className="modal_close-btn"
                                        onClick={onClose}
                                    >
                                        <X className="icon-14px icon-stroke"/>
                                    </button>
                                </div>
                                <div className="modal_content">{children}</div>
                                <div className="modal_footer">
                                    <button
                                        type="submit"
                                        className="modal_create-btn"
                                    >
                                        {!isLoading ? buttonText : <TailSpin visible={isLoading} strokeWidth="3" wrapperClass="create_btn_loader" color="currentColor"/>}
                                    </button>
                                    {error && <p className="error-msg">{error}</p>}
                                </div>
                            </form>
                        :
                            <div className="modal">
                                <div className="modal_header">
                                    <h2>{title}</h2>
                                    <button
                                        className="modal_close-btn"
                                        onClick={onClose}
                                    >
                                        <X className="icon-14px icon-stroke"/>
                                    </button>
                                </div>
                                <div className="modal_content">{children}</div>
                                <div className="modal_footer">
                                    {link
                                        ?
                                            <a
                                                className="modal_create-btn link"
                                                href={link}
                                                target="_blank"
                                            >
                                                {buttonIcon}
                                                {buttonText}
                                            </a>
                                        :
                                            <button
                                                className="modal_create-btn"
                                            >
                                                {!isLoading ? buttonText : <TailSpin visible={isLoading} strokeWidth="3" wrapperClass="create_btn_loader" color="currentColor"/>}
                                            </button>
                                        }
                                    {error && <p className="error-msg">{error}</p>}
                                </div>
                            </div>
                        }
                </div>
            </FocusTrap>
        </>,
        document.getElementById("portal")
    )
}