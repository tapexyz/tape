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
      polygonAmoy: process.env.POLYGONSCAN_API_KEY!
    },
    customChains: [
      {
        network: 'polygonAmoy',
        chainId: 80002,
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com'
        }
      }
    ]
  },
  networks: {
    polygon: {
      accounts: [process.env.PRIVATE_KEY!],
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice: 400000000000
    },
    polygonAmoy: {
      accounts: [process.env.PRIVATE_KEY!],
      url: `https://rpc.ankr.com/polygon_amoy`
    }
  }
}

export default config
