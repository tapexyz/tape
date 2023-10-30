import { parseJwt } from '@tape.xyz/generic'

import { hydrateAuthTokens } from './store/auth'

const getCurrentSessionUserId = (): string => {
  const { accessToken } = hydrateAuthTokens()

  const currentSession = parseJwt(accessToken || '')
  return currentSession?.id
}

export default getCurrentSessionUserId
