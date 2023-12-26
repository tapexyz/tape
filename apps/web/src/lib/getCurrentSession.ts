import { parseJwt } from '@tape.xyz/generic'

import { hydrateAuthTokens } from './store/auth'

const getCurrentSession = () => {
  const { refreshToken } = hydrateAuthTokens()

  const currentSession = parseJwt(refreshToken || '')

  return {
    authorizationId: currentSession?.authorizationId,
    profileId: currentSession?.id
  }
}

export default getCurrentSession
