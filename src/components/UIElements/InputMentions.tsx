import { useLazyQuery } from '@apollo/client'
import logger from '@lib/logger'
import { LENS_CUSTOM_FILTERS } from '@utils/constants'
import getProfilePicture from '@utils/functions/getProfilePicture'
import clsx from 'clsx'
import { ComponentProps, FC, useId } from 'react'
import { Mention, MentionsInput, SuggestionDataItem } from 'react-mentions'
import {
  Profile,
  SearchProfilesDocument,
  SearchRequestTypes
} from 'src/types/lens'

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
  const [searchChannels] = useLazyQuery(SearchProfilesDocument)

  const fetchSuggestions = async (
    query: string,
    callback: (data: SuggestionDataItem[]) => void
  ) => {
    if (!query) return
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
      // @ts-ignore
      const channels = data?.search?.items?.map((channel: Profile) => ({
        id: channel.handle,
        display: channel.handle,
        picture: getProfilePicture(channel),
        followers: channel.stats.totalFollowers
      }))
      callback(channels)
    } catch (error) {
      callback([])
      logger.error('[Error Failed to fetch channel suggestions]', error)
    }
  }

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
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
            markup="@__id__ "
            renderSuggestion={(
              suggestion: SuggestionDataItem & {
                picture?: string
                followers?: string
              },
              _search,
              _highlightedDisplay,
              _index,
              focused
            ) => (
              <div
                className={clsx('flex truncate px-1.5 py-1.5 space-x-1', {
                  'bg-indigo-50 rounded dark:bg-black': focused
                })}
              >
                <img
                  src={suggestion?.picture}
                  className="w-5 h-5 rounded"
                  alt="pfp"
                  draggable={false}
                />
                <div className="overflow-hidden">
                  <p className="font-medium leading-4 truncate">
                    {suggestion?.id}
                  </p>
                  <span className="text-xs opacity-80">
                    {suggestion?.followers} subscribers
                  </span>
                </div>
              </div>
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
