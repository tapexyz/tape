import useAppStore from '@lib/store'
import type { ReferenceModuleType } from '@tape.xyz/lens/custom-types'
import { Select, SelectItem } from '@tape.xyz/ui'
import React from 'react'

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
      <span className="text-sm font-medium">
        Who can comment, quote and mirror?
      </span>

      <Select
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
        <SelectItem value="ANYONE">Anyone</SelectItem>
        <SelectItem value="FOLLOWERS">Followers</SelectItem>
        <SelectItem value="FRIENDS_OF_FRIENDS">Friends of Friends</SelectItem>
      </Select>
    </div>
  )
}

export default ReferenceModule
