import Modal from '@components/UIElements/Modal'
import {
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID,
  STATIC_ASSETS
} from '@lenstube/constants'
import { useLatestNotificationIdQuery } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import { Button, Flex, IconButton } from '@radix-ui/themes'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'

import ConnectWalletButton from './Auth/ConnectWalletButton'
import BellOutline from './Icons/BellOutline'
import UploadOutline from './Icons/UploadOutline'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const [showShowModal, setSearchModal] = useState(false)

  const hasNewNotification = useChannelStore(
    (state) => state.hasNewNotification
  )
  const selectedSimpleProfile = useAuthPersistStore(
    (state) => state.selectedSimpleProfile
  )
  const latestNotificationId = usePersistStore(
    (state) => state.latestNotificationId
  )
  const setLatestNotificationId = usePersistStore(
    (state) => state.setLatestNotificationId
  )
  const setHasNewNotification = useChannelStore(
    (state) => state.setHasNewNotification
  )

  useLatestNotificationIdQuery({
    variables: {
      request: {
        where: {
          publishedOn: IS_MAINNET
            ? [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID]
            : undefined,
          customFilters: LENS_CUSTOM_FILTERS
        }
      }
    },
    fetchPolicy: 'no-cache',
    skip: !selectedSimpleProfile?.id,
    onCompleted: (notificationsData) => {
      if (selectedSimpleProfile && notificationsData) {
        const id = notificationsData?.notifications?.items[0].id
        setHasNewNotification(latestNotificationId !== id)
        setLatestNotificationId(id)
      }
    }
  })

  return (
    <div
      className={clsx(
        'dark:bg-theme/70 sticky left-0 right-0 top-0 z-10 flex w-full items-center bg-white/70 p-2 backdrop-blur-xl md:p-4',
        className
      )}
    >
      <div className="ultrawide:px-0 ultrawide:max-w-[90rem] mx-auto flex w-full items-center justify-between">
        <Link href="/" className="block md:hidden">
          <img
            src={`${STATIC_ASSETS}/images/brand/lenstube.svg`}
            draggable={false}
            className="h-5 w-5"
            alt="lenstube"
          />
        </Link>
        <div className="hidden w-full md:block">
          <GlobalSearchBar />
        </div>
        <Flex gap="3" align="center">
          {selectedSimpleProfile?.id ? (
            <Flex gap="4" align="center">
              <Link
                href="/notifications"
                className="relative flex items-center"
              >
                <IconButton variant="ghost">
                  <BellOutline className="h-5 w-5" />
                  {hasNewNotification && (
                    <span className="absolute -right-1 -top-1 flex h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </IconButton>
              </Link>
              <Link href="/upload" className="hidden md:block">
                <Button highContrast>
                  <Flex align="center" gap="2">
                    <UploadOutline className="h-3 w-3" />
                    <Trans>Upload</Trans>
                  </Flex>
                </Button>
              </Link>
            </Flex>
          ) : null}
          <ConnectWalletButton />
        </Flex>
      </div>
      <Modal
        title={t`Search`}
        onClose={() => setSearchModal(false)}
        show={showShowModal}
        panelClassName="max-w-md h-full"
      >
        <div className="no-scrollbar max-h-[80vh] overflow-y-auto">
          <GlobalSearchBar onSearchResults={() => setSearchModal(false)} />
        </div>
      </Modal>
    </div>
  )
}

export default Header
