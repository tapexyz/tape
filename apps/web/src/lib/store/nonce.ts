import { create } from 'zustand'

interface NonceState {
  lensHubOnchainSigNonce: number
  setLensHubOnchainSigNonce: (nonce: number) => void
}

export const useNonceStore = create<NonceState>((set) => ({
  lensHubOnchainSigNonce: 0,
  setLensHubOnchainSigNonce: (nonce: number) =>
    set({ lensHubOnchainSigNonce: nonce })
}))

export default useNonceStore
