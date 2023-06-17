import { ZERO_ADDRESS } from 'utils'
import { usePublicClient, useWalletClient } from 'wagmi'

const useEthersWalletClient = (): {
  data: {
    getAddress: () => Promise<`0x${string}`>
    signMessage: (message: string) => Promise<string>
  }
  isLoading: boolean
} => {
  const { data, isLoading } = useWalletClient()
  const { estimateGas, getGasPrice, getTransaction } = usePublicClient()

  const ethersWalletClient = {
    getAddress: async (): Promise<`0x${string}`> => {
      return (await data?.account.address) ?? ZERO_ADDRESS
    },
    signMessage: async (message: string): Promise<string> => {
      const signature = await data?.signMessage({ message })
      return signature ?? ''
    },
    getSigner: () => {
      return { ...data, getAddress: data?.getAddresses }
    },
    estimateGas: () => estimateGas,
    getGasPrice: () => getGasPrice,
    getTransaction: () => getTransaction
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signMessage, ...rest } = data ?? {}

  const mergedWalletClient = {
    ...ethersWalletClient,
    ...rest
  }

  return { data: mergedWalletClient, isLoading }
}

export default useEthersWalletClient
