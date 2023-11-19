import FireOutline from '@components/Common/Icons/FireOutline'
import MirrorPublication from '@components/Common/MirrorPublication'
import { TAPE_WEBSITE_URL } from '@dragverse/constants'
import { getPublicationData } from '@dragverse/generic'
import type { PrimaryPublication } from '@dragverse/lens'
import { getDateString, getRelativeTime } from '@lib/formatTime'
import { Button, Text } from '@radix-ui/themes'

import Mirrors from './Mirrors'
import RenderLink from './RenderLink'

const RenderBanger = ({ post }: { post: PrimaryPublication }) => {
  return (
    <div className="ultrawide:space-y-8 tape-border hover:bg-gallery/50 hover:dark:bg-smoke space-y-6 !border-x-0 !border-t-0 p-5">
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Mirrors post={post} />
          </div>
          <div>
            <RenderLink
              link={
                getPublicationData(post.metadata)?.content ?? TAPE_WEBSITE_URL
              }
            />
          </div>
        </div>
        <div className="mx-2 flex items-center justify-between space-x-2">
          <div className="flex items-center justify-between space-x-4">
            <MirrorPublication video={post} successToast="Shared as Banger">
              <div className="flex">
                <Button size="1" highContrast variant="ghost">
                  <FireOutline className="h-3.5 w-3.5" />
                  Banger
                </Button>
              </div>
            </MirrorPublication>
          </div>
          <Text size="1" title={getDateString(post.createdAt)}>
            {getRelativeTime(post.createdAt)}
          </Text>
        </div>
      </div>
    </div>
  )
}

export default RenderBanger
