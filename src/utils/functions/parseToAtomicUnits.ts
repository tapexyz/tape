import BigNumber from 'bignumber.js'
import toast from 'react-hot-toast'

// parse decimal input into atomic units
export const parseToAtomicUnits = (input: number, base: number) => {
  const conv = new BigNumber(input).multipliedBy(base)
  if (conv.isLessThan(1)) {
    toast.error('Value too small!')
    return
  }
  return conv
}
