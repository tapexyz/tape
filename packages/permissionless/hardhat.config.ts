require('dotenv').config()
import '@openzeppelin/hardhat-upgrades'

import type { HardhatUserConfig } from 'hardhat/config'

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  sourcify: {
    enabled: true
  },
  etherscan: {
    apiKey: {
      polygon: process.env.POLYGONSCAN_API_KEY!,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!
    }
  },
  networks: {
    polygon: {
      accounts: [process.env.PRIVATE_KEY!],
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice: 400000000000
    },
    polygonMumbai: {
      accounts: [process.env.PRIVATE_KEY!],
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    }
  }
}

export default config
