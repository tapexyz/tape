import { useDynamicContext } from '@dynamic-labs/sdk-react'
import { useAuthenticateMutation, useChallengeLazyQuery } from '@lenstube/lens'
import React from 'react'

const SignMessageButton = () => {
  const { primaryWallet } = useDynamicContext()

  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  })
  const [authenticate] = useAuthenticateMutation()

  const signMessage = async () => {
    if (!primaryWallet?.connector) {
      return
    }

    const { address } = primaryWallet

    const challenge = await loadChallenge({
      variables: { request: { address } }
    })
    if (!challenge?.data?.challenge?.text) {
      return
    }

    const signature = await primaryWallet.connector.signMessage(
      challenge?.data?.challenge?.text
    )

    if (!signature) {
      return
    }
    const result = await authenticate({
      variables: { request: { address, signature } }
    })

    console.log('signature', result)
  }

  return (
    <button
      className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-2 focus:outline-none"
      onClick={signMessage}
    >
      Sign message
    </button>
  )
}

export default SignMessageButton
