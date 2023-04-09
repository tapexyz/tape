type ReturnType = {
  exp: number
}

const decoded = (str: string): string =>
  Buffer.from(str, 'base64').toString('binary')

const parseJwt = (token: string): ReturnType => {
  try {
    return JSON.parse(decoded(token.split('.')[1]))
  } catch (e) {
    return { exp: 0 }
  }
}

export default parseJwt
