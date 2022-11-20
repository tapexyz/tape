import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import {
  useAddProfileInterestMutation,
  useProfileInterestsQuery,
  useRemoveProfileInterestMutation
} from 'lens'
import React, { useState } from 'react'
import sanitizeProfileInterests from 'utils/functions/sanitizeProfileInterests'

const MAX_TOPICS_ALLOWED = 12

const Topics = () => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    selectedChannel?.interests ?? []
  )

  const { data, loading } = useProfileInterestsQuery()
  const [addProfileInterests] = useAddProfileInterestMutation()
  const [removeProfileInterests] = useRemoveProfileInterestMutation()

  const interestsData = (data?.profileInterests as string[]) || []

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
        setSelectedTopics(interests)
        return addProfileInterests({ variables })
      }
      const topics = [...selectedTopics]
      topics.splice(topics.indexOf(topic), 1)
      setSelectedTopics(topics)
      removeProfileInterests({ variables })
    } catch {}
  }

  return (
    <div className="flex flex-col space-y-3">
      {loading && <Loader className="my-10" />}
      {sanitizeProfileInterests(interestsData)?.map(
        ({ category, subCategories }) => (
          <div className="w-full space-y-2" key={category.id}>
            <h2 className="capitalize font-medium">{category.label}</h2>
            <div className="flex flex-wrap items-center gap-2">
              {subCategories?.map((subCategory) => (
                <button
                  type="button"
                  disabled={
                    !selectedTopics.includes(subCategory.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  className={clsx(
                    'flex items-center disabled:cursor-not-allowed justify-between px-3 py-0.5 capitalize text-sm border border-gray-300 focus:outline-none dark:border-gray-700 rounded-full',
                    {
                      'border-indigo-500': selectedTopics.includes(
                        subCategory.id
                      )
                    }
                  )}
                  key={subCategory.id}
                  onClick={() => onSelectTopic(subCategory.id)}
                >
                  {subCategory.label}
                </button>
              ))}
              {!subCategories.length && (
                <button
                  type="button"
                  className={clsx(
                    'flex disabled:cursor-not-allowed items-center justify-between px-3 py-0.5 capitalize text-sm border border-gray-300 focus:outline-none dark:border-gray-700 rounded-full',
                    {
                      'border-indigo-500': selectedTopics.includes(category.id)
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
              )}
            </div>
          </div>
        )
      )}
    </div>
  )
}

export default Topics
