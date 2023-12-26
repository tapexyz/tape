import type { FC } from 'react'

import Tooltip from '@components/UIElements/Tooltip'
import { Card, Dialog, Flex, IconButton } from '@radix-ui/themes'
import { useCopyToClipboard } from '@tape.xyz/browser'
import { TAPE_APP_NAME, TAPE_EMBED_URL } from '@tape.xyz/constants'
import { EVENTS, Tower } from '@tape.xyz/generic'
import clsx from 'clsx'
import React from 'react'

import CodeOutline from './Icons/CodeOutline'
import CopyOutline from './Icons/CopyOutline'
import TimesOutline from './Icons/TimesOutline'

type Props = {
  isAudio: boolean
  publicationId: string
}

const EmbedMedia: FC<Props> = ({ isAudio, publicationId }) => {
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
          className="rounded-full bg-purple-200 p-2.5 dark:bg-purple-800"
          onClick={() => openModal()}
          type="button"
        >
          <CodeOutline className="size-5" />
        </button>
      </Dialog.Trigger>

      <Dialog.Content style={{ maxWidth: 650 }}>
        <Flex align="center" justify="between" pb="5">
          <Dialog.Title mb="0">Embed Media</Dialog.Title>
          <Dialog.Close>
            <IconButton color="gray" variant="ghost">
              <TimesOutline className="size-3" outlined={false} />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <div className="flex flex-col space-y-3">
          <div className="w-full">
            <iframe
              allow="accelerometer; autoplay; clipboard-write; gyroscope;"
              allowFullScreen
              className={clsx(
                'w-full',
                isAudio ? 'min-h-[200px]' : 'aspect-[16/9] '
              )}
              sandbox="allow-scripts allow-same-origin"
              src={`${TAPE_EMBED_URL}/${publicationId}`}
              title={`${TAPE_APP_NAME} player`}
            />
          </div>
          <Flex>
            <Card className="relative">
              <code className="select-all text-sm opacity-60">
                {iframeCode}
              </code>
              <Tooltip content="Copy Code" placement="top">
                <IconButton
                  className="absolute right-2 top-2"
                  onClick={() => onCopyCode()}
                  size="1"
                  type="button"
                  variant="soft"
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
