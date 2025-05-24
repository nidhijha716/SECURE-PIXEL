const ProgressBar = ({ progress, label }) => {
  return (
    <div className="progress-container">
      <div className="progress-label">
        {label || "Processing..."} ({progress}%)
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
