const hre = require('hardhat')

async function deployProxy() {
  const owner = '0xa8535b8049948bE1bFeb1404daEabbD407792411'
  const permissionlessCreator = '0x42b302BBB4fA27c21d32EdF602E4e2aA65746999'

  const TapePermissionlessCreator = await hre.ethers.getContractFactory(
    'TapePermissionlessCreator'
  )
  const deployProxy = await hre.upgrades.deployProxy(
    TapePermissionlessCreator,
    [owner, permissionlessCreator]
  )
  await deployProxy.waitForDeployment()

  console.log(
    `TapePermissonlessCreator deployed to ${await deployProxy.getAddress()}`
  )
}

async function upgradeProxy() {
  const PROXY_ADDRESS = '0x951F5E854d8D877bCd63B469228cd17f7932e6e9'

  const TapePermissionlessCreatorV2 = await hre.ethers.getContractFactory(
    'TapePermissonlessCreatorV2'
  )
  await hre.upgrades.upgradeProxy(PROXY_ADDRESS, TapePermissionlessCreatorV2)
  console.log('Proxy upgraded')
}

deployProxy().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

// upgradeProxy().catch((error) => {
//   console.error(error)
//   process.exitCode = 1
// })
