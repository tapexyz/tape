import { Button } from '@radix-ui/themes'
import { ZoraCreator1155Impl, ZoraERC721Drop } from '@tape.xyz/abis'
import { TAPE_ADMIN_ADDRESS, TAPE_APP_NAME } from '@tape.xyz/constants'
import { EVENTS, getZoraChainInfo, Tower } from '@tape.xyz/generic'
import type { ZoraNft } from '@tape.xyz/lens/custom-types'
import Link from 'next/link'
import React, { useState } from 'react'
import { encodeAbiParameters, parseAbiParameters, parseEther } from 'viem'
import type { Address } from 'wagmi'
import {
  useAccount,
  useChainId,
  useContractWrite,
  usePrepareContractWrite,
  useSwitchNetwork,
  useWaitForTransaction
} from 'wagmi'

const FIXED_PRICE_SALE_STRATEGY = '0x169d9147dFc9409AfA4E558dF2C9ABeebc020182'
const NO_BALANCE_ERROR = 'exceeds the balance of the account'
const MAX_MINT_EXCEEDED_ERROR = 'Purchase_TooManyForAddress'

const Collect = ({ nft, link }: { nft: ZoraNft; link: string }) => {
  const chain = useChainId()
  const { address, isDisconnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork()

  const [quantity, setQuantity] = useState(1)

  // Write contract
  const nftAddress = nft.address
  const recipient = address as Address
  const comment = `Minted from ${TAPE_APP_NAME}`
  const mintReferral = TAPE_ADMIN_ADDRESS
  const mintFee = parseEther('0.000777')

  const price = quantity * parseInt(nft.price ?? 0)
  const nftPriceInEth = price / 10 ** 18
  const platformFeesInEth = quantity * 0.000777

  const value =
    (parseEther(nftPriceInEth.toString()) + mintFee) * BigInt(quantity)

  const abi =
    nft.contractStandard === 'ERC721' ? ZoraERC721Drop : ZoraCreator1155Impl

  const getArgs = () => {
    if (!recipient) {
      return
    }
    const args =
      nft.contractStandard === 'ERC721'
        ? [recipient, BigInt(quantity), comment, mintReferral]
        : [
            FIXED_PRICE_SALE_STRATEGY,
            parseInt(nft.tokenId),
            BigInt(quantity),
            encodeAbiParameters(parseAbiParameters('address'), [recipient]),
            mintReferral
          ]
    return args
  }

  const {
    config,
    isFetching: isPrepareFetching,
    isError: isPrepareError,
    error: prepareError
  } = usePrepareContractWrite({
    chainId: nft.chainId,
    address: nftAddress,
    functionName: 'mintWithRewards',
    abi,
    args: getArgs(),
    value
  })
  const {
    write,
    data,
    isLoading: isContractWriteLoading
  } = useContractWrite({
    ...config,
    onSuccess: () => {
      Tower.track(EVENTS.OPEN_ACTIONS.COLLECT_ZORA)
    }
  })
  const { isLoading, isSuccess } = useWaitForTransaction({
    chainId: nft.chainId,
    hash: data?.hash
  })

  // Errors
  const noBalanceError = prepareError?.message?.includes(NO_BALANCE_ERROR)
  const maxMintExceededError = prepareError?.message?.includes(
    MAX_MINT_EXCEEDED_ERROR
  )

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 md:mt-8">
      <div>
        <div className="flex items-center space-x-4 text-lg">
          <button
            className="h-8 w-8 border disabled:opacity-25 dark:border-gray-500"
            disabled={quantity === 1}
            onClick={() => setQuantity((q) => q - 1)}
          >
            -
          </button>
          <span className="text-lg font-bold">{quantity}</span>
          <button
            className="h-8 w-8 border dark:border-gray-500"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
          <span className="pl-4 text-sm">
            {nftPriceInEth} ETH + {platformFeesInEth} ETH mint fees
          </span>
        </div>
      </div>
      {isDisconnected ? (
        <Link href="/login">
          <Button>Connect Wallet</Button>
        </Link>
      ) : chain !== nft.chainId ? (
        <Button onClick={() => switchNetwork?.(nft.chainId)} color="red">
          Switch to {getZoraChainInfo(nft.chainId).name}
        </Button>
      ) : isPrepareFetching ? (
        <Button disabled>Preparing...</Button>
      ) : isSuccess ? (
        <Button disabled>Collect successful</Button>
      ) : isPrepareError ? (
        noBalanceError ? (
          <Link href="https://buy.moonpay.com" target="_blank">
            <Button color="red">Not enough balance</Button>
          </Link>
        ) : maxMintExceededError ? (
          <span className="font-bold text-red-500">
            Your mint limit exceeded
          </span>
        ) : (
          <Link href={link} target="_blank">
            <Button>Collect on Zora</Button>
          </Link>
        )
      ) : (
        <Button
          disabled={!write || isContractWriteLoading || isLoading}
          onClick={() => write?.()}
        >
          Collect Now
        </Button>
      )}
    </div>
  )
}

export default Collect
