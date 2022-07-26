import { STATIC_ASSETS } from '@utils/constants'

export const getWalletInfo = (id: string, name: string) => {
  switch (id) {
    case 'injected':
      if (name === 'MetaMask')
        return {
          logo: `${STATIC_ASSETS}/images/metamask.png`,
          label: 'MetaMask'
        }
      if (name === 'Brave Wallet')
        return {
          logo: `${STATIC_ASSETS}/images/brave-logo.png`,
          label: 'Brave'
        }
      if (name === 'Coinbase Wallet') return null
      else
        return {
          logo: `${STATIC_ASSETS}/images/wallet-logo.png`,
          label: name
        }
    case 'walletConnect':
      return {
        logo: `${STATIC_ASSETS}/images/rainbow-logo.png`,
        label: 'Rainbow'
      }
    case 'coinbaseWallet':
      return {
        logo: `${STATIC_ASSETS}/images/coinbase.jpeg`,
        label: 'Coinbase'
      }
    default:
      return { logo: `${STATIC_ASSETS}/images/metamask.svg`, label: 'Metamask' }
  }
}
