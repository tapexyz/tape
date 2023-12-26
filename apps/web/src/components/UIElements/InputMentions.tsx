import type { Profile } from '@tape.xyz/lens'
import type { ComponentProps, FC } from 'react'
import type { SuggestionDataItem } from 'react-mentions'

import { Text } from '@radix-ui/themes'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import { LimitType, useSearchProfilesLazyQuery } from '@tape.xyz/lens'
import clsx from 'clsx'
import React, { useId } from 'react'
import { Mention, MentionsInput } from 'react-mentions'

import ProfileSuggestion from './ProfileSuggestion'

interface Props extends ComponentProps<'textarea'> {
  className?: string
  label?: string
  mentionsSelector: string
  onContentChange: (value: string) => void
  type?: string
  validationError?: string
  value: string
}

const InputMentions: FC<Props> = ({
  label,
  mentionsSelector,
  onContentChange,
  validationError,
  value,
  ...props
}) => {
  const id = useId()
  const [searchProfiles] = useSearchProfilesLazyQuery()

  const fetchSuggestions = async (
    query: string,
    callback: (data: SuggestionDataItem[]) => void
  ) => {
    if (!query) {
      return
    }
    try {
      const { data } = await searchProfiles({
        variables: {
          request: {
            limit: LimitType.Ten,
            query,
            where: {
              customFilters: LENS_CUSTOM_FILTERS
            }
          }
        }
      })
      if (data?.searchProfiles.__typename === 'PaginatedProfileResult') {
        const profiles = data?.searchProfiles?.items as Profile[]
        const channels = profiles?.map((profile: Profile) => ({
          display: getProfile(profile)?.displayName,
          followers: profile.stats.followers,
          id: profile.handle?.fullHandle,
          picture: getProfilePicture(profile, 'AVATAR'),
          profileId: profile.id
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
          <Text size="2" weight="medium">
            {label}
          </Text>
        </div>
      )}
      <div className="flex">
        <MentionsInput
          className={mentionsSelector}
          id={id}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={props.placeholder}
          value={value}
        >
          <Mention
            appendSpaceOnAdd
            data={fetchSuggestions}
            displayTransform={(handle) => `@${handle} `}
            markup=" @__id__ "
            renderSuggestion={(
              suggestion: SuggestionDataItem & {
                followers?: number
                picture?: string
                profileId?: string
              },
              _search,
              _highlightedDisplay,
              _index,
              focused
            ) => (
              <ProfileSuggestion
                className={clsx({
                  'bg-brand-50 rounded dark:bg-black': focused
                })}
                followers={suggestion.followers as number}
                handle={suggestion.id as string}
                id={suggestion.profileId as string}
                pfp={suggestion.picture as string}
              />
            )}
            trigger="@"
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
