import CryptoJS from "crypto-js"

// AES-256 encryption
export const encrypt = (text, key) => {
  if (!text) return ""

  try {
    // Use the key to encrypt the message with AES
    const encrypted = CryptoJS.AES.encrypt(text, key).toString()
    return encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Encryption failed. Please check your key and try again.")
  }
}

// AES-256 decryption
export const decrypt = (encryptedText, key) => {
  if (!encryptedText) return ""

  try {
    // Use the key to decrypt the message with AES
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key)
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Decryption failed. Please check your key and try again.")
  }
}

// Generate a random encryption key
export const generateRandomKey = (length = 32) => {
  return CryptoJS.lib.WordArray.random(length).toString()
}

// Derive a key from a password
// export const deriveKeyFromPassword = (password, salt = null) => {
//   // Generate a salt if not provided
//    const useSalt = salt || CryptoJS.lib.WordArray.random(128 / 8).toString()

//   // Use PBKDF2 to derive a key from the password
//   const key = CryptoJS.PBKDF2(password, useSalt, {
//     keySize: 256 / 32,
//     iterations: 1000,
//   }).toString()

//   return {
//     key,
//     salt: useSalt,
//   }
// }

// Derive a key from a password (without using salt)
export const deriveKeyFromPassword = (password) => {
  const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Utf8.parse(""), {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString()

  return {
    key,
  }
}


