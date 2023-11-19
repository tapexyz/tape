import type { ReferenceModuleType } from '@dragverse/lens/custom-types'
import useAppStore from '@lib/store'
import { Select, Text } from '@radix-ui/themes'

const ReferenceModule = () => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)

  const setReferenceType = (data: ReferenceModuleType) => {
    setUploadedMedia({
      referenceModule: { ...uploadedMedia.collectModule, ...data }
    })
  }

  const getSelectedReferenceTypeValue = () => {
    const followerOnlyReferenceModule =
      uploadedMedia?.referenceModule?.followerOnlyReferenceModule
    const degreesOfSeparationReferenceModule =
      uploadedMedia?.referenceModule?.degreesOfSeparationReferenceModule
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
        Who can comment, quote and mirror?
      </Text>

      <Select.Root
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
