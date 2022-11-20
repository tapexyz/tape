import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import sanitizeProfileInterests from '@utils/functions/sanitizeProfileInterests'
import clsx from 'clsx'
import type { Profile } from 'lens'
import {
  useAddProfileInterestMutation,
  useProfileInterestsQuery,
  useProfileQuery
} from 'lens'
import React, { useState } from 'react'

const MAX_TOPICS_ALLOWED = 12

const Topics = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)

  const { refetch } = useProfileQuery({
    variables: { request: { handle: selectedChannel?.handle } },
    onCompleted: (data) => {
      const channel = data?.profile as Profile
      setSelectedTopics(data.profile?.interests ?? [])
      setSelectedChannel(channel)
    }
  })

  const { data, loading } = useProfileInterestsQuery()
  const [addProfileInterests, { loading: saving }] =
    useAddProfileInterestMutation({
      onCompleted: () => {
        refetch()
      }
    })

  const interestsData = (data?.profileInterests as string[]) || []

  const onSelectTopic = (topic: string) => {
    if (selectedTopics.length === MAX_TOPICS_ALLOWED) return
    if (!selectedTopics.includes(topic)) {
      const interests = [...selectedTopics, topic]
      return setSelectedTopics(interests)
    }
    const topics = [...selectedTopics]
    topics.splice(topics.indexOf(topic), 1)
    setSelectedTopics(topics)
  }

  const saveInterests = () => {
    addProfileInterests({
      variables: {
        request: {
          profileId: selectedChannel?.id,
          interests: selectedTopics
        }
      }
    })
  }

  return (
    <div className="flex flex-col space-y-3">
      {loading && <Loader className="my-10" />}
      {sanitizeProfileInterests(interestsData)?.map(
        ({ category, subCategories }) => (
          <div className="w-full space-y-1" key={category.id}>
            <h2 className="capitalize font-medium">{category.label}</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {subCategories?.map((subCategory) => (
                <button
                  type="button"
                  disabled={
                    !selectedTopics.includes(subCategory.id) &&
                    selectedTopics.length === MAX_TOPICS_ALLOWED
                  }
                  className={clsx(
                    'flex items-center justify-between px-4 py-1 capitalize text-sm border border-gray-300 focus:outline-none dark:border-gray-700 rounded-full',
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
                    'flex items-center justify-between px-4 py-1 capitalize text-sm border border-gray-300 focus:outline-none dark:border-gray-700 rounded-full',
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
      <div className="flex bottom-0 right-0 sticky justify-end">
        <Button
          loading={saving}
          disabled={saving}
          onClick={() => saveInterests()}
          className="!m-1 outline-none"
        >
          Save
        </Button>
      </div>
    </div>
  )
}

export default Topics
