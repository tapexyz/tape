import { WORKER_TOWER_URL } from '@tape.xyz/constants'

import { parseJwt } from './functions/parseJwt'

let worker: Worker

if (typeof Worker !== 'undefined') {
  worker = new Worker(new URL('./worker', import.meta.url))
}

export const Tower = {
  track: (name: string, properties?: Record<string, unknown>) => {
    // if (IS_MAINNET && IS_PRODUCTION) {
    const tokenState = JSON.parse(
      localStorage.getItem('tape.auth.store') ||
        JSON.stringify({ state: { accessToken: '' } })
    )
    const actorId = parseJwt(tokenState.state.accessToken)?.id
    const { referrer } = document
    const referrerDomain = referrer ? new URL(referrer).hostname : null

    worker.postMessage({
      name,
      properties,
      actor: actorId,
      referrer: referrerDomain,
      url: location.href,
      platform: 'web'
    })

    worker.onmessage = function (event: MessageEvent) {
      const response = event.data
      const xhr = new XMLHttpRequest()
      xhr.open('POST', `${WORKER_TOWER_URL}/ingest`)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(response))
    }
    // }
  }
}
