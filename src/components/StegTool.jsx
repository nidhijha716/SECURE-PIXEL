"use client"

import { useState, useEffect } from "react"
import { embedData, retrieveData, convertImageFormat } from "../utils/steganography"
import { encrypt, decrypt, deriveKeyFromPassword } from "../utils/encryption"
import ProgressBar from "./ProgressBar"
import ImageMetadata from "./ImageMetadata"
import KeyGenerator from "./KeyGenerator"
import { Lock, Eye, RefreshCw, Key } from "lucide-react"

const StegTool = () => {
  // Embed states
  const [embedImage, setEmbedImage] = useState(null)
  const [embedMessage, setEmbedMessage] = useState("")
  const [encryptionKey, setEncryptionKey] = useState("")
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState("")
  // const [salt, setSalt] = useState("")
  const [outputFilename, setOutputFilename] = useState("secure-pixel-output.png")
  const [outputFormat, setOutputFormat] = useState("image/png")
  const [embedResult, setEmbedResult] = useState("")
  const [embedLoading, setEmbedLoading] = useState(false)
  const [embedProgress, setEmbedProgress] = useState(0)
  const [embedPreview, setEmbedPreview] = useState(null)
  const [resultPreview, setResultPreview] = useState(null)
  const [embedMetadata, setEmbedMetadata] = useState(null)

  // Retrieve states
  const [retrieveImage, setRetrieveImage] = useState(null)
  const [decryptionKey, setDecryptionKey] = useState("")
  const [retrieveUsePassword, setRetrieveUsePassword] = useState(false)
  const [retrievePassword, setRetrievePassword] = useState("")
  // const [retrieveSalt, setRetrieveSalt] = useState("")
  const [retrieveResult, setRetrieveResult] = useState("")
  const [retrievedMessage, setRetrievedMessage] = useState("")
  const [retrieveLoading, setRetrieveLoading] = useState(false)
  const [retrieveProgress, setRetrieveProgress] = useState(0)
  const [retrievePreview, setRetrievePreview] = useState(null)
  const [retrieveMetadata, setRetrieveMetadata] = useState(null)

  // Effect to update filename extension based on format
  useEffect(() => {
    if (outputFilename) {
      const baseName = outputFilename.split(".")[0] || "secure-pixel-output"
      let extension = "png"

      if (outputFormat === "image/jpeg") extension = "jpg"
      else if (outputFormat === "image/bmp") extension = "bmp"

      setOutputFilename(`${baseName}.${extension}`)
    }
  }, [outputFormat])

  const handleEmbedImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setEmbedResult("Error: Please select a valid image file")
        return
      }

      setEmbedImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setEmbedPreview(e.target.result)
        setResultPreview(null) // Clear any previous result preview

        // Reset result and metadata when new image is selected
        setEmbedResult("")
        setEmbedMetadata(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRetrieveImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setRetrieveResult("Error: Please select a valid image file")
        return
      }

      setRetrieveImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setRetrievePreview(e.target.result)

        // Reset result and metadata when new image is selected
        setRetrieveResult("")
        setRetrievedMessage("")
        setRetrieveMetadata(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmbedSubmit = async (e) => {
    e.preventDefault()

    if (!embedImage) {
      setEmbedResult("Please select an image")
      return
    }

    if (!embedMessage) {
      setEmbedResult("Please enter a message to embed")
      return
    }

    if (usePassword) {
      if (!password) {
        setEmbedResult("Please enter a password")
        return
      }
    } else if (!encryptionKey) {
      setEmbedResult("Please enter an encryption key or generate one")
      return
    }

    try {
      setEmbedLoading(true)
      setEmbedProgress(0)
      setEmbedResult("Processing...")

      // Derive key from password if using password mode
      let finalKey = encryptionKey
      let usedSalt = null

      if (usePassword) {
        // const derivedKey = deriveKeyFromPassword(password, salt || null)
        // finalKey = derivedKey.key
        // usedSalt = derivedKey.salt
        // setSalt(usedSalt) // Store the salt for later use
        const derivedKey = deriveKeyFromPassword(password)
        finalKey = derivedKey.key

      }

      // Encrypt the message
      const encryptedMessage = encrypt(embedMessage, finalKey)

      // Embed the encrypted message into the image
      const { dataURL, metadata } = await embedData(embedImage, encryptedMessage, (progress) =>
        setEmbedProgress(progress),
      )

      // Convert to the selected output format if needed
      const finalDataURL = outputFormat !== "image/png" ? await convertImageFormat(dataURL, outputFormat) : dataURL

      // Set the result preview
      setResultPreview(finalDataURL)

      // Store metadata
      setEmbedMetadata({
        ...metadata,
        encryptionMethod: "AES-256",
        keyType: usePassword ? "Password-derived" : "Direct key",
        outputFormat: outputFormat.split("/")[1].toUpperCase(),
      })

      setEmbedResult("Message embedded successfully! Preview is shown below. Click the button to download.")

      // Create download link
      const downloadLink = document.createElement("a")
      downloadLink.href = finalDataURL
      downloadLink.download = outputFilename || "secure-pixel-output.png"
      downloadLink.className = "download-button"
      downloadLink.textContent = "Download Encoded Image"

      // Replace any existing download button
      const existingButton = document.getElementById("download-embed-button")
      if (existingButton) {
        existingButton.remove()
      }

      downloadLink.id = "download-embed-button"
      document.getElementById("embed-download-container").appendChild(downloadLink)
    } catch (error) {
      console.error("Error embedding data:", error)
      setEmbedResult(`Error: ${error.message || "Failed to embed data"}`)
    } finally {
      setEmbedLoading(false)
    }
  }

  // const handleRetrieveSubmit = async (e) => {
  //   e.preventDefault()

  //   if (!retrieveImage) {
  //     setRetrieveResult("Please select an image")
  //     return
  //   }

  //   // if (retrieveUsePassword) {
  //   //   if (!retrievePassword) {
  //   //     setRetrieveResult("Please enter a password")
  //   //     return
  //   //   }
  //   // } 
  //   if (retrieveUsePassword) {
  //     const derivedKey = deriveKeyFromPassword(retrievePassword)
  //     finalKey = derivedKey.key
  //   }
    
  //   else if (!decryptionKey) {
  //     setRetrieveResult("Please enter a decryption key")
  //     return
  //   }

  //   try {
  //     setRetrieveLoading(true)
  //     setRetrieveProgress(0)
  //     setRetrieveResult("Processing...")

  //     // Derive key from password if using password mode
  //     let finalKey = decryptionKey

  //     // if (retrieveUsePassword) {
  //     //   if (!retrieveSalt) {
  //     //     setRetrieveResult("Error: Salt is required for password-based decryption")
  //     //     setRetrieveLoading(false)
  //     //     return
  //     //   }

  //     //   const derivedKey = deriveKeyFromPassword(retrievePassword, retrieveSalt)
  //     //   finalKey = derivedKey.key
  //     // }

  //     // Extract the hidden data from the image
  //     const { message, metadata } = await retrieveData(retrieveImage, (progress) => setRetrieveProgress(progress))

  //     // Store metadata
  //     setRetrieveMetadata(metadata)

  //     // Decrypt the extracted data
  //     const decryptedMessage = decrypt(message, finalKey)

  //     setRetrieveResult("Message retrieved successfully!")
  //     setRetrievedMessage(decryptedMessage)
  //   } catch (error) {
  //     console.error("Error retrieving data:", error)
  //     setRetrieveResult(`Error: ${error.message || "Failed to retrieve data"}`)
  //     setRetrievedMessage("")
  //   } finally {
  //     setRetrieveLoading(false)
  //   }
  // }

  const handleRetrieveSubmit = async (e) => {
    e.preventDefault()
  
    if (!retrieveImage) {
      setRetrieveResult("Please select an image")
      return
    }
  
    let finalKey // ✅ Declare it here
  
    if (retrieveUsePassword) {
      if (!retrievePassword) {
        setRetrieveResult("Please enter a password")
        return
      }
      const derivedKey = deriveKeyFromPassword(retrievePassword)
      finalKey = derivedKey.key
    } else {
      if (!decryptionKey) {
        setRetrieveResult("Please enter a decryption key")
        return
      }
      finalKey = decryptionKey
    }
  
    try {
      setRetrieveLoading(true)
      setRetrieveProgress(0)
      setRetrieveResult("Processing...")
  
      const { message, metadata } = await retrieveData(
        retrieveImage,
        (progress) => setRetrieveProgress(progress)
      )
  
      setRetrieveMetadata(metadata)
  
      const decryptedMessage = decrypt(message, finalKey)
  
      setRetrieveResult("Message retrieved successfully!")
      setRetrievedMessage(decryptedMessage)
    } catch (error) {
      console.error("Error retrieving data:", error)
      setRetrieveResult(`Error: ${error.message || "Failed to retrieve data"}`)
      setRetrievedMessage("")
    } finally {
      setRetrieveLoading(false)
    }
  }
  

  const handleGeneratedKey = (key) => {
    setEncryptionKey(key)
  }

  return (
    <section id="steg-tool" className="section">
      <h2 className="section-title">Steganography Tool</h2>
      <p className="section-description">
        Securely hide your messages in images using AES-256 encryption and steganography
      </p>

      <div className="container">
        {/* Embed Data Section */}
        <div className="embed-section">
          <h3>
            <Lock className="section-icon" />
            Embed Data
          </h3>
          <form id="embedForm" onSubmit={handleEmbedSubmit}>
            <div className="form-group">
              <label htmlFor="embedImage">Select Image:</label>
              <input
                type="file"
                id="embedImage"
                accept="image/png, image/jpeg, image/bmp"
                onChange={handleEmbedImageChange}
                disabled={embedLoading}
                required
              />
              {embedPreview && (
                <div className="image-preview">
                  <img src={embedPreview || "/placeholder.svg"} alt="Original" />
                  <span className="preview-label">Original Image</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="embedMessage">Message to Embed:</label>
              <textarea
                id="embedMessage"
                rows="4"
                placeholder="Enter your secret message here..."
                value={embedMessage}
                onChange={(e) => setEmbedMessage(e.target.value)}
                disabled={embedLoading}
                required
              />
              <div className="char-counter">{embedMessage.length} characters</div>
            </div>

            <div className="form-group">
              <div className="encryption-toggle">
                <label>Encryption Method:</label>
                <div className="toggle-buttons">
                  <button
                    type="button"
                    className={`toggle-button ${!usePassword ? "active" : ""}`}
                    onClick={() => setUsePassword(false)}
                    disabled={embedLoading}
                  >
                    <Key size={16} />
                    Direct Key
                  </button>
                  <button
                    type="button"
                    className={`toggle-button ${usePassword ? "active" : ""}`}
                    onClick={() => setUsePassword(true)}
                    disabled={embedLoading}
                  >
                    <Lock size={16} />
                    Password
                  </button>
                </div>
              </div>
            </div>

            {usePassword ? (
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={embedLoading}
                  required={usePassword}
                />
                <div className="password-strength">
                  <div
                    className={`strength-meter ${password.length > 12 ? "strong" : password.length > 8 ? "medium" : "weak"}`}
                  ></div>
                  <span>{password.length > 12 ? "Strong" : password.length > 8 ? "Medium" : "Weak"}</span>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="encryptionKey">Encryption Key (AES-256):</label>
                <div className="key-input-group">
                  <input
                    type="text"
                    id="encryptionKey"
                    placeholder="Enter or generate an encryption key"
                    value={encryptionKey}
                    onChange={(e) => setEncryptionKey(e.target.value)}
                    disabled={embedLoading}
                    required={!usePassword}
                  />
                </div>
                <KeyGenerator onKeyGenerated={handleGeneratedKey} />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="outputFormat">Output Format:</label>
              <select
                id="outputFormat"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                disabled={embedLoading}
              >
                <option value="image/png">PNG (Recommended)</option>
                <option value="image/jpeg">JPEG</option>
                <option value="image/bmp">BMP</option>
              </select>
              <div className="format-info">PNG is recommended for best quality and lossless compression</div>
            </div>

            <div className="form-group">
              <label htmlFor="outputFilename">Output Filename:</label>
              <input
                type="text"
                id="outputFilename"
                placeholder="output.png"
                value={outputFilename}
                onChange={(e) => setOutputFilename(e.target.value)}
                disabled={embedLoading}
                required
              />
            </div>

            {embedLoading && <ProgressBar progress={embedProgress} label="Embedding data" />}

            <button type="submit" className="submit-button" disabled={embedLoading}>
              {embedLoading ? (
                <>
                  <RefreshCw className="spin-icon" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock />
                  Embed Data
                </>
              )}
            </button>
          </form>

          <div
            id="embedResult"
            className={`result ${embedResult ? "show" : ""} ${embedResult.includes("Error") ? "error" : ""}`}
          >
            {embedResult}
          </div>

          {resultPreview && (
            <div className="result-preview">
              <h4>
                <Eye />
                Result Preview
              </h4>
              <div className="image-preview">
                <img src={resultPreview || "/placeholder.svg"} alt="Result" />
              </div>
              <ImageMetadata metadata={embedMetadata} />
            </div>
          )}

          <div id="embed-download-container" className="download-container"></div>
        </div>

        {/* Retrieve Data Section */}
        <div className="retrieve-section">
          <h3>
            <Eye className="section-icon" />
            Retrieve Data
          </h3>
          <form id="retrieveForm" onSubmit={handleRetrieveSubmit}>
            <div className="form-group">
              <label htmlFor="retrieveImage">Select Encoded Image:</label>
              <input
                type="file"
                id="retrieveImage"
                accept="image/png, image/jpeg, image/bmp"
                onChange={handleRetrieveImageChange}
                disabled={retrieveLoading}
                required
              />
              {retrievePreview && (
                <div className="image-preview">
                  <img src={retrievePreview || "/placeholder.svg"} alt="Encoded" />
                  <span className="preview-label">Encoded Image</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <div className="encryption-toggle">
                <label>Decryption Method:</label>
                <div className="toggle-buttons">
                  <button
                    type="button"
                    className={`toggle-button ${!retrieveUsePassword ? "active" : ""}`}
                    onClick={() => setRetrieveUsePassword(false)}
                    disabled={retrieveLoading}
                  >
                    <Key size={16} />
                    Direct Key
                  </button>
                  <button
                    type="button"
                    className={`toggle-button ${retrieveUsePassword ? "active" : ""}`}
                    onClick={() => setRetrieveUsePassword(true)}
                    disabled={retrieveLoading}
                  >
                    <Lock size={16} />
                    Password
                  </button>
                </div>
              </div>
            </div>

            {retrieveUsePassword ? (
              <>
                <div className="form-group">
                  <label htmlFor="retrievePassword">Password:</label>
                  <input
                    type="password"
                    id="retrievePassword"
                    placeholder="Enter the password used for encryption"
                    value={retrievePassword}
                    onChange={(e) => setRetrievePassword(e.target.value)}
                    disabled={retrieveLoading}
                    required={retrieveUsePassword}
                  />
                </div>
                {/* <div className="form-group">
                  <label htmlFor="retrieveSalt">Salt (required for password-based decryption):</label>
                  <input
                    type="text"
                    id="retrieveSalt"
                    placeholder="Enter the salt used during encryption"
                    value={retrieveSalt}
                    onChange={(e) => setRetrieveSalt(e.target.value)}
                    disabled={retrieveLoading}
                    required={retrieveUsePassword}
                  />
                  <div className="salt-info">
                    The salt is required for password-based decryption and should have been provided with the encrypted
                    image
                  </div>
                </div>
              </> */}
            //</>) : (
              <div className="form-group">
                <label htmlFor="decryptionKey">Decryption Key (AES-256):</label>
                <input
                  type="text"
                  id="decryptionKey"
                  placeholder="Enter the encryption key used"
                  value={decryptionKey}
                  onChange={(e) => setDecryptionKey(e.target.value)}
                  disabled={retrieveLoading}
                  required={!retrieveUsePassword}
                />
              </div>
            )}

            {retrieveLoading && <ProgressBar progress={retrieveProgress} label="Retrieving data" />}

            <button type="submit" className="submit-button" disabled={retrieveLoading}>
              {retrieveLoading ? (
                <>
                  <RefreshCw className="spin-icon" />
                  Processing...
                </>
              ) : (
                <>
                  <Eye />
                  Retrieve Data
                </>
              )}
            </button>
          </form>

          <div
            id="retrieveResult"
            className={`result ${retrieveResult ? "show" : ""} ${retrieveResult.includes("Error") ? "error" : ""}`}
          >
            {retrieveResult}
          </div>

          {retrievedMessage && (
            <div id="retrievedMessageContainer" className="retrieved-message">
              <h4>Retrieved Message:</h4>
              <div className="message-box">{retrievedMessage}</div>
              <ImageMetadata metadata={retrieveMetadata} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default StegTool

