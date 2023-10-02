import Modal from '@components/UIElements/Modal'
import {
  IS_MAINNET,
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from '@lenstube/constants'
import { useLatestNotificationIdQuery } from '@lenstube/lens'
import useAuthPersistStore from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t, Trans } from '@lingui/macro'
import { Button, DropdownMenu, Flex, IconButton } from '@radix-ui/themes'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useState } from 'react'

import ConnectWalletButton from './Auth/ConnectWalletButton'
import BellOutline from './Icons/BellOutline'
import LinkOutline from './Icons/LinkOutline'
import SearchOutline from './Icons/SearchOutline'
import UploadOutline from './Icons/UploadOutline'
import PostLinkModal from './PostLinkModal'
import GlobalSearchBar from './Search/GlobalSearchBar'

type Props = {
  className?: string
}

const Header: FC<Props> = ({ className }) => {
  const [showShowModal, setSearchModal] = useState(false)
  const [showPostLinkModal, setShowPostLinkModal] = useState(false)

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
        'ultrawide:max-w-[90rem] ultrawide:px-0 container sticky left-0 right-0 top-0 z-10 mx-auto flex items-center bg-white/70 p-2 backdrop-blur-xl dark:bg-black/70 md:p-4',
        className
      )}
    >
      <div className="flex w-full">
        <div className="flex w-full items-center justify-between px-2 md:px-0">
          <GlobalSearchBar />
          <div className="flex flex-row items-center justify-end space-x-2 md:w-96 md:space-x-3">
            <button
              onClick={() => setSearchModal(true)}
              className="btn-hover p-2.5 md:hidden"
            >
              <SearchOutline className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
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
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="classic" highContrast>
                    <Flex align="center" gap="2">
                      <Trans>Create</Trans>
                    </Flex>
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content
                  sideOffset={10}
                  variant="soft"
                  align="end"
                >
                  <Link href="/upload" className="hidden md:block">
                    <DropdownMenu.Item>
                      <Flex align="center" gap="2">
                        <UploadOutline className="h-3 w-3" />
                        <Trans>New Upload</Trans>
                      </Flex>
                    </DropdownMenu.Item>
                  </Link>
                  <DropdownMenu.Item onClick={() => setShowPostLinkModal(true)}>
                    <Flex align="center" gap="2">
                      <LinkOutline className="h-3 w-3" />
                      <Trans>Share Drop</Trans>
                    </Flex>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
          ) : null}
          <ConnectWalletButton />
        </Flex>
      </div>
      <PostLinkModal show={showPostLinkModal} setShow={setShowPostLinkModal} />
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
