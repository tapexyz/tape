import { IS_MAINNET, IS_PRODUCTION } from '@tape.xyz/constants'
import { parseJwt } from '@tape.xyz/generic'
import { LocalStore } from '@tape.xyz/lens/custom-types'
import type { FC, ReactNode } from 'react'
import { useEffect } from 'react'

import { ServiceWorkerContext } from '@/hooks/useSw'

const ServiceWorkerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister()
        }

        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .catch(console.error)
      })
    }
  }, [])

  const addEventToQueue = (
    name: string,
    properties?: Record<string, unknown>
  ) => {
    if (!IS_PRODUCTION || !IS_MAINNET || !navigator.serviceWorker.controller) {
      return
    }

    const tokenState = JSON.parse(
      localStorage.getItem(LocalStore.TAPE_AUTH_STORE) ||
        JSON.stringify({ state: { accessToken: '' } })
    )
    const storedFingerprint = localStorage.getItem(LocalStore.TAPE_FINGERPRINT)
    const actor = parseJwt(tokenState.state.accessToken)?.id
    const { referrer } = document
    const referrerDomain = referrer ? new URL(referrer).hostname : null
    const event = {
      name,
      properties,
      actor,
      fingerprint: storedFingerprint,
      referrer: referrerDomain,
      url: location.href,
      platform: 'web'
    }
    navigator.serviceWorker.controller.postMessage({
      type: 'ADD_EVENT',
      payload: event
    })
  }

  return (
    <ServiceWorkerContext.Provider value={{ addEventToQueue }}>
      {children}
    </ServiceWorkerContext.Provider>
  )
}

export default ServiceWorkerProvider
