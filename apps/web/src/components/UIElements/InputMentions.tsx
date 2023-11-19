import { LENS_CUSTOM_FILTERS } from '@dragverse/constants'
import { getProfile, getProfilePicture } from '@dragverse/generic'
import type { Profile } from '@dragverse/lens'
import { LimitType, useSearchProfilesLazyQuery } from '@dragverse/lens'
import { Text } from '@radix-ui/themes'
import clsx from 'clsx'
import type { ComponentProps, FC } from 'react'
import { useId } from 'react'
import type { SuggestionDataItem } from 'react-mentions'
import { Mention, MentionsInput } from 'react-mentions'

import ProfileSuggestion from './ProfileSuggestion'

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
            query,
            limit: LimitType.Ten,
            where: {
              customFilters: LENS_CUSTOM_FILTERS
            }
          }
        }
      })
      if (data?.searchProfiles.__typename === 'PaginatedProfileResult') {
        const profiles = data?.searchProfiles?.items as Profile[]
        const channels = profiles?.map((profile: Profile) => ({
          id: profile.handle?.fullHandle,
          display: getProfile(profile)?.displayName,
          profileId: profile.id,
          picture: getProfilePicture(profile, 'AVATAR'),
          followers: profile.stats.followers
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
              <ProfileSuggestion
                id={suggestion.profileId as string}
                pfp={suggestion.picture as string}
                handle={suggestion.id as string}
                followers={suggestion.followers as number}
                className={clsx({
                  'bg-brand-50 rounded dark:bg-black': focused
                })}
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
