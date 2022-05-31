import { STATIC_ASSETS } from '@utils/constants'

export const getWalletLogo = (id: string) => {
  switch (id) {
    case 'injected':
      return `${STATIC_ASSETS}/images/metamask.svg`
    case 'walletConnect':
      return `${STATIC_ASSETS}/images/walletconnect.svg`
    case 'coinbaseWallet':
      return `${STATIC_ASSETS}/images/coinbase.jpeg`
    default:
      return `${STATIC_ASSETS}/images/metamask.svg`
  }
}
