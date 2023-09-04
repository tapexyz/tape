import { useAuthenticateMutation, useChallengeLazyQuery } from '@lenstube/lens'
import React, { useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

import usePersistStore from '@/persist'

const SignMessageButton = () => {
  const [loading, setLoading] = useState(false)
  const storeTokens = usePersistStore((state) => state.storeTokens)
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const [loadChallenge] = useChallengeLazyQuery({
    fetchPolicy: 'no-cache'
  })
  const [authenticate] = useAuthenticateMutation()

  const signMessage = async () => {
    if (!address) {
      return
    }

    try {
      setLoading(true)
      const challenge = await loadChallenge({
        variables: { request: { address } }
      })
      if (!challenge?.data?.challenge?.text) {
        return
      }

      const signature = await signMessageAsync({
        message: challenge?.data?.challenge?.text
      })

      if (!signature) {
        return
      }
      const { data } = await authenticate({
        variables: { request: { address, signature } }
      })
      const accessToken = data?.authenticate.accessToken
      const refreshToken = data?.authenticate.refreshToken
      storeTokens({ accessToken, refreshToken })
    } catch (error) {
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center">
      <button
        disabled={loading}
        className="rounded-xl border border-gray-800 bg-gray-900 px-6 py-2 focus:outline-none disabled:opacity-50"
        onClick={signMessage}
      >
        Sign message
      </button>
    </div>
  )
}

export default SignMessageButton
