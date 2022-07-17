export const ENS_NAME_ABI = [
  {
    inputs: [
      { internalType: 'address[]', name: 'addresses', type: 'address[]' }
    ],
    name: 'getNames',
    outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
    stateMutability: 'view',
    type: 'function'
  }
]
