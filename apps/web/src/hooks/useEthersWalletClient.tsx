import type { TypedDataDomain } from 'viem'

import { usePublicClient, useWalletClient } from 'wagmi'

const useEthersWalletClient = (): {
  data: {
    signMessage: (message: string) => Promise<string>
  }
  isLoading: boolean
} => {
  const { data: signer, isLoading } = useWalletClient()
  const { estimateGas, getGasPrice, getTransaction } = usePublicClient()

  const ethersWalletClient = {
    estimateGas: () => estimateGas,
    getGasPrice: () => getGasPrice,
    getSigner: () => {
      return {
        ...signer,
        _signTypedData: async (
          domain: TypedDataDomain,
          types: any,
          message: any
        ) => {
          message['Transaction hash'] =
            '0x' + Buffer.from(message['Transaction hash']).toString('hex')
          const r = await signer?.signTypedData({
            domain,
            message,
            // Dont change to Irys
            primaryType: 'Bundlr',
            types
          })
          return r
        },
        getAddress: () => signer?.account.address
      }
    },
    getTransaction: () => getTransaction,
    signMessage: async (message: string): Promise<string> => {
      const signature = await signer?.signMessage({ message })
      return signature ?? ''
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signMessage, ...rest } = signer ?? {}

  const mergedWalletClient = {
    ...ethersWalletClient,
    ...rest
  }

  return { data: mergedWalletClient, isLoading }
}

export default useEthersWalletClient
