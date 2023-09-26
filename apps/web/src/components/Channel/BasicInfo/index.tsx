import Alert from '@components/Common/Alert'
import Badge from '@components/Common/Badge'
import InfoOutline from '@components/Common/Icons/InfoOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import SubscribeActions from '@components/Common/SubscribeActions'
import SubscribersList from '@components/Common/SubscribersList'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import { MISUSED_CHANNELS, STATIC_ASSETS } from '@lenstube/constants'
import {
  getChannelCoverPicture,
  getProfilePicture,
  imageCdn,
  sanitizeDStorageUrl
} from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import { t, Trans } from '@lingui/macro'
import type { FC } from 'react'
import React, { useState } from 'react'

import MutualSubscribers from '../Mutual/MutualSubscribers'
import CoverLinks from './CoverLinks'

type Props = {
  profile: Profile
}

const BasicInfo: FC<Props> = ({ profile }) => {
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const [showSubscribersModal, setShowSubscribersModal] = useState(false)
  const hasOnChainId =
    profile.onchainIdentity?.ens?.name ||
    profile.onchainIdentity?.proofOfHumanity ||
    profile.onchainIdentity?.worldcoin.isHuman ||
    profile.onchainIdentity?.sybilDotOrg.verified

  const isOwnChannel = profile?.id === selectedSimpleProfile?.id
  const subscribeType = profile?.followModule?.__typename
  const coverImage = imageCdn(
    sanitizeDStorageUrl(getChannelCoverPicture(profile))
  )

  const misused = MISUSED_CHANNELS.find((c) => c.id === profile?.id)

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${coverImage})`
        }}
        className="ultrawide:h-[25vh] relative h-44 w-full bg-white bg-cover bg-center bg-no-repeat dark:bg-gray-900 md:h-[20vw]"
      >
        {profile.metadata && <CoverLinks metadata={profile.metadata} />}
      </div>
      <div className="container mx-auto max-w-[85rem] px-2">
        {misused?.description && (
          <Alert
            variant="danger"
            className="mx-auto mt-4 flex max-w-[85rem] flex-wrap gap-2 bg-white font-medium dark:bg-black"
          >
            <span className="inline-flex items-center space-x-1 rounded-full bg-red-500 px-3 py-1">
              <InfoOutline className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">
                {misused.type}
              </span>
            </span>
            <InterweaveContent content={misused.description} />
          </Alert>
        )}
        <div className="flex space-x-3 py-2 md:items-center md:space-x-5 md:py-5">
          <div className="flex-none">
            <img
              className="ultrawide:h-32 ultrawide:w-32 h-24 w-24 rounded-xl bg-white object-cover dark:bg-gray-900"
              src={getProfilePicture(profile, 'AVATAR_LG')}
              draggable={false}
              alt={profile?.handle}
            />
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-between space-y-3 py-2">
            <div className="mr-3 flex flex-col items-start">
              {profile.metadata?.displayName && (
                <h1 className="flex items-center space-x-1.5 font-medium md:text-2xl">
                  {profile.metadata.displayName}
                </h1>
              )}
              <h2
                className="flex items-center space-x-1.5 md:text-lg"
                data-testid="channel-name"
              >
                <span>{profile?.handle}</span>
                <Badge id={profile?.id} size="md" />
              </h2>
              <Modal
                title={t`Subscribers`}
                onClose={() => setShowSubscribersModal(false)}
                show={showSubscribersModal}
                panelClassName="max-w-md"
              >
                <div className="no-scrollbar max-h-[40vh] overflow-y-auto">
                  <SubscribersList profileId={profile.id} />
                </div>
              </Modal>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSubscribersModal(true)}
                  className="outline-none"
                >
                  <span className="inline-flex items-center space-x-1 whitespace-nowrap">
                    {profile?.stats.followers} <Trans>subscribers</Trans>
                  </span>
                </button>
                {profile.operations.isFollowingMe.value &&
                selectedSimpleProfile?.id !== profile?.id ? (
                  <span className="rounded-full border border-gray-400 px-2 text-xs dark:border-gray-600">
                    <Trans>Subscriber</Trans>
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-3 md:flex-col md:items-end">
              {profile?.id && !isOwnChannel ? (
                <MutualSubscribers viewing={profile.id} />
              ) : null}
              <SubscribeActions
                profile={profile}
                subscribeType={subscribeType}
              />
            </div>
          </div>
        </div>
        {profile.metadata?.bio && (
          <div className="py-2">
            <InterweaveContent content={profile.metadata?.bio} />
          </div>
        )}
        {hasOnChainId && (
          <div className="flex items-center space-x-2 py-2">
            {profile.onchainIdentity?.ens?.name && (
              <Tooltip
                content={profile.onchainIdentity?.ens?.name}
                placement="top"
              >
                <img
                  src={`${STATIC_ASSETS}/images/social/ens.svg`}
                  alt="ens"
                  className="h-6 w-6"
                  draggable={false}
                />
              </Tooltip>
            )}
            {profile?.onchainIdentity?.sybilDotOrg.verified && (
              <Tooltip content={t`Sybil Verified`} placement="top">
                <img
                  src={`${STATIC_ASSETS}/images/social/sybil.png`}
                  alt="sybil"
                  className="h-7 w-7"
                  draggable={false}
                />
              </Tooltip>
            )}
            {profile?.onchainIdentity?.proofOfHumanity && (
              <Tooltip content={t`Proof of Humanity`} placement="top">
                <img
                  src={`${STATIC_ASSETS}/images/social/poh.png`}
                  alt="poh"
                  className="h-7 w-7"
                  draggable={false}
                />
              </Tooltip>
            )}
            {profile?.onchainIdentity?.worldcoin.isHuman && (
              <Tooltip content={t`Proof of Personhood`} placement="top">
                <img
                  src={`${STATIC_ASSETS}/images/social/worldcoin.png`}
                  alt="worldcoin"
                  className="h-7 w-7"
                  draggable={false}
                />
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default BasicInfo
