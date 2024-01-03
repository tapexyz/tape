import {
  IS_MAINNET,
  IS_PRODUCTION,
  WORKER_TOWER_URL
} from '@tape.xyz/constants'
import { LocalStore } from '@tape.xyz/lens/custom-types'

import { parseJwt } from './functions/parseJwt'

let worker: Worker

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./worker', import.meta.url))
}

export const Tower = {
  track: (name: string, properties?: Record<string, unknown>) => {
    if (IS_MAINNET && IS_PRODUCTION) {
      const tokenState = JSON.parse(
        localStorage.getItem(LocalStore.TAPE_AUTH_STORE) ||
          JSON.stringify({ state: { accessToken: '' } })
      )
      const actor = parseJwt(tokenState.state.accessToken)?.id
      const { referrer } = document
      const referrerDomain = referrer ? new URL(referrer).hostname : null
      const storedFingerprint = localStorage.getItem(
        LocalStore.TAPE_FINGERPRINT
      )

      worker.postMessage({
        name,
        properties,
        actor,
        fingerprint: storedFingerprint,
        referrer: referrerDomain,
        url: location.href,
        platform: 'web'
      })

      worker.onmessage = function (event: MessageEvent) {
        const response = event.data
        const xhr = new XMLHttpRequest()
        xhr.open('POST', WORKER_TOWER_URL)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(response))
      }
    }
  }
}
