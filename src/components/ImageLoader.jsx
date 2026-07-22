import { useState } from "react"

export default function ImageLoader({src, alt = "", className = "", imgClass, border, ...props}) {

    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className={`lazy-image-wrapper ${className} ${border ? "border-class" : ""}`}>
            {!isLoaded && <div className="lazy-image-skeleton" />}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                style={{ opacity: isLoaded ? 1 : 0 }}
                className={`lazy-image-img ${imgClass ? imgClass : ""}`}
                {...props}
            />
        </div>
    )
}