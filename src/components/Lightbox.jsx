import { createPortal } from "react-dom"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import "./components.css"
import ImageLoader from "./ImageLoader"
import FocusTrap from "focus-trap-react"
import { useState, useEffect, useRef } from "react"

export default function Lightbox({isLightboxOn, setIsLightboxOn, lightboxImage, gallery}) {

    const [currentImage, setCurrentImage] = useState(lightboxImage)
    const lightboxRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (lightboxRef.current && !lightboxRef.current.contains(event.target)) {
                setIsLightboxOn(false)
            }
        }

        if (isLightboxOn) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isLightboxOn])

    if (!isLightboxOn) return

    return createPortal(
        <>
            <div className="root-overlay"></div>
            <FocusTrap>
                <div 
                    className="lightbox" 
                    ref={lightboxRef}
                    role="dialog"
                    aria-modal="true"
                >
                    <ImageLoader 
                        key={currentImage} 
                        src={gallery[currentImage].image.large}
                        alt={`Lightbox image ${currentImage + 1}`}
                    />
                    <button 
                        className="lightbox_btn prev-btn"
                        aria-label="Go to previous image"
                        onClick={() => {
                            if (currentImage === 0) {
                                setCurrentImage(gallery.length - 1)
                            } else setCurrentImage(prev => prev - 1)
                        }}
                    >
                        <ChevronLeft className="icon-18px icon-stroke" />
                    </button>
                    <button 
                        className="lightbox_btn next-btn"
                        aria-label="Go to next image"
                        onClick={() => {
                            if (currentImage === (gallery.length - 1)) {
                                setCurrentImage(0)
                            } else setCurrentImage(prev => prev + 1)
                        }}
                    >
                        <ChevronRight className="icon-18px icon-stroke" />
                    </button>
                    <button
                        className="lightbox_btn close-btn"
                        aria-label="Close image lightbox modal"
                        onClick={() => setIsLightboxOn(false)}
                    >
                        <X className="icon-16px icon-stroke"/>
                    </button>
                </div>
            </FocusTrap>
        </>,
        document.getElementById("portal-lightbox")
    )
}