import { Button } from '@components/UIElements/Button'
import { Loader } from '@components/UIElements/Loader'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import type { Profile } from 'lens'
import {
  useAddProfileInterestMutation,
  useProfileInterestsQuery,
  useProfileLazyQuery,
  useRemoveProfileInterestMutation
} from 'lens'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Analytics, TRACK } from 'utils'
import sanitizeProfileInterests from 'utils/functions/sanitizeProfileInterests'

const MAX_TOPICS_ALLOWED = 12

type Props = {
  showSave?: boolean
}

const Topics: FC<Props> = ({ showSave }) => {
  const selectedChannel = useAppStore((state) => state.selectedChannel)
  const setSelectedChannel = useAppStore((state) => state.setSelectedChannel)
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    selectedChannel?.interests ?? []
  )

  useEffect(() => {
    Analytics.track(TRACK.PROFILE_INTERESTS.VIEW)
  }, [])

  const { data, loading } = useProfileInterestsQuery()
  const [addProfileInterests] = useAddProfileInterestMutation()
  const [removeProfileInterests] = useRemoveProfileInterestMutation()

  const [refetchChannel, { loading: saving }] = useProfileLazyQuery({
    onCompleted: (data) => {
      const channel = data?.profile as Profile
      setSelectedChannel(channel)
      toast.success('Interests updated')
    }
  })

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
        Analytics.track(TRACK.PROFILE_INTERESTS.ADD)
        return addProfileInterests({ variables })
      }
      const topics = [...selectedTopics]
      topics.splice(topics.indexOf(topic), 1)
      setSelectedTopics(topics)
      Analytics.track(TRACK.PROFILE_INTERESTS.REMOVE)
      removeProfileInterests({ variables })
    } catch {}
  }

  const onSave = () => {
    refetchChannel({
      variables: {
        request: { handle: selectedChannel?.handle }
      },
      fetchPolicy: 'no-cache'
    })
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
                    '!border-indigo-500': selectedTopics.includes(category.id)
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
                      '!border-indigo-500': selectedTopics.includes(
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
            </div>
          </div>
        )
      )}
      {showSave && (
        <div className="flex w-full justify-end">
          <Button disabled={saving} loading={saving} onClick={() => onSave()}>
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

export default Topics
