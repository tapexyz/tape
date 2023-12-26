type ReturnType = {
  id: string
  role: string
  authorizationId: string
  iat: number
  exp: number
}

const decoded = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary')

export const parseJwt = (token: string): ReturnType => {
  try {
    return JSON.parse(decoded(token.split('.')[1]))
  } catch (e) {
    return { id: '', role: '', authorizationId: '', iat: 0, exp: 0 }
  }
}
