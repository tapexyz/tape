require('dotenv').config()

import { HardhatUserConfig } from 'hardhat/config'
import '@openzeppelin/hardhat-upgrades'
import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  sourcify: {
    enabled: true
  },
  defaultNetwork: 'polygonMumbai',
  etherscan: {
    apiKey: { polygonMumbai: process.env.POLYGONSCAN_API_KEY! }
  },
  networks: {
    polygonMumbai: {
      accounts: [process.env.PRIVATE_KEY!],
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
    }
  }
}

export default config
