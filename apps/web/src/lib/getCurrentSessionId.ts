import { parseJwt } from '@tape.xyz/generic'

import { hydrateAuthTokens } from './store/auth'

const getCurrentSessionId = (): string => {
  const { accessToken } = hydrateAuthTokens()

  const currentSession = parseJwt(accessToken || '')
  return currentSession?.authorizationId
}

export default getCurrentSessionId
