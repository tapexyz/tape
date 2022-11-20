import logger from '../logger'

type ReturnType = {
  exp: number
}

export const parseJwt = (token: string): ReturnType => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    logger.error('Error Parse JWT', e)
    return { exp: 0 }
  }
}
