import { getCollectModuleOutput } from '@lib/getCollectModuleOutput'
import useAuthPersistStore from '@lib/store/auth'
import { Analytics, TRACK } from '@tape.xyz/browser'
import { getPublication } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import { useRevenueFromPublicationQuery } from '@tape.xyz/lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

type Props = {
  publication: AnyPublication
  onCollect: () => void
}

const CollectInfo: FC<Props> = ({ publication, onCollect }) => {
  const targetPublication = getPublication(publication)
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )

  const [isAllowed, setIsAllowed] = useState(true)
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false)
  const isMembershipActive =
    targetPublication.by?.followModule?.__typename === 'FeeFollowModuleSettings'
  // const isFreeCollect = targetPublication.openActionModules[0].__typename

  // const amount =
  //   collectModule?.amount?.value ?? collectModule?.fee?.amount?.value
  // const currency =
  //   collectModule?.amount?.asset?.symbol ??
  //   collectModule?.fee?.amount?.asset?.symbol
  // const assetAddress =
  //   collectModule?.amount?.asset?.address ??
  //   collectModule?.fee?.amount?.asset?.address
  // const assetDecimals =
  //   collectModule?.amount?.asset?.decimals ??
  //   collectModule?.fee?.amount?.asset?.decimals
  // const referralFee =
  //   collectModule?.referralFee ?? collectModule?.fee?.referralFee
  // const collectLimit =
  //   collectModule?.collectLimit ?? collectModule?.optionalCollectLimit
  // const endTimestamp =
  //   collectModule?.endTimestamp ?? collectModule?.optionalEndTimestamp

  useEffect(() => {
    Analytics.track(TRACK.OPEN_COLLECT)
  }, [])

  // const isRecipientAvailable =
  //   collectModule?.recipients?.length || collectModule?.recipient

  // const { data: recipientProfilesData } = useProfilesQuery({
  //   variables: {
  //     request: {
  //       where: {
  //         ownedBy: ['']
  //         // ownedBy: collectModule?.recipients?.length
  //         //   ? collectModule?.recipients?.map((r) => r.recipient)
  //         //   : collectModule?.recipient
  //       }
  //     }
  //   },
  //   skip: !isRecipientAvailable
  // })

  // const { data: balanceData, isLoading: balanceLoading } = useBalance({
  //   address: selectedSimpleProfile?.ownedBy.address,
  //   token: assetAddress,
  //   formatUnits: assetDecimals,
  //   watch: Boolean(amount),
  //   enabled: Boolean(amount)
  // })

  const { data: revenueData } = useRevenueFromPublicationQuery({
    variables: {
      request: {
        for: targetPublication?.id
      }
    },
    skip: !targetPublication?.id
  })

  // const {
  //   loading: allowanceLoading,
  //   data: allowanceData,
  //   refetch: refetchAllowance
  // } = useApprovedModuleAllowanceAmountQuery({
  //   variables: {
  //     request: {
  //       currencies: assetAddress,
  //       followModules: [],
  //       // collectModules: [],
  //       referenceModules: []
  //     }
  //   },
  //   skip: !assetAddress || !selectedSimpleProfile?.id,
  //   onCompleted: (data) => {
  //     setIsAllowed(
  //       data.approvedModuleAllowanceAmount[0].allowance.value !== '0x00'
  //     )
  //   }
  // })

  // useEffect(() => {
  //   if (
  //     balanceData &&
  //     amount &&
  //     parseFloat(balanceData?.formatted) < parseFloat(amount)
  //   ) {
  //     setHaveEnoughBalance(false)
  //   } else {
  //     setHaveEnoughBalance(true)
  //   }
  //   if (assetAddress && selectedSimpleProfile?.id) {
  //     refetchAllowance()
  //   }
  // }, [
  //   balanceData,
  //   assetAddress,
  //   amount,
  //   refetchAllowance,
  //   selectedSimpleProfile
  // ])

  // const getDefaultProfileByAddress = (address: string) => {
  //   const profiles = recipientProfilesData?.profiles?.items
  //   if (profiles) {
  //     // profile.isDefault check not required
  //     return profiles.filter((p) => p.ownedBy.address === address)[0]
  //   }
  // }

  // const getProfilesByAddress = (address: string) => {
  //   const profiles = recipientProfilesData?.profiles?.items
  //   if (profiles) {
  //     const handles = profiles
  //       .filter((p) => p.ownedBy.address === address)
  //       .map((p) => p.handle)
  //     return handles as string[]
  //   }
  //   return []
  // }

  // const renderRecipients = (recipients: RecipientDataOutput[]) => {
  //   return recipients.map((splitRecipient) => {
  //     const defaultProfile = getDefaultProfileByAddress(
  //       splitRecipient.recipient
  //     ) as Profile
  //     const pfp = imageCdn(
  //       defaultProfile
  //         ? getProfilePicture(defaultProfile)
  //         : getRandomProfilePicture(splitRecipient.recipient),
  //       'AVATAR'
  //     )
  //     const label =
  //       defaultProfile?.handle ?? shortenAddress(splitRecipient?.recipient)
  //     const hasManyProfiles =
  //       getProfilesByAddress(splitRecipient.recipient)?.length > 1
  //     const handles = getProfilesByAddress(splitRecipient.recipient)

  //     return (
  //       <div
  //         key={splitRecipient.recipient}
  //         className="flex items-center justify-between py-1 text-sm"
  //       >
  //         <div className="flex items-center space-x-2">
  //           <img className="h-4 w-4 rounded-full" src={pfp} alt="pfp" />
  //           <Tooltip
  //             placement="bottom-start"
  //             visible={hasManyProfiles}
  //             content={handles?.map((handle) => <p key={handle}>{handle}</p>)}
  //           >
  //             {defaultProfile?.handle ? (
  //               <Link
  //                 href={`/channel/${trimLensHandle(defaultProfile.handle)}`}
  //               >
  //                 {label}
  //               </Link>
  //             ) : (
  //               <AddressExplorerLink address={splitRecipient?.recipient}>
  //                 <span>{label}</span>
  //               </AddressExplorerLink>
  //             )}
  //           </Tooltip>
  //         </div>
  //         <span>{splitRecipient?.split}%</span>
  //       </div>
  //     )
  //   })
  // }

  const openActions = targetPublication.openActionModules

  return (
    <div>
      {openActions?.map((action, i) => {
        return (
          <div key={i}>{JSON.stringify(getCollectModuleOutput(action))}</div>
        )
      })}
      {/* {!fetchingCollectModule && !allowanceLoading ? (
        <>
          <div className="mb-3 flex flex-col">
            <span className="text-sm font-semibold">
              <Trans>Total Collects</Trans>
            </span>
            <span className="space-x-1">
              <span className="text-lg">
                {formatNumber(targetPublication?.stats.countOpenActions)}
                {collectLimit && <span> / {collectLimit}</span>}
              </span>
            </span>
          </div>
          {amount ? (
            <div className="mb-3 flex flex-col">
              <span className="text-sm font-semibold">
                <Trans>Price</Trans>
              </span>
              <span className="space-x-1">
                <span className="text-2xl font-semibold">{amount}</span>
                <span>{currency}</span>
              </span>
            </div>
          ) : null}
          {endTimestamp ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 text-sm font-semibold">
                <Trans>Ends At</Trans>
              </span>
              <span className="text-lg">
                {dayjs(endTimestamp).format('MMMM DD, YYYY')} at{' '}
                {dayjs(endTimestamp).format('hh:mm a')}
              </span>
            </div>
          ) : null}
          {revenueData?.revenueFromPublication ? (
            <div className="mb-3 flex flex-col">
              <span className="text-sm font-semibold">
                <Trans>Revenue</Trans>
              </span>
              <span className="space-x-1">
                <span className="text-2xl font-semibold">
                  {revenueData?.revenueFromPublication?.revenue[0].total
                    .value ?? 0}
                </span>
                <span>{collectModule?.amount?.asset.symbol}</span>
              </span>
            </div>
          ) : null}
          {referralFee ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 text-sm font-semibold">
                <Trans>Referral Fee</Trans>
              </span>
              <span className="text-lg">{referralFee} %</span>
            </div>
          ) : null}
          {isRecipientAvailable ? (
            <div className="mb-3 flex flex-col">
              <span className="mb-0.5 text-sm font-semibold">
                <Trans>Revenue</Trans>{' '}
                {collectModule.recipients?.length
                  ? t`Recipients`
                  : t`Recipient`}
              </span>
              {collectModule.recipient &&
                renderRecipients([
                  { recipient: collectModule.recipient, split: 100 }
                ])}
              {collectModule.type ===
                  CollectModules.MultirecipientFeeCollectModule &&
                collectModule.recipients?.length
                  ? renderRecipients(collectModule.recipients)
                  : null}
            </div>
          ) : null}
          <div className="flex justify-end space-x-2">
            {isAllowed ? (
              collectModule?.followerOnly &&
              !targetPublication.by.operations.isFollowedByMe.value ? (
                <div className="flex-1">
                  <Alert variant="warning">
                    <div className="flex px-2">
                      <Trans>Only</Trans>{' '}
                      {isMembershipActive ? t`Members` : t`Subscribers`}{' '}
                      <Trans>can collect this publication</Trans>
                    </div>
                  </Alert>
                </div>
              ) : balanceLoading && !haveEnoughBalance ? (
                <div className="flex w-full justify-center py-2">
                  <Loader />
                </div>
              ) : haveEnoughBalance ? (
                <Button disabled={collecting} onClick={() => onCollect()}>
                  {true ? t`Collect for free` : t`Collect Now`}
                </Button>
              ) : (
                <BalanceAlert collectModule={collectModule} />
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
      )} */}
    </div>
  )
}

export default CollectInfo
