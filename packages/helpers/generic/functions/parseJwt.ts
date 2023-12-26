type ReturnType = {
  authorizationId: string
  exp: number
  iat: number
  id: string
  role: string
}

const decoded = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary')

export const parseJwt = (token: string): ReturnType => {
  try {
    return JSON.parse(decoded(token.split('.')[1]))
  } catch (e) {
    return { authorizationId: '', exp: 0, iat: 0, id: '', role: '' }
  }
}
