import { useQuery } from '@apollo/client'
import Alert from '@components/Common/Alert'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import usePersistStore from '@lib/store/persist'
import { shortenAddress } from '@utils/functions/shortenAddress'
import {
  ALLOWANCE_SETTINGS_QUERY,
  VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY
} from '@utils/gql/queries'
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
  handleMint: (validate: boolean) => void
  minting: boolean
}

const MintModal: FC<Props> = ({
  showModal,
  setShowModal,
  video,
  handleMint,
  minting
}) => {
  const { selectedChannel } = usePersistStore()
  const [isAllowed, setIsAllowed] = useState(true)
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false)
  const isMembershipActive =
    video.profile?.followModule?.__typename === 'FeeFollowModuleSettings'

  const { data, loading } = useQuery(VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY, {
    variables: { request: { publicationId: video?.id } }
  })
  const collectModule: LenstubeCollectModule = data?.publication?.collectModule

  const { data: balanceData } = useBalance({
    addressOrName: selectedChannel?.ownedBy,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: !!collectModule?.amount,
    enabled: !!collectModule?.amount
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
  }, [balanceData, collectModule?.amount?.value, collectModule?.amount])

  const { loading: allowanceLoading } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: collectModule?.type,
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !selectedChannel,
    onCompleted(data) {
      setIsAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00')
    }
  })

  return (
    <Modal
      title="Mint Video"
      panelClassName="max-w-md"
      onClose={() => setShowModal(false)}
      show={showModal}
    >
      <div className="mt-6">
        {!loading && !allowanceLoading ? (
          <>
            {collectModule?.amount ? (
              <div className="flex flex-col mb-3">
                <span className="text-xs">Amount</span>
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
                <span className="text-lg">
                  {shortenAddress(collectModule?.recipient)}
                </span>
              </div>
            ) : null}
            {collectModule?.endTimestamp ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-sm">Mint ends</span>
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
                      <div className="flex text-sm">
                        Only {isMembershipActive ? 'Members' : 'Subscribers'}{' '}
                        can mint this publication
                      </div>
                    </Alert>
                  </div>
                ) : haveEnoughBalance ? (
                  <Button disabled={minting} onClick={() => handleMint(false)}>
                    Mint
                  </Button>
                ) : (
                  <BalanceAlert collectModule={collectModule} />
                )
              ) : (
                <PermissionAlert collectModule={collectModule} />
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

export default MintModal
