export const getZoraChainInfo = (
  chain: number
): {
  logo: string
  name: string
} => {
  switch (chain) {
    case 1:
    case 5:
      return {
        logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg',
        name: chain === 1 ? 'Ethereum' : 'Goerli'
      }
    case 10:
    case 420:
      return {
        logo: 'https://zora.co/assets/icon/optimism-ethereum-op-logo.svg',
        name: chain === 10 ? 'Optimism' : 'Optimism Testnet'
      }
    case 7777777:
    case 999:
      return {
        logo: 'https://zora.co/assets/icon/zora-logo.svg',
        name: chain === 7777777 ? 'Zora' : 'Zora Testnet'
      }
    case 8453:
    case 84531:
      return {
        logo: 'https://zora.co/assets/icon/base-logo.svg',
        name: chain === 8453 ? 'Base' : 'Base Testnet'
      }
    case 424:
      return {
        logo: 'https://zora.co/assets/icon/pgn-logo.svg',
        name: 'PGN Network'
      }
    default:
      return {
        logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg',
        name: 'Ethereum'
      }
  }
}
