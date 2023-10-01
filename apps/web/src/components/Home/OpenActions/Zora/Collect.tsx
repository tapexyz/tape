import { ZoraCreator1155Impl } from '@abis/ZoraCreator1155Impl'
import { ZoraERC721Drop } from '@abis/ZoraERC721Drop'
import { Button } from '@components/UIElements/Button'
import { Analytics, TRACK } from '@lenstube/browser'
import { LENSTUBE_ADDRESS, LENSTUBE_APP_NAME } from '@lenstube/constants'
import { getZoraChainInfo } from '@lenstube/generic'
import type { ZoraNft } from '@lenstube/lens/custom-types'
import { Trans } from '@lingui/macro'
import { useConnectModal } from '@rainbow-me/rainbowkit'
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
  const { openConnectModal } = useConnectModal()
  const { switchNetwork } = useSwitchNetwork()

  const [quantity, setQuantity] = useState(1)

  // Write contract
  const nftAddress = nft.address
  const recipient = address as Address
  const comment = `Minted from ${LENSTUBE_APP_NAME}`
  const mintReferral = LENSTUBE_ADDRESS
  const mintFee = parseEther('0.000777')

  const price = quantity * parseInt(nft.price)
  const nftPriceInEth = price / 10 ** 18
  const platformFeesInEth = quantity * 0.000777

  const value =
    (parseEther(nftPriceInEth.toString()) + mintFee) * BigInt(quantity)

  const abi =
    nft.contractStandard === 'ERC721' ? ZoraERC721Drop : ZoraCreator1155Impl
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
    args,
    value
  })
  const {
    write,
    data,
    isLoading: isContractWriteLoading
  } = useContractWrite({
    ...config,
    onSuccess: () => {
      Analytics.track(TRACK.OPEN_ACTIONS.COLLECT_ZORA)
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
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex items-center space-x-4">
          <button
            className="px-1 disabled:opacity-25"
            disabled={quantity === 1}
            onClick={() => setQuantity((q) => q - 1)}
          >
            -
          </button>
          <span className="font-bold">{quantity}</span>
          <button className="px-1" onClick={() => setQuantity((q) => q + 1)}>
            +
          </button>
        </div>
        <span className="text-xs">
          <Trans>
            {nftPriceInEth} ETH + {platformFeesInEth} ETH mint fees
          </Trans>
        </span>
      </div>
      {isDisconnected ? (
        <Button onClick={openConnectModal}>Connect Wallet</Button>
      ) : chain !== nft.chainId ? (
        <Button onClick={() => switchNetwork?.(nft.chainId)} variant="danger">
          Switch to {getZoraChainInfo(nft.chainId).name}
        </Button>
      ) : isPrepareFetching ? (
        <Button disabled>Preparing...</Button>
      ) : isSuccess ? (
        <Button disabled>Collect successful</Button>
      ) : isPrepareError ? (
        noBalanceError ? (
          <Link href="https://buy.moonpay.com" target="_blank">
            <Button variant="danger">Not enough balance</Button>
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
