import { create } from 'zustand'

interface NonceState {
  lensHubOnchainSigNonce: number
  setLensHubOnchainSigNonce: (nonce: number) => void
  lensTokenHandleRegistryOnchainSigNonce: number
  setLensTokenHandleRegistryOnchainSigNonce: (nonce: number) => void
  lensPublicActProxyOnchainSigNonce: number
  setLensPublicActProxyOnchainSigNonce: (nonce: number) => void
}

export const useNonceStore = create<NonceState>((set) => ({
  lensHubOnchainSigNonce: 0,
  setLensHubOnchainSigNonce: (nonce: number) =>
    set({ lensHubOnchainSigNonce: nonce }),
  lensTokenHandleRegistryOnchainSigNonce: 0,
  setLensTokenHandleRegistryOnchainSigNonce: (nonce: number) =>
    set({ lensTokenHandleRegistryOnchainSigNonce: nonce }),
  lensPublicActProxyOnchainSigNonce: 0,
  setLensPublicActProxyOnchainSigNonce: (nonce: number) =>
    set({ lensPublicActProxyOnchainSigNonce: nonce })
}))

export default useNonceStore
