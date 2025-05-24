"use client"

import { useState } from "react"
import { generateRandomKey } from "../utils/encryption"

const KeyGenerator = ({ onKeyGenerated }) => {
  const [keyLength, setKeyLength] = useState(32)

  const handleGenerateKey = () => {
    const key = generateRandomKey(keyLength)
    onKeyGenerated(key)
  }

  return (
    <div className="key-generator">
      <div className="key-generator-controls">
        <label htmlFor="keyLength">Key Length:</label>
        <input
          type="range"
          id="keyLength"
          min="16"
          max="64"
          step="8"
          value={keyLength}
          onChange={(e) => setKeyLength(Number(e.target.value))}
        />
        <span>{keyLength} bytes</span>
      </div>
      <button type="button" className="generate-key-button" onClick={handleGenerateKey}>
        Generate Secure Key
      </button>
    </div>
  )
}

export default KeyGenerator
