import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { Countdown } from '@components/UIElements/CountDown'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { getRelativeTime } from '@lib/formatTime'
import { getCollectModuleOutput } from '@lib/getCollectModuleOutput'
import useProfileStore from '@lib/store/idb/profile'
import useNonceStore from '@lib/store/nonce'
import { LENSHUB_PROXY_ABI } from '@tape.xyz/abis'
import {
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  SIGN_IN_REQUIRED
} from '@tape.xyz/constants'
import {
  checkLensManagerPermissions,
  formatNumber,
  getProfile,
  getProfilePicture,
  getRandomProfilePicture,
  getSignature,
  imageCdn,
  shortenAddress
} from '@tape.xyz/generic'
import type {
  ActOnOpenActionLensManagerRequest,
  HandleInfo,
  LegacyCollectRequest,
  PrimaryPublication,
  Profile,
  RecipientDataOutput
} from '@tape.xyz/lens'
import {
  OpenActionModuleType,
  useActOnOpenActionMutation,
  useApprovedModuleAllowanceAmountQuery,
  useBroadcastOnchainMutation,
  useCreateActOnOpenActionTypedDataMutation,
  useCreateLegacyCollectTypedDataMutation,
  useLegacyCollectMutation,
  useProfilesQuery,
  usePublicationQuery,
  useRevenueFromPublicationQuery
} from '@tape.xyz/lens'
import type {
  CustomErrorWithData,
  SupportedOpenActionModuleType
} from '@tape.xyz/lens/custom-types'
import { Button, Callout, Spinner, Tooltip, UserOutline } from '@tape.xyz/ui'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { formatUnits } from 'viem'
import {
  useAccount,
  useBalance,
  useSignTypedData,
  useWriteContract
} from 'wagmi'

import BalanceAlert from '../BalanceAlert'
import PermissionAlert from '../PermissionAlert'

type Props = {
  action: SupportedOpenActionModuleType
  publication: PrimaryPublication
}

const CollectPublication: FC<Props> = ({ publication, action }) => {
  const activeProfile = useProfileStore((state) => state.activeProfile)
  const { lensHubOnchainSigNonce, setLensHubOnchainSigNonce } = useNonceStore()
  const [alreadyCollected, setAlreadyCollected] = useState(
    publication.operations.hasActed.value
  )

  const handleWrongNetwork = useHandleWrongNetwork()
  const { address } = useAccount()

  const [collecting, setCollecting] = useState(false)
  const [isAllowed, setIsAllowed] = useState(true)
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false)
  const details = getCollectModuleOutput(action)

  const assetAddress = details?.amount?.assetAddress
  const assetDecimals = details?.amount?.assetDecimals || 18
  const amount = parseFloat(details?.amount?.value || '0')
  const isLegacyCollectModule =
    action.__typename === 'LegacySimpleCollectModuleSettings' ||
    action.__typename === 'LegacyMultirecipientFeeCollectModuleSettings'

  const { canUseLensManager, canBroadcast } =
    checkLensManagerPermissions(activeProfile)
  const isFreeCollect = !amount
  const isFreeForAnyone = !action?.followerOnly && isFreeCollect

  usePublicationQuery({
    variables: { request: { forId: publication.id } },
    onCompleted: ({ publication }) => {
      const { operations } = publication as PrimaryPublication
      setAlreadyCollected(operations.hasActed.value)
    },
    fetchPolicy: 'cache-and-network'
  })

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
    skip: !Boolean(details?.recipients?.length) || isFreeCollect
  })

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address,
    token: assetAddress,
    query: {
      enabled: Boolean(details?.amount.value) && !isFreeCollect,
      refetchInterval: 2000
    }
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
    skip: !assetAddress || isFreeCollect || !activeProfile?.id,
    onCompleted: (data) => {
      setIsAllowed(
        parseFloat(data.approvedModuleAllowanceAmount[0].allowance.value) >
          amount
      )
    }
  })

  useEffect(() => {
    if (
      balanceData &&
      details?.amount.value &&
      parseFloat(formatUnits(balanceData.value, assetDecimals)) <
        parseFloat(details?.amount.value)
    ) {
      setHaveEnoughBalance(false)
    } else {
      setHaveEnoughBalance(true)
    }
    if (assetAddress && !isFreeCollect && activeProfile?.id) {
      refetchAllowance()
    }
  }, [
    balanceData,
    assetAddress,
    details?.amount.value,
    refetchAllowance,
    activeProfile,
    isFreeCollect,
    assetDecimals
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
      return handles as HandleInfo[]
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
          className="flex items-center space-x-2 py-1"
        >
          <div className="flex items-center space-x-1">
            <img className="size-4 rounded-full" src={pfp} alt="pfp" />
            <Tooltip
              placement="bottom-start"
              visible={hasManyProfiles}
              content={handles?.map((handle) => (
                <p key={handle?.id}>{handle?.fullHandle}</p>
              ))}
            >
              {defaultProfile?.handle ? (
                <Link href={getProfile(defaultProfile).link} target="_blank">
                  {label}
                </Link>
              ) : (
                <AddressExplorerLink address={splitRecipient?.recipient}>
                  <span>{label}</span>
                </AddressExplorerLink>
              )}
            </Tooltip>
          </div>
          {splitRecipient?.split ? (
            <span className="text-sm">({splitRecipient?.split}%)</span>
          ) : null}
        </div>
      )
    })
  }

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setCollecting(false)
  }

  const onCompleted = (
    __typename?: 'RelayError' | 'RelaySuccess' | 'LensProfileManagerRelayError'
  ) => {
    if (
      __typename === 'RelayError' ||
      __typename === 'LensProfileManagerRelayError'
    ) {
      return
    }
    setCollecting(false)
    setAlreadyCollected(true)
    toast.success('Collected as NFT')
  }
  const { signTypedDataAsync } = useSignTypedData({ mutation: { onError } })

  const { writeContractAsync } = useWriteContract({
    mutation: {
      onSuccess: () => {
        onCompleted()
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
      },
      onError: (error) => {
        onError(error)
        setLensHubOnchainSigNonce(lensHubOnchainSigNonce - 1)
      }
    }
  })

  const write = async ({ args }: { args: any[] }) => {
    return await writeContractAsync({
      address: LENSHUB_PROXY_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: isLegacyCollectModule ? 'collectLegacy' : 'act',
      args
    })
  }

  const [broadcastOnchain] = useBroadcastOnchainMutation({
    onCompleted: ({ broadcastOnchain }) =>
      onCompleted(broadcastOnchain.__typename)
  })

  const [createActOnOpenActionTypedData] =
    useCreateActOnOpenActionTypedDataMutation({
      onCompleted: async ({ createActOnOpenActionTypedData }) => {
        const { id, typedData } = createActOnOpenActionTypedData
        const args = [typedData.value]
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return await write({ args })
          }
          return
        }
        return await write({ args })
      },
      onError
    })

  // Legacy Collect
  const [createLegacyCollectTypedData] =
    useCreateLegacyCollectTypedDataMutation({
      onCompleted: async ({ createLegacyCollectTypedData }) => {
        const { id, typedData } = createLegacyCollectTypedData
        const args = [typedData.value]
        if (canBroadcast) {
          const signature = await signTypedDataAsync(getSignature(typedData))
          setLensHubOnchainSigNonce(lensHubOnchainSigNonce + 1)
          const { data } = await broadcastOnchain({
            variables: { request: { id, signature } }
          })
          if (data?.broadcastOnchain.__typename === 'RelayError') {
            return await write({ args })
          }
          return
        }
        return await write({ args })
      },
      onError
    })

  // Act
  const [actOnOpenAction] = useActOnOpenActionMutation({
    onCompleted: ({ actOnOpenAction }) =>
      onCompleted(actOnOpenAction.__typename),
    onError
  })

  // Legacy Collect
  const [legacyCollect] = useLegacyCollectMutation({
    onCompleted: ({ legacyCollect }) => onCompleted(legacyCollect.__typename),
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

  // Act via Lens Manager
  const actViaLensManager = async (
    request: ActOnOpenActionLensManagerRequest
  ) => {
    const { data, errors } = await actOnOpenAction({ variables: { request } })

    if (errors?.toString().includes('has already acted on')) {
      return
    }

    if (
      !data?.actOnOpenAction ||
      data?.actOnOpenAction.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createActOnOpenActionTypedData({ variables: { request } })
    }
  }

  // Collect via Lens Manager
  const legacyCollectViaLensManager = async (request: LegacyCollectRequest) => {
    const { data, errors } = await legacyCollect({ variables: { request } })

    if (errors?.toString().includes('has already collected on')) {
      return
    }

    if (
      !data?.legacyCollect ||
      data?.legacyCollect.__typename === 'LensProfileManagerRelayError'
    ) {
      return await createLegacyCollectTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      })
    }
  }

  const collectNow = async () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }

    await handleWrongNetwork()

    setCollecting(true)

    if (isLegacyCollectModule) {
      const legacyCollectRequest: LegacyCollectRequest = {
        on: publication?.id
      }

      if (canUseLensManager && isFreeForAnyone) {
        return await legacyCollectViaLensManager(legacyCollectRequest)
      }

      return await createLegacyCollectTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: legacyCollectRequest
        }
      })
    }

    const actOnRequest: ActOnOpenActionLensManagerRequest = {
      for: publication?.id,
      actOn: { [getOpenActionActOnKey(action?.type)]: true }
    }

    if (canUseLensManager && isFreeForAnyone) {
      return await actViaLensManager(actOnRequest)
    }

    return await createActOnOpenActionTypedData({
      variables: {
        options: { overrideSigNonce: lensHubOnchainSigNonce },
        request: actOnRequest
      }
    })
  }

  return (
    <div className="pt-2">
      {!allowanceLoading ? (
        <>
          <div className="mb-3 flex flex-col">
            <span className="font-bold">Total Collects</span>
            <span className="space-x-1">
              <span className="text-2xl">
                {formatNumber(publication?.stats.countOpenActions)}
                {details?.collectLimit && (
                  <span> / {details?.collectLimit}</span>
                )}
              </span>
            </span>
          </div>
          {amount ? (
            <div className="mb-3 flex flex-col">
              <span className="font-bold">Price</span>
              <span className="space-x-1">
                <span className="text-2xl">{details?.amount.value}</span>
                <span>{details?.amount.assetSymbol}</span>
                <span>( ${details?.amount.rate} )</span>
              </span>
            </div>
          ) : null}
          {details?.endsAt ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 font-bold">Collect Ends in</span>
              <span className="text-lg">
                <Countdown
                  timestamp={details.endsAt}
                  endText={`Ended ${getRelativeTime(details.endsAt)}`}
                />
              </span>
            </div>
          ) : null}
          {revenueData?.revenueFromPublication?.revenue[0] ? (
            <div className="mb-3 flex flex-col">
              <span className="font-bold">Revenue</span>
              <span className="space-x-1">
                <span className="text-2xl font-bold">
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
          {details?.recipients?.length ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 font-bold">Recipients</span>
              {action.type ===
                OpenActionModuleType.MultirecipientFeeCollectOpenActionModule &&
              details?.recipients?.length
                ? renderRecipients(details.recipients)
                : null}
            </div>
          ) : null}
          <div className="flex justify-end space-x-2">
            {isAllowed ? (
              action?.followerOnly &&
              !publication.by.operations.isFollowedByMe.value ? (
                <div className="flex-1">
                  <Callout icon={<UserOutline className="size-3.5" />}>
                    <div className="flex items-center gap-2">
                      This publication can only be collected by the creator's
                      followers.
                    </div>
                  </Callout>
                </div>
              ) : balanceLoading && !haveEnoughBalance ? (
                <div className="flex w-full justify-center py-2">
                  <Spinner />
                </div>
              ) : haveEnoughBalance ? (
                <Button
                  loading={collecting}
                  disabled={collecting || alreadyCollected}
                  onClick={() => (!alreadyCollected ? collectNow() : null)}
                >
                  {alreadyCollected ? 'Collected' : 'Collect'}
                </Button>
              ) : (
                <BalanceAlert
                  currencyName={action.amount.asset.symbol}
                  address={action.amount.asset.contract.address}
                  value={action.amount.value}
                />
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
        <div className="my-20">
          <Spinner />
        </div>
      )}
    </div>
  )
}

export default CollectPublication
