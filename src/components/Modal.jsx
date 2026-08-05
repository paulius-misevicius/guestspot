import { createPortal } from "react-dom"
import { X } from "lucide-react"
import "./components.css"
import FocusTrap from "focus-trap-react"
import { TailSpin } from "react-loader-spinner"

export default function Modal({ children, form, onSubmit, onClose, error, title, buttonText, link, buttonIcon, isLightboxOn, isLoading, info, setInfo, ariaLabel = "Submit button" }) {
    
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
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="modal-title"
                            >
                                <div className="modal_header">
                                    <h2 id="modal-title">{title}</h2>
                                    <button
                                        className="modal_close-btn"
                                        onClick={onClose}
                                        aria-label="Close dialog"
                                    >
                                        <X className="icon-14px icon-stroke"/>
                                    </button>
                                </div>
                                <div className="modal_content">{children}</div>
                                <div className="modal_footer">
                                    <button
                                        type="submit"
                                        className="modal_create-btn"
                                        aria-label={ariaLabel}
                                        aria-busy={isLoading}
                                    >
                                        {!isLoading ? buttonText : <TailSpin visible={isLoading} strokeWidth="3" wrapperClass="create_btn_loader" color="currentColor"/>}
                                    </button>
                                    {error && <p className="error-msg">{error}</p>}
                                    {info && <p className="info-msg">{info}</p>}
                                </div>
                            </form>
                        :
                            <div 
                                className="modal"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="modal-title"
                            >
                                <div className="modal_header">
                                    <h2 id="modal-title">{title}</h2>
                                    <button
                                        className="modal_close-btn"
                                        onClick={onClose}
                                        aria-label="Close dialog"
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
                                                aria-busy={isLoading}
                                                aria-label={ariaLabel}
                                            >
                                                {buttonIcon}
                                                {buttonText}
                                            </a>
                                        :
                                            <button
                                                className="modal_create-btn"
                                                aria-busy={isLoading}
                                                aria-label={ariaLabel}
                                            >
                                                {!isLoading ? buttonText : <TailSpin visible={isLoading} strokeWidth="3" wrapperClass="create_btn_loader" color="currentColor"/>}
                                            </button>
                                        }
                                    {error && <p role="alert" className="error-msg">{error}</p>}
                                    {info && <p role="status" aria-live="polite" className="info-msg">{info}</p>}
                                </div>
                            </div>
                        }
                </div>
            </FocusTrap>
        </>,
        document.getElementById("portal")
    )
}