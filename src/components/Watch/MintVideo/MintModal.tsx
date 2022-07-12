import { useQuery } from '@apollo/client'
import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import Modal from '@components/UIElements/Modal'
import usePersistStore from '@lib/store/persist'
import { shortenAddress } from '@utils/functions/shortenAddress'
import {
  ALLOWANCE_SETTINGS_QUERY,
  VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY
} from '@utils/gql/queries'
import { SETTINGS_PERMISSIONS } from '@utils/url-path'
import dayjs from 'dayjs'
import Link from 'next/link'
import React, { Dispatch, FC, useState } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { LenstubePublication } from 'src/types/local'

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
  const { data, loading } = useQuery(VIDEO_DETAIL_WITH_COLLECT_DETAIL_QUERY, {
    variables: { request: { publicationId: video?.id } }
  })
  const collectModule: any = data?.publication?.collectModule

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
              <span className="text-xs">Total Collects</span>
              <span className="space-x-1">
                <span>{video?.stats.totalAmountOfCollects}</span>
              </span>
            </div>
            {collectModule?.recipient ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-xs">Recipient</span>
                <span className="text-lg">
                  {shortenAddress(collectModule?.recipient)}
                </span>
              </div>
            ) : null}
            {collectModule?.endTimestamp ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-xs">Mint ends</span>
                <span className="text-lg">
                  {dayjs(collectModule.endTimestamp).format('MMMM DD, YYYY')} at{' '}
                  {dayjs(collectModule.endTimestamp).format('hh:mm a')}
                </span>
              </div>
            ) : null}
            {collectModule?.referralFee ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-xs">Referral Fee</span>
                <span className="text-lg">
                  <b>{collectModule.referralFee} %</b> referral fee
                </span>
              </div>
            ) : null}
            <div className="flex justify-end">
              {isAllowed ? (
                collectModule?.followerOnly && !video.profile.isFollowedByMe ? (
                  <div className="flex text-xs">
                    Only Members / Subscribers can mint this publication
                  </div>
                ) : (
                  <Button disabled={minting} onClick={() => handleMint(false)}>
                    Mint
                  </Button>
                )
              ) : (
                <Link href={SETTINGS_PERMISSIONS}>
                  <a>
                    <Button variant="secondary">
                      <span className="flex items-center">
                        Allow {collectModule.type} <BiChevronRight />
                      </span>
                    </Button>
                  </a>
                </Link>
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
