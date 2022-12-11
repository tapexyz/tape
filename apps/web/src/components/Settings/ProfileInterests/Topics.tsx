import { useApolloClient } from '@apollo/client'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import {
  useAddProfileInterestMutation,
  useProfileInterestsQuery,
  useRemoveProfileInterestMutation
} from 'lens'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'
import sanitizeProfileInterests from 'utils/functions/sanitizeProfileInterests'

const MAX_TOPICS_ALLOWED = 12

const Topics = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)

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
            <h2 className="capitalize font-medium text-sm">{category.label}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={clsx(
                  'flex disabled:cursor-not-allowed items-center disabled:opacity-50 justify-between px-3 py-0.5 capitalize text-sm border border-gray-300 focus:outline-none dark:border-gray-700 rounded-full',
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
              {subCategories?.map((subCategory) => (
                <button
                  type="button"
                  disabled={
                    !selectedTopics.includes(subCategory.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  className={clsx(
                    'flex items-center disabled:cursor-not-allowed disabled:opacity-50 justify-between px-3 py-0.5 capitalize text-sm border border-gray-300 focus:outline-none dark:border-gray-700 rounded-full',
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
              ))}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Topics
