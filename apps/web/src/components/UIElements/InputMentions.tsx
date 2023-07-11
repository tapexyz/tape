import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import { getProfilePicture } from '@lenstube/generic'
import type { Profile } from '@lenstube/lens'
import { SearchRequestTypes, useSearchProfilesLazyQuery } from '@lenstube/lens'
import clsx from 'clsx'
import type { ComponentProps, FC } from 'react'
import React, { useId } from 'react'
import type { SuggestionDataItem } from 'react-mentions'
import { Mention, MentionsInput } from 'react-mentions'

import ChannelSuggestions from './ChannelSuggestions'

interface Props extends ComponentProps<'textarea'> {
  label?: string
  type?: string
  className?: string
  validationError?: string
  value: string
  onContentChange: (value: string) => void
  mentionsSelector: string
}

const InputMentions: FC<Props> = ({
  label,
  validationError,
  value,
  onContentChange,
  mentionsSelector,
  ...props
}) => {
  const id = useId()
  const [searchChannels] = useSearchProfilesLazyQuery()

  const fetchSuggestions = async (
    query: string,
    callback: (data: SuggestionDataItem[]) => void
  ) => {
    if (!query) {
      return
    }
    try {
      const { data } = await searchChannels({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query,
            limit: 5,
            customFilters: LENS_CUSTOM_FILTERS
          }
        }
      })
      if (data?.search.__typename === 'ProfileSearchResult') {
        const profiles = data?.search?.items as Profile[]
        const channels = profiles?.map((channel: Profile) => ({
          id: channel.handle,
          display: channel.handle,
          profileId: channel.id,
          picture: getProfilePicture(channel),
          followers: channel.stats.totalFollowers
        }))
        callback(channels)
      }
    } catch {
      callback([])
    }
  }

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="mb-1 flex items-center space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">
            {label}
          </div>
        </div>
      )}
      <div className="flex">
        <MentionsInput
          id={id}
          className={mentionsSelector}
          value={value}
          placeholder={props.placeholder}
          onChange={(e) => onContentChange(e.target.value)}
        >
          <Mention
            trigger="@"
            displayTransform={(handle) => `@${handle} `}
            markup=" @__id__ "
            appendSpaceOnAdd
            renderSuggestion={(
              suggestion: SuggestionDataItem & {
                picture?: string
                followers?: number
                profileId?: string
              },
              _search,
              _highlightedDisplay,
              _index,
              focused
            ) => (
              <ChannelSuggestions
                id={suggestion.profileId as string}
                picture={suggestion.picture as string}
                handle={suggestion.id as string}
                className={clsx({
                  'dark:bg-theme rounded bg-indigo-50': focused
                })}
                subscribersCount={suggestion.followers as number}
              />
            )}
            data={fetchSuggestions}
          />
        </MentionsInput>
      </div>
      {validationError && (
        <div className="mx-1 mt-1 text-xs font-medium text-red-500">
          {validationError}
        </div>
      )}
    </label>
  )
}

export default InputMentions
