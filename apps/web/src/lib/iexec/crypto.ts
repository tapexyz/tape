import type { EncryptedWallet } from './EncryptedWallet'
import type IExecWalletPrivateInfo from './IExecWalletPrivateInfo'

const crypto = require('crypto-browserify') // or 'crypto' in Node.js
const algorithm = 'aes-256-cbc' // AES 256 CBC mode

const getKeyFromSignature = (signature: string): Buffer => {
  return Buffer.from(signature.substring(2, 34), 'utf-8')
}
// Encrypt function
export function encryptWithSignature(
  privateKeyToBeEncrypted: string,
  signature: string
): EncryptedWallet {
  // Symmetric key and initialization vector should be securely generated and shared between encryption and decryption processes
  const key = getKeyFromSignature(signature)
  //crypto.randomBytes(32); // Symmetric key: 32 bytes for AES-256
  const iv = crypto.randomBytes(16) // Initialization vector: 16 bytes for AES
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(privateKeyToBeEncrypted)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  let ret: EncryptedWallet = {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex')
  }
  return ret
}

// Decrypt function
export function decryptWithSignature(
  encryptedData: EncryptedWallet,
  signature: string
): IExecWalletPrivateInfo {
  let iv = Buffer.from(encryptedData.iv, 'hex')
  let encryptedText = Buffer.from(encryptedData.encryptedData, 'hex')
  let key = getKeyFromSignature(signature)
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return JSON.parse(decrypted.toString())
}
