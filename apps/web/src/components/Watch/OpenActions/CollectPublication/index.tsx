import InfoOutline from '@components/Common/Icons/InfoOutline'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import Tooltip from '@components/UIElements/Tooltip'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { getCollectModuleOutput } from '@lib/getCollectModuleOutput'
import useProfileStore from '@lib/store/profile'
import { t, Trans } from '@lingui/macro'
import { Button, Callout } from '@radix-ui/themes'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS } from '@tape.xyz/constants'
import {
  formatNumber,
  getProfile,
  getProfilePicture,
  getRandomProfilePicture,
  getSignature,
  imageCdn,
  shortenAddress,
  trimLensHandle
} from '@tape.xyz/generic'
import type {
  MultirecipientFeeCollectOpenActionSettings,
  PrimaryPublication,
  Profile,
  RecipientDataOutput,
  SimpleCollectOpenActionSettings
} from '@tape.xyz/lens'
import {
  OpenActionModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation,
  useProfilesQuery,
  useRevenueFromPublicationQuery
} from '@tape.xyz/lens'
import type { CustomErrorWithData } from '@tape.xyz/lens/custom-types'
import { Loader } from '@tape.xyz/ui'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { formatEther } from 'viem'
import { useBalance, useContractWrite, useSignTypedData } from 'wagmi'

import BalanceAlert from './BalanceAlert'
import PermissionAlert from './PermissionAlert'

type Props = {
  action:
    | SimpleCollectOpenActionSettings
    | MultirecipientFeeCollectOpenActionSettings
  publication: PrimaryPublication
}

const CollectPublication: FC<Props> = ({ publication, action }) => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const userSigNonce = useProfileStore((state) => state.userSigNonce)
  const setUserSigNonce = useProfileStore((state) => state.setUserSigNonce)

  const handleWrongNetwork = useHandleWrongNetwork()

  const [collecting, setCollecting] = useState(false)
  const [isAllowed, setIsAllowed] = useState(true)
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false)
  const details = getCollectModuleOutput(action)

  const assetAddress = details?.amount?.assetAddress
  const assetDecimals = details?.amount?.assetDecimals

  const isRecipientAvailable = details?.recipients?.length || details?.recipient

  const { data: recipientProfilesData } = useProfilesQuery({
    variables: {
      request: {
        where: {
          ownedBy: details?.recipients?.length
            ? details?.recipients?.map((r) => r.recipient)
            : details?.recipient
        }
      }
    },
    skip: !isRecipientAvailable
  })

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: activeProfile?.ownedBy.address,
    token: assetAddress,
    formatUnits: assetDecimals,
    watch: Boolean(details?.amount.value),
    enabled: Boolean(details?.amount.value)
  })

  const { data: revenueData } = useRevenueFromPublicationQuery({
    variables: {
      request: {
        for: publication?.id
      }
    },
    skip: !publication?.id
  })

  const {
    loading: allowanceLoading,
    data: allowanceData,
    refetch: refetchAllowance
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: assetAddress,
        followModules: [],
        openActionModules: [action?.type],
        referenceModules: []
      }
    },
    skip: !assetAddress || !activeProfile?.id,
    onCompleted: (data) => {
      setIsAllowed(
        data.approvedModuleAllowanceAmount[0].allowance.value !== '0x00'
      )
    }
  })

  useEffect(() => {
    if (
      balanceData &&
      details?.amount.value &&
      parseFloat(balanceData?.formatted) <
        parseFloat(formatEther(BigInt(details?.amount.value)))
    ) {
      setHaveEnoughBalance(false)
    } else {
      setHaveEnoughBalance(true)
    }
    if (assetAddress && activeProfile?.id) {
      refetchAllowance()
    }
  }, [
    balanceData,
    assetAddress,
    details?.amount.value,
    refetchAllowance,
    activeProfile
  ])

  const getDefaultProfileByAddress = (address: string) => {
    const profiles = recipientProfilesData?.profiles?.items
    if (profiles) {
      // profile.isDefault check not required
      return profiles.filter((p) => p.ownedBy.address === address)[0]
    }
  }

  const getProfilesByAddress = (address: string) => {
    const profiles = recipientProfilesData?.profiles?.items
    if (profiles) {
      const handles = profiles
        .filter((p) => p.ownedBy.address === address)
        .map((p) => p.handle)
      return handles as string[]
    }
    return []
  }

  const renderRecipients = (recipients: RecipientDataOutput[]) => {
    return recipients.map((splitRecipient) => {
      const defaultProfile = getDefaultProfileByAddress(
        splitRecipient.recipient
      ) as Profile
      const pfp = imageCdn(
        defaultProfile
          ? getProfilePicture(defaultProfile)
          : getRandomProfilePicture(splitRecipient.recipient),
        'AVATAR'
      )
      const label =
        getProfile(defaultProfile)?.slug ??
        shortenAddress(splitRecipient?.recipient)
      const hasManyProfiles =
        getProfilesByAddress(splitRecipient.recipient)?.length > 1
      const handles = getProfilesByAddress(splitRecipient.recipient)

      return (
        <div
          key={splitRecipient.recipient}
          className="flex items-center justify-between py-1"
        >
          <div className="flex items-center space-x-2">
            <img className="h-4 w-4 rounded-full" src={pfp} alt="pfp" />
            <Tooltip
              placement="bottom-start"
              visible={hasManyProfiles}
              content={handles?.map((handle) => (
                <p key={handle}>{trimLensHandle(handle)}</p>
              ))}
            >
              {defaultProfile?.handle ? (
                <Link href={`/u/${getProfile(defaultProfile)?.slug}`}>
                  {trimLensHandle(label)}
                </Link>
              ) : (
                <AddressExplorerLink address={splitRecipient?.recipient}>
                  <span>{label}</span>
                </AddressExplorerLink>
              )}
            </Tooltip>
          </div>
          <span>{splitRecipient?.split}%</span>
        </div>
      )
    })
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setCollecting(false)
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelaySuccess') => {
    if (__typename === 'RelayError') {
      return
    }
    setCollecting(false)
    // setAlreadyCollected(true)
    toast.success(t`Collected as NFT`)
  }
  const { signTypedDataAsync } = useSignTypedData({ onError })

  const { write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'act',
    onSuccess: () => {
      onCompleted()
      setUserSigNonce(userSigNonce + 1)
    },
    onError: (error) => {
      onError(error)
      setUserSigNonce(userSigNonce - 1)
    }
  })

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })
  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData
        const signature = await signTypedDataAsync(getSignature(typedData))
        const { data } = await broadcastOnchain({
          variables: { request: { id, signature } }
        })
        if (data?.broadcastOnchain.__typename === 'RelayError') {
          return write?.({ args: [typedData.value] })
        }
      },
      onError
    })

  const getOpenActionActOnKey = (name: string): string => {
    switch (name) {
      case OpenActionModuleType.SimpleCollectOpenActionModule:
        return 'simpleCollectOpenAction'
      case OpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
        return 'multirecipientCollectOpenAction'
      default:
        return 'unknownOpenAction'
    }
  }

  const collectNow = async () => {
    if (!activeProfile?.id) {
      return toast.error('Sign in to proceed')
    }

    if (handleWrongNetwork()) {
      return
    }

    setCollecting(true)
    return await createActOnOpenActionTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          for: publication?.id,
          actOn: { [getOpenActionActOnKey(action?.type)]: true }
        }
      }
    })
  }

  return (
    <div className="pt-3">
      {!allowanceLoading ? (
        <>
          <div className="mb-3 flex flex-col">
            <span className="text-sm font-semibold">
              <Trans>Total Collects</Trans>
            </span>
            <span className="space-x-1">
              <span className="text-2xl font-bold">
                {formatNumber(publication?.stats.countOpenActions)}
                {details?.collectLimit && (
                  <span> / {details?.collectLimit}</span>
                )}
              </span>
            </span>
          </div>
          {details?.amount.value ? (
            <div className="mb-3 flex flex-col">
              <span className="text-sm font-semibold">
                <Trans>Price</Trans>
              </span>
              <span className="space-x-1">
                <span className="text-2xl font-semibold">
                  {formatEther(BigInt(details?.amount.value))}
                </span>
                <span>{details?.amount.assetSymbol}</span>
              </span>
            </div>
          ) : null}
          {details?.endsAt ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 text-sm font-semibold">
                <Trans>Ends At</Trans>
              </span>
              <span className="text-lg">
                {dayjs(details?.endsAt).format('MMMM DD, YYYY')} at{' '}
                {dayjs(details?.endsAt).format('hh:mm a')}
              </span>
            </div>
          ) : null}
          {revenueData?.revenueFromPublication?.revenue[0] ? (
            <div className="mb-3 flex flex-col">
              <span className="text-sm font-semibold">
                <Trans>Revenue</Trans>
              </span>
              <span className="space-x-1">
                <span className="text-2xl font-semibold">
                  {revenueData?.revenueFromPublication?.revenue[0].total
                    .value ?? 0}
                </span>
                <span>
                  {
                    revenueData?.revenueFromPublication?.revenue[0].total.asset
                      .symbol
                  }
                </span>
              </span>
            </div>
          ) : null}
          {details?.referralFee ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 text-sm font-semibold">
                <Trans>Referral Fee</Trans>
              </span>
              <span className="text-2xl">{details?.referralFee} %</span>
            </div>
          ) : null}
          {isRecipientAvailable ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 text-sm font-semibold">
                <Trans>Revenue</Trans>{' '}
                {details.recipients?.length ? t`Recipients` : t`Recipient`}
              </span>
              {details.recipient &&
                renderRecipients([
                  { recipient: details.recipient, split: 100 }
                ])}
              {action.type ===
                OpenActionModuleType.MultirecipientFeeCollectOpenActionModule &&
              details.recipients?.length
                ? renderRecipients(details.recipients)
                : null}
            </div>
          ) : null}
          <div className="flex justify-end space-x-2">
            {isAllowed ? (
              action?.followerOnly &&
              !publication.by.operations.isFollowedByMe.value ? (
                <div className="flex-1">
                  <Callout.Root>
                    <Callout.Icon>
                      <InfoOutline />
                    </Callout.Icon>
                    <Callout.Text>
                      <Trans>Only followers can collect this publication</Trans>
                    </Callout.Text>
                  </Callout.Root>
                </div>
              ) : balanceLoading && !haveEnoughBalance ? (
                <div className="flex w-full justify-center py-2">
                  <Loader />
                </div>
              ) : haveEnoughBalance ? (
                <Button
                  highContrast
                  disabled={collecting}
                  onClick={() => collectNow()}
                >
                  <Trans>Collect</Trans>
                </Button>
              ) : (
                <BalanceAlert action={action} />
              )
            ) : (
              <PermissionAlert
                isAllowed={isAllowed}
                setIsAllowed={setIsAllowed}
                allowanceModule={
                  allowanceData?.approvedModuleAllowanceAmount[0] as any
                }
              />
            )}
          </div>
        </>
      ) : (
        <div className="py-6">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default CollectPublication
