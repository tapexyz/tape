const mainnetChains = ['eth', 'oeth', 'base', 'zora']

export const getZoraChainIsMainnet = (chain: string): boolean => {
  return mainnetChains.includes(chain)
}
