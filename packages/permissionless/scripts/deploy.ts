const hre = require('hardhat')

async function deployProxy() {
  // mainnet
  const owner = '0x01d79BcEaEaaDfb8fD2F2f53005289CFcF483464'
  const permissionlessCreator = '0x0b5e6100243f793e480DE6088dE6bA70aA9f3872'

  // testnet
  // const owner = '0xa8535b8049948bE1bFeb1404daEabbD407792411'
  // const permissionlessCreator = '0xCb4FB63c3f13CB83cCD6F10E9e5F29eC250329Cc'

  const TapePermissionlessCreator = await hre.ethers.getContractFactory(
    'TapePermissionlessCreator'
  )
  const deployProxy = await hre.upgrades.deployProxy(
    TapePermissionlessCreator,
    [owner, permissionlessCreator]
  )
  await deployProxy.waitForDeployment()

  const proxyAddress = await deployProxy.getAddress()
  console.log(`TapePermissonlessCreator Proxy deployed to ${proxyAddress}`)

  const currentImplAddress =
    await hre.upgrades.erc1967.getImplementationAddress(proxyAddress)
  console.log(
    `TapePermissonlessCreator Implementation deployed to ${currentImplAddress}`
  )
}

// async function upgradeProxy() {
//   const PROXY_ADDRESS = '0x68357D5F02a3913132577c7aC0847feade9a05aC'

//   const TapePermissionlessCreatorV2 = await hre.ethers.getContractFactory(
//     'TapePermissonlessCreatorV2'
//   )
//   await hre.upgrades.upgradeProxy(PROXY_ADDRESS, TapePermissionlessCreatorV2)
//   console.log('Proxy upgraded')
// }

deployProxy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

// upgradeProxy().catch((error) => {
//   console.error(error)
//   process.exitCode = 1
// })
