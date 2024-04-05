export async function publicAsPem(publicKey: CryptoKey) {
  const publicKeyAsBuffer = await crypto.subtle.exportKey('spki', publicKey)

  let body = btoa(String.fromCharCode(...new Uint8Array(publicKeyAsBuffer)))
  body = body?.match(/.{1,64}/g)?.join('\n') || ''

  return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`
}

function toBase64(publicKeyAsPem: string) {
  return btoa(publicKeyAsPem)
}

async function formatPublicKeyForSMS(publicKey: CryptoKey) {
  const publicKeyAsPem = await publicAsPem(publicKey)
  return toBase64(publicKeyAsPem)
}

export async function generateKeyPair() {
  const isExtractable = true
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    isExtractable,
    ['encrypt', 'decrypt']
  )

  const formattedPublicKey = await formatPublicKeyForSMS(keyPair.publicKey)

  return {
    publicKey: formattedPublicKey, // <- PEM key encoded in base64
    privateKey: keyPair.privateKey
  }
}

export async function privateAsPem(privateKey: CryptoKey) {
  const privateKeyAsBuffer = await crypto.subtle.exportKey('pkcs8', privateKey)

  let body = btoa(String.fromCharCode(...new Uint8Array(privateKeyAsBuffer)))
  body = body.match(/.{1,64}/g)?.join('\n') || ''

  return `-----BEGIN PRIVATE KEY-----\n${body}\n-----END PRIVATE KEY-----`
}
