import Tooltip from '@components/UIElements/Tooltip'
import { Card, Dialog, Flex, IconButton } from '@radix-ui/themes'
import { useCopyToClipboard } from '@tape.xyz/browser'
import { TAPE_APP_NAME, TAPE_EMBED_URL } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'

import CodeOutline from './Icons/CodeOutline'
import CopyOutline from './Icons/CopyOutline'
import TimesOutline from './Icons/TimesOutline'

type Props = {
  publicationId: string
  isAudio: boolean
}

const EmbedMedia: FC<Props> = ({ publicationId, isAudio }) => {
  const [copy] = useCopyToClipboard()

  let iframeCode = `<iframe width="560" height="315" src="${TAPE_EMBED_URL}/${publicationId}?autoplay=1&t=0&loop=0" title="${TAPE_APP_NAME} player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;" allowfullscreen></iframe>`

  if (isAudio) {
    iframeCode = `<iframe width="100%" height="300" src="${TAPE_EMBED_URL}/${publicationId}" title="${TAPE_APP_NAME} player" frameborder="0"></iframe>`
  }

  const onCopyCode = () => {
    copy(iframeCode)
    Tower.track(EVENTS.EMBED_VIDEO.COPY)
  }

  const openModal = () => {
    Tower.track(EVENTS.EMBED_VIDEO.OPEN)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <button
          type="button"
          onClick={() => openModal()}
          className="rounded-full bg-purple-200 p-2.5 dark:bg-purple-800"
        >
          <CodeOutline className="size-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 650 }}>
        <Flex justify="between" pb="5" align="center">
          <Dialog.Title mb="0">Embed Media</Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost" color="gray">
              <TimesOutline outlined={false} className="size-3" />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <div className="flex flex-col space-y-3">
          <div className="w-full">
            <iframe
              sandbox="allow-scripts allow-same-origin"
              className={clsx(
                'w-full',
                isAudio ? 'min-h-[200px]' : 'aspect-[16/9] '
              )}
              src={`${TAPE_EMBED_URL}/${publicationId}`}
              title={`${TAPE_APP_NAME} player`}
              allow="accelerometer; autoplay; clipboard-write; gyroscope;"
              allowFullScreen
            />
          </div>
          <Flex>
            <Card className="relative">
              <code className="select-all text-sm opacity-60">
                {iframeCode}
              </code>
              <Tooltip content="Copy Code" placement="top">
                <IconButton
                  type="button"
                  size="1"
                  variant="soft"
                  onClick={() => onCopyCode()}
                  className="absolute right-2 top-2"
                >
                  <CopyOutline className="size-4" />
                </IconButton>
              </Tooltip>
            </Card>
          </Flex>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default EmbedMedia
