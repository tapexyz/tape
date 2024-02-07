import { HardhatUserConfig } from "hardhat/config";
import '@openzeppelin/hardhat-upgrades'
import '@nomicfoundation/hardhat-toolbox'

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  sourcify: {
    enabled: true
  },
  defaultNetwork: 'polygonMumbai',
  etherscan: {
    apiKey: {
      polygonMumbai: '<>'
    }
  },
  networks: {
    polygonMumbai: {
      accounts: [
        '<>'
      ],
      url: '<>'
    }
  }
}

export default config;
