import { formatFileSize } from "../utils/steganography"

const ImageMetadata = ({ metadata, className = "" }) => {
  if (!metadata) return null

  return (
    <div className={`metadata-container ${className}`}>
      <h4>Image Metadata</h4>
      <div className="metadata-grid">
        {metadata.width && metadata.height && (
          <div className="metadata-item">
            <span className="metadata-label">Dimensions:</span>
            <span className="metadata-value">
              {metadata.width} × {metadata.height} px
            </span>
          </div>
        )}

        {metadata.size && (
          <div className="metadata-item">
            <span className="metadata-label">File Size:</span>
            <span className="metadata-value">{formatFileSize(metadata.size)}</span>
          </div>
        )}

        {metadata.messageSize && (
          <div className="metadata-item">
            <span className="metadata-label">Message Size:</span>
            <span className="metadata-value">{metadata.messageSize} characters</span>
          </div>
        )}

        {metadata.bitsUsed && (
          <div className="metadata-item">
            <span className="metadata-label">Bits Used:</span>
            <span className="metadata-value">{metadata.bitsUsed} bits</span>
          </div>
        )}

        {metadata.timestamp && (
          <div className="metadata-item">
            <span className="metadata-label">Timestamp:</span>
            <span className="metadata-value">{new Date(metadata.timestamp).toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageMetadata
