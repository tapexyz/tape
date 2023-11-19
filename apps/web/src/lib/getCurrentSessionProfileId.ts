import { parseJwt } from '@dragverse/generic'

import { hydrateAuthTokens } from './store/auth'

const getCurrentSessionProfileId = (): string => {
  const { accessToken } = hydrateAuthTokens()

  const currentSession = parseJwt(accessToken || '')
  return currentSession?.id
}

export default getCurrentSessionProfileId
