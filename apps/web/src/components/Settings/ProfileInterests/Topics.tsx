import useProfileStore from '@lib/store/idb/profile'
import { tw } from '@tape.xyz/browser'
import { EVENTS, sanitizeProfileInterests, Tower } from '@tape.xyz/generic'
import type {
  ProfileInterestsRequest,
  ProfileInterestTypes
} from '@tape.xyz/lens'
import {
  useAddProfileInterestsMutation,
  useProfileInterestsOptionsQuery,
  useRemoveProfileInterestsMutation
} from '@tape.xyz/lens'
import { useApolloClient } from '@tape.xyz/lens/apollo'
import { Spinner } from '@tape.xyz/ui'
import React, { useEffect } from 'react'

const MAX_TOPICS_ALLOWED = 12

const Topics = () => {
  const activeProfile = useProfileStore((state) => state.activeProfile)

  useEffect(() => {
    Tower.track(EVENTS.PROFILE_INTERESTS.VIEW)
  }, [])

  const { cache } = useApolloClient()
  const { data, loading } = useProfileInterestsOptionsQuery({
    variables: { request: { forProfileId: activeProfile?.id } },
    skip: !activeProfile?.id
  })
  const [addProfileInterests] = useAddProfileInterestsMutation()
  const [removeProfileInterests] = useRemoveProfileInterestsMutation()

  const updateCache = (interests: string[]) => {
    cache.modify({
      id: `Profile:${activeProfile?.id}`,
      fields: { interests: () => interests }
    })
  }

  const interestsData = data?.profileInterestsOptions as ProfileInterestTypes[]
  const selectedTopics = data?.profile?.interests ?? []

  const onSelectTopic = (topic: ProfileInterestTypes) => {
    try {
      const request: ProfileInterestsRequest = {
        interests: [topic]
      }
      if (!selectedTopics?.includes(topic)) {
        const interests = [...selectedTopics, topic]
        updateCache(interests)
        Tower.track(EVENTS.PROFILE_INTERESTS.ADD)
        return addProfileInterests({ variables: { request } })
      }
      const topics = [...selectedTopics]
      topics.splice(topics.indexOf(topic), 1)
      updateCache(topics)
      Tower.track(EVENTS.PROFILE_INTERESTS.REMOVE)
      removeProfileInterests({ variables: { request } })
    } catch {}
  }

  return (
    <div className="flex flex-col space-y-3">
      {loading && <Spinner className="my-10" />}
      {sanitizeProfileInterests(interestsData)?.map(
        ({ category, subCategories }) => (
          <div className="w-full space-y-2" key={category.id}>
            <h2 className="text-sm font-bold capitalize">{category.label}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={tw(
                  'tape-border flex items-center justify-between rounded-md px-3 py-0.5 text-sm capitalize focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                  {
                    '!border-brand-500 text-brand-500': selectedTopics.includes(
                      category.id
                    )
                  }
                )}
                disabled={
                  !selectedTopics.includes(category.id) &&
                  selectedTopics.length === MAX_TOPICS_ALLOWED
                }
                onClick={() => onSelectTopic(category.id)}
              >
                {category.label}
              </button>
              {subCategories?.map(
                (subCategory: { id: ProfileInterestTypes; label: string }) => (
                  <button
                    type="button"
                    disabled={
                      !selectedTopics.includes(subCategory.id) &&
                      selectedTopics.length === MAX_TOPICS_ALLOWED
                    }
                    className={tw(
                      'tape-border flex items-center justify-between rounded-md px-3 py-0.5 text-sm capitalize focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                      {
                        '!border-brand-500 text-brand-500':
                          selectedTopics.includes(subCategory.id)
                      }
                    )}
                    key={subCategory.id}
                    onClick={() => onSelectTopic(subCategory.id)}
                  >
                    {subCategory.label}
                  </button>
                )
              )}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Topics
