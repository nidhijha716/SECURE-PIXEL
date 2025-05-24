// Function to embed data into an image using LSB steganography
export const embedData = (imageFile, message, progressCallback = () => {}) => {
  return new Promise((resolve, reject) => {
    try {
      progressCallback(0)
      const reader = new FileReader()
      reader.onload = (event) => {
        progressCallback(10)
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          try {
            progressCallback(30)
            // Create canvas and get context
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            canvas.width = img.width
            canvas.height = img.height

            // Draw image on canvas
            ctx.drawImage(img, 0, 0)
            progressCallback(40)

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            progressCallback(50)

            // Convert message to binary
            const binaryMessage = stringToBinary(message)
            progressCallback(60)

            // Check if the image is large enough to hold the message
            if (binaryMessage.length > (data.length / 4) * 3) {
              reject(new Error("Message is too large for this image"))
              return
            }

            // Add message length at the beginning (32 bits for length)
            const messageLength = binaryMessage.length
            const binaryLength = messageLength.toString(2).padStart(32, "0")

            // Embed message length
            for (let i = 0; i < 32; i++) {
              // Modify the least significant bit of each color channel
              data[i * 4] = (data[i * 4] & 0xfe) | Number.parseInt(binaryLength[i])
            }
            progressCallback(70)

            // Embed the actual message
            for (let i = 0; i < binaryMessage.length; i++) {
              // Calculate position (after the 32 bits used for length)
              const position = (i + 32) * 4

              // Modify the least significant bit
              data[position] = (data[position] & 0xfe) | Number.parseInt(binaryMessage[i])

              // Update progress every 1000 bits
              if (i % 1000 === 0) {
                const progress = 70 + Math.floor((i / binaryMessage.length) * 25)
                progressCallback(progress)
              }
            }

            // Put the modified image data back on the canvas
            ctx.putImageData(imageData, 0, 0)
            progressCallback(95)

            // Get image metadata
            const metadata = {
              width: img.width,
              height: img.height,
              size: imageFile.size,
              messageSize: message.length,
              bitsUsed: binaryMessage.length,
              timestamp: new Date().toISOString(),
            }

            progressCallback(100)
            resolve({
              dataURL: canvas.toDataURL("image/png"),
              metadata,
            })
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = () => {
          reject(new Error("Failed to load image"))
        }
        img.src = event.target.result
      }
      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      reject(error)
    }
  })
}

// Function to retrieve data from an image
export const retrieveData = (imageFile, progressCallback = () => {}) => {
  return new Promise((resolve, reject) => {
    try {
      progressCallback(0)
      const reader = new FileReader()
      reader.onload = (event) => {
        progressCallback(20)
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          try {
            progressCallback(40)
            // Create canvas and get context
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            canvas.width = img.width
            canvas.height = img.height

            // Draw image on canvas
            ctx.drawImage(img, 0, 0)
            progressCallback(60)

            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data

            // Extract message length (first 32 bits)
            let binaryLength = ""
            for (let i = 0; i < 32; i++) {
              binaryLength += data[i * 4] & 1
            }

            const messageLength = Number.parseInt(binaryLength, 2)
            progressCallback(70)

            // Check if the length is valid
            if (isNaN(messageLength) || messageLength <= 0 || messageLength > (data.length / 4) * 3) {
              reject(new Error("Invalid or corrupted data"))
              return
            }

            // Extract the message
            let binaryMessage = ""
            for (let i = 0; i < messageLength; i++) {
              const position = (i + 32) * 4
              binaryMessage += data[position] & 1

              // Update progress every 1000 bits
              if (i % 1000 === 0) {
                const progress = 70 + Math.floor((i / messageLength) * 25)
                progressCallback(progress)
              }
            }

            // Convert binary message back to string
            const message = binaryToString(binaryMessage)
            progressCallback(100)

            // Get image metadata
            const metadata = {
              width: img.width,
              height: img.height,
              size: imageFile.size,
              timestamp: new Date().toISOString(),
            }

            resolve({ message, metadata })
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = () => {
          reject(new Error("Failed to load image"))
        }
        img.src = event.target.result
      }
      reader.onerror = () => {
        reject(new Error("Failed to read file"))
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      reject(error)
    }
  })
}

// Function to convert image to different formats
export const convertImageFormat = (dataURL, format = "image/png", quality = 0.92) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)

        // Convert to the requested format
        const convertedDataURL = canvas.toDataURL(format, quality)
        resolve(convertedDataURL)
      }
      img.onerror = () => {
        reject(new Error("Failed to load image for conversion"))
      }
      img.src = dataURL
    } catch (error) {
      reject(error)
    }
  })
}

// Helper function to convert string to binary
const stringToBinary = (str) => {
  let binary = ""
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    const binaryChar = charCode.toString(2).padStart(8, "0")
    binary += binaryChar
  }
  return binary
}

// Helper function to convert binary to string
const binaryToString = (binary) => {
  let str = ""
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8)
    const charCode = Number.parseInt(byte, 2)
    str += String.fromCharCode(charCode)
  }
  return str
}

// Get file size in human-readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
