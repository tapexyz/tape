export const LENS_API_URL = 'https://api-v2.lens.dev/'
export const PUBLIC_ETHEREUM_NODE = 'https://ethereum.publicnode.com'
export const IRYS_NODE_URL = 'https://arweave.mainnet.irys.xyz/tx/matic'

export const ERROR_MESSAGE = 'Something went wrong'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TAPE_SIGNUP_PROXY_ADDRESS =
  '0xD0f6d9676d36F5f4AF5765fCb78c388B51577327'
export const TAPE_SIGNUP_PROXY_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'address', name: 'followModule', type: 'address' },
          { internalType: 'bytes', name: 'followModuleInitData', type: 'bytes' }
        ],
        internalType: 'struct CreateProfileParams',
        name: 'createProfileParams',
        type: 'tuple'
      },
      { internalType: 'string', name: 'handle', type: 'string' },
      {
        internalType: 'address[]',
        name: 'delegatedExecutors',
        type: 'address[]'
      }
    ],
    name: 'createProfileWithHandle',
    outputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'handleId', type: 'uint256' }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
