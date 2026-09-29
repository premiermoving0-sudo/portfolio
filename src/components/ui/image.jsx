import * as React from "react"

/**
 * Plain <img> wrapper. Accepts (and ignores) the old fittingType / focalPoint
 * props so existing call-sites keep working. Hides itself if the file is broken.
 */
const Image = React.forwardRef(
  ({ src, alt = "", fittingType, originWidth, originHeight, focalPointX, focalPointY, quality, onError, ...props }, ref) => {
    const [failed, setFailed] = React.useState(false)
    React.useEffect(() => setFailed(false), [src])
    if (!src || failed) return null
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={(e) => { setFailed(true); onError?.(e) }}
        {...props}
      />
    )
  }
)
Image.displayName = "Image"

export { Image }
