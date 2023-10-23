import useAppStore from '@lib/store'
import { Trans } from '@lingui/macro'
import { Select, Text } from '@radix-ui/themes'
import type { ReferenceModuleType } from '@tape.xyz/lens/custom-types'
import React from 'react'

const ReferenceModule = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)

  const setReferenceType = (data: ReferenceModuleType) => {
    setUploadedVideo({
      referenceModule: { ...uploadedVideo.collectModule, ...data }
    })
  }

  const getSelectedReferenceTypeValue = () => {
    const followerOnlyReferenceModule =
      uploadedVideo?.referenceModule?.followerOnlyReferenceModule
    const degreesOfSeparationReferenceModule =
      uploadedVideo?.referenceModule?.degreesOfSeparationReferenceModule
    if (!followerOnlyReferenceModule && !degreesOfSeparationReferenceModule) {
      return 'ANYONE'
    } else if (followerOnlyReferenceModule) {
      return 'FOLLOWERS'
    } else if (
      degreesOfSeparationReferenceModule &&
      degreesOfSeparationReferenceModule.degreesOfSeparation < 5
    ) {
      return 'FRIENDS_OF_FRIENDS'
    }
  }

  return (
    <div className="flex-1 space-y-1">
      <Text size="2" weight="medium">
        <Trans>Who can comment, quote and mirror?</Trans>
      </Text>

      <Select.Root
        size="3"
        value={getSelectedReferenceTypeValue()}
        onValueChange={(value) => {
          setReferenceType({
            followerOnlyReferenceModule: value === 'FOLLOWERS',
            degreesOfSeparationReferenceModule:
              value === 'FRIENDS_OF_FRIENDS'
                ? {
                    commentsRestricted: true,
                    mirrorsRestricted: true,
                    quotesRestricted: true,
                    degreesOfSeparation: 4
                  }
                : null
          })
        }}
      >
        <Select.Trigger className="w-full" />
        <Select.Content highContrast>
          <Select.Item value="ANYONE">Anyone</Select.Item>
          <Select.Item value="FOLLOWERS">Followers</Select.Item>
          <Select.Item value="FRIENDS_OF_FRIENDS">
            Friends of Friends
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  )
}

export default ReferenceModule
