import { useApolloClient } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import { Analytics, TRACK } from '@lenstube/constants'
import { sanitizeProfileInterests } from '@lenstube/generic'
import {
  useAddProfileInterestMutation,
  useProfileInterestsQuery,
  useRemoveProfileInterestMutation
} from '@lenstube/lens'
import useChannelStore from '@lib/store/channel'
import clsx from 'clsx'
import React, { useEffect } from 'react'

const MAX_TOPICS_ALLOWED = 12

const Topics = () => {
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  useEffect(() => {
    Analytics.track(TRACK.PROFILE_INTERESTS.VIEW)
  }, [])

  const { cache } = useApolloClient()
  const { data, loading } = useProfileInterestsQuery()
  const [addProfileInterests] = useAddProfileInterestMutation()
  const [removeProfileInterests] = useRemoveProfileInterestMutation()

  const updateCache = (interests: string[]) => {
    cache.modify({
      id: `Profile:${selectedChannel?.id}`,
      fields: { interests: () => interests }
    })
  }

  const interestsData = (data?.profileInterests as string[]) || []
  const selectedTopics = selectedChannel?.interests ?? []

  const onSelectTopic = (topic: string) => {
    try {
      const variables = {
        request: {
          profileId: selectedChannel?.id,
          interests: [topic]
        }
      }
      if (!selectedTopics.includes(topic)) {
        const interests = [...selectedTopics, topic]
        updateCache(interests)
        Analytics.track(TRACK.PROFILE_INTERESTS.ADD)
        return addProfileInterests({ variables })
      }
      const topics = [...selectedTopics]
      topics.splice(topics.indexOf(topic), 1)
      updateCache(topics)
      Analytics.track(TRACK.PROFILE_INTERESTS.REMOVE)
      removeProfileInterests({ variables })
    } catch {}
  }

  return (
    <div className="flex flex-col space-y-3">
      {loading && <Loader className="my-10" />}
      {sanitizeProfileInterests(interestsData)?.map(
        ({ category, subCategories }) => (
          <div className="w-full space-y-2" key={category.id}>
            <h2 className="text-sm font-medium capitalize">{category.label}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={clsx(
                  'flex items-center justify-between rounded-full border border-gray-300 px-3 py-0.5 text-sm capitalize focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700',
                  {
                    '!border-indigo-500 text-indigo-500':
                      selectedTopics.includes(category.id)
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
                (subCategory: { id: string; label: string }) => (
                  <button
                    type="button"
                    disabled={
                      !selectedTopics.includes(subCategory.id) &&
                      selectedTopics.length === MAX_TOPICS_ALLOWED
                    }
                    className={clsx(
                      'flex items-center justify-between rounded-full border border-gray-300 px-3 py-0.5 text-sm capitalize focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700',
                      {
                        '!border-indigo-500 text-indigo-500':
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
