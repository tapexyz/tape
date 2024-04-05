import type WalletType from './walletType'

type IExecWalletPrivateInfo = {
  address: string
  privateKey: string
  owner: string
  collectionTokenId?: number
  beneficiaryKey?: string
  walletType: WalletType
}

export default IExecWalletPrivateInfo
