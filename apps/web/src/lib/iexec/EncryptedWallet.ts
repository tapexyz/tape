import type WalletType from './walletType'

export type EncryptedWallet = {
  iv: string
  encryptedData: string
  walletType?: WalletType
  address?: string
}
