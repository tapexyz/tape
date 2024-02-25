export const LENS_API_URL = 'https://api-v2.lens.dev/'
export const PUBLIC_ETHEREUM_NODE = 'https://ethereum.publicnode.com'
export const IRYS_NODE_URL = 'http://node2.irys.xyz/tx/matic'

export const ERROR_MESSAGE = 'Something went wrong'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const TAPE_SIGNUP_PROXY_ADDRESS =
  '0xFa920e03C4096C09ae20716c249f6d3A27114984'
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
