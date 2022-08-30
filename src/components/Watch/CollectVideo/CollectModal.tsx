import { useQuery } from '@apollo/client'
import Alert from '@components/Common/Alert'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import {
  ALLOWANCE_SETTINGS_QUERY,
  PUBLICATION_REVENUE_QUERY,
  VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY
} from '@gql/queries'
import useAppStore from '@lib/store'
import usePersistStore from '@lib/store/persist'
import { shortenAddress } from '@utils/functions/shortenAddress'
import { Mixpanel, TRACK } from '@utils/track'
import dayjs from 'dayjs'
import React, { Dispatch, FC, useEffect, useState } from 'react'
import { LenstubeCollectModule, LenstubePublication } from 'src/types/local'
import { useBalance } from 'wagmi'

import BalanceAlert from './BalanceAlert'
import PermissionAlert from './PermissionAlert'

type Props = {
  showModal: boolean
  setShowModal: Dispatch<boolean>
  video: LenstubePublication
  // eslint-disable-next-line no-unused-vars
  handleCollect: (validate: boolean) => void
  collecting: boolean
}

const CollectModal: FC<Props> = ({
  showModal,
  setShowModal,
  video,
  handleCollect,
  collecting
}) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const selectedChannelId = usePersistStore((state) => state.selectedChannelId)

  const [isAllowed, setIsAllowed] = useState(true)
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false)
  const isMembershipActive =
    video.profile?.followModule?.__typename === 'FeeFollowModuleSettings'

  const { data, loading } = useQuery(VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY, {
    variables: { request: { publicationId: video?.id } }
  })
  const collectModule: LenstubeCollectModule = data?.publication?.collectModule

  useEffect(() => {
    Mixpanel.track(TRACK.COLLECT.OPEN)
  }, [])

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    addressOrName: selectedChannel?.ownedBy,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: !!collectModule?.amount,
    enabled: !!collectModule?.amount
  })

  const { data: revenueData } = useQuery(PUBLICATION_REVENUE_QUERY, {
    variables: {
      request: {
        publicationId: video?.id
      }
    },
    skip: !video?.id
  })

  const {
    loading: allowanceLoading,
    data: allowanceData,
    refetch: refetchAllowance
  } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: collectModule?.type,
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !selectedChannelId,
    onCompleted(data) {
      setIsAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00')
    }
  })

  useEffect(() => {
    if (
      balanceData &&
      collectModule?.amount &&
      parseFloat(balanceData?.formatted) <
        parseFloat(collectModule?.amount?.value)
    )
      setHaveEnoughBalance(false)
    else setHaveEnoughBalance(true)
    if (collectModule) {
      refetchAllowance()
    }
  }, [
    balanceData,
    collectModule,
    collectModule?.amount?.value,
    collectModule?.amount,
    refetchAllowance
  ])

  return (
    <Modal
      title="Collect Video"
      panelClassName="max-w-md"
      onClose={() => setShowModal(false)}
      show={showModal}
    >
      <div className="mt-4">
        {!loading && !allowanceLoading ? (
          <>
            {collectModule?.amount ? (
              <div className="flex flex-col mb-3">
                <span className="text-sm">Price</span>
                <span className="space-x-1">
                  <span className="text-2xl font-semibold">
                    {collectModule?.amount?.value}
                  </span>
                  <span>{collectModule?.amount?.asset.symbol}</span>
                </span>
              </div>
            ) : null}
            <div className="flex flex-col mb-3">
              <span className="text-sm">Total Collects</span>
              <span className="space-x-1">
                <span>{video?.stats.totalAmountOfCollects}</span>
              </span>
            </div>
            {collectModule?.recipient ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-sm">Recipient</span>
                <AddressExplorerLink address={collectModule?.recipient}>
                  <span className="text-lg">
                    {shortenAddress(collectModule?.recipient)}
                  </span>
                </AddressExplorerLink>
              </div>
            ) : null}
            {revenueData?.publicationRevenue ? (
              <div className="flex flex-col mb-3">
                <span className="text-xs">Revenue</span>
                <span className="space-x-1">
                  <span className="text-2xl font-semibold">
                    {revenueData?.publicationRevenue?.revenue?.total?.value ??
                      0}
                  </span>
                  <span>{collectModule?.amount?.asset.symbol}</span>
                </span>
              </div>
            ) : null}
            {collectModule?.endTimestamp ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-sm">Ends At</span>
                <span className="text-lg">
                  {dayjs(collectModule.endTimestamp).format('MMMM DD, YYYY')} at{' '}
                  {dayjs(collectModule.endTimestamp).format('hh:mm a')}
                </span>
              </div>
            ) : null}
            {collectModule?.referralFee ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-sm">Referral Fee</span>
                <span className="text-lg">{collectModule.referralFee} %</span>
              </div>
            ) : null}
            <div className="flex justify-end">
              {isAllowed ? (
                collectModule?.followerOnly && !video.profile.isFollowedByMe ? (
                  <div className="flex-1">
                    <Alert variant="warning">
                      <div className="flex px-2">
                        Only {isMembershipActive ? 'Members' : 'Subscribers'}{' '}
                        can collect this publication
                      </div>
                    </Alert>
                  </div>
                ) : balanceLoading ? (
                  <div className="flex justify-center w-full py-2">
                    <Loader />
                  </div>
                ) : haveEnoughBalance ? (
                  <Button
                    disabled={collecting}
                    onClick={() => handleCollect(false)}
                  >
                    Collect Now
                  </Button>
                ) : (
                  <BalanceAlert collectModule={collectModule} />
                )
              ) : (
                <PermissionAlert
                  collectModule={collectModule}
                  isAllowed={isAllowed}
                  setIsAllowed={setIsAllowed}
                  allowanceModule={
                    allowanceData?.approvedModuleAllowanceAmount[0]
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
    </Modal>
  )
}

export default CollectModal
