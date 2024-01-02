import type { TextAreaProps } from '@radix-ui/themes/dist/cjs/components/text-area'
import { useDebounce, useOutsideClick } from '@tape.xyz/browser'
import { LENS_CUSTOM_FILTERS } from '@tape.xyz/constants'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile } from '@tape.xyz/lens'
import { LimitType, useSearchProfilesLazyQuery } from '@tape.xyz/lens'
import { Loader } from '@tape.xyz/ui'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import getCaretCoordinates from 'textarea-caret'

import ProfileSuggestion from './ProfileSuggestion'
import { TextArea } from './TextArea'

interface Props extends TextAreaProps {
  label?: string
  className?: string
  validationError?: string
  onContentChange: (value: string) => void
}

const InputMentions: FC<Props> = ({
  label,
  placeholder,
  validationError,
  onContentChange,
  ...props
}) => {
  const [dropdownStyle, setDropdownStyle] = useState({})
  const [showPopover, setShowPopover] = useState(false)
  const [keyword, setKeyword] = useState('')

  const textareaRef = useRef(null)
  const resultsRef = useRef(null)
  const debouncedValue = useDebounce<string>(keyword, 500)

  const [searchProfiles, { data, loading }] = useSearchProfilesLazyQuery()
  const profiles = data?.searchProfiles?.items as Profile[]

  const clearStates = () => {
    setDropdownStyle({})
    setShowPopover(false)
    setKeyword('')
  }

  useOutsideClick(resultsRef, () => {
    clearStates()
  })

  const fetchSuggestions = async () => {
    if (!keyword.length) {
      return
    }
    try {
      await searchProfiles({
        variables: {
          request: {
            query: keyword,
            limit: LimitType.Ten,
            where: {
              customFilters: LENS_CUSTOM_FILTERS
            }
          }
        }
      })
    } catch {}
  }

  useEffect(() => {
    fetchSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value
    onContentChange(value)
    if (!textareaRef.current) {
      return
    }

    const lastWord = value.split(/\s/).pop() || ''

    if (lastWord.startsWith('@') && lastWord.length > 3) {
      const coordinates = getCaretCoordinates(
        textareaRef.current,
        event.target.selectionEnd
      )
      setDropdownStyle({
        top: `${coordinates.top}px`,
        left: `${coordinates.left}px`
      })
      setKeyword(lastWord)
      setShowPopover(true)
    } else {
      clearStates()
    }
  }

  const handleProfileClick = (profile: Profile) => {
    const value = props.value as string
    const lastAtSignIndex = value.lastIndexOf('@')
    if (lastAtSignIndex !== -1) {
      const newValue = `${value.substring(0, lastAtSignIndex)}@${profile.handle
        ?.fullHandle} `
      onContentChange(newValue)
    }
    clearStates()
  }

  return (
    <div className="relative w-full">
      <TextArea
        {...props}
        ref={textareaRef}
        label={label}
        placeholder={placeholder}
        onChange={handleInputChange}
        validationError={validationError}
      />
      {showPopover ? (
        <div
          ref={resultsRef}
          style={dropdownStyle}
          className="rounded-medium tape-border absolute z-10 mt-10 bg-white p-1.5 dark:bg-black"
        >
          {loading ? (
            <Loader />
          ) : (
            profiles?.map((profile: Profile) => (
              <div key={profile.id} className="w-48">
                <button
                  type="button"
                  onClick={() => handleProfileClick(profile)}
                  className="hover:dark:bg-smoke hover:bg-gallery w-full rounded-lg text-left"
                >
                  <ProfileSuggestion
                    followers={profile.stats.followers}
                    handle={getProfile(profile)?.slug}
                    pfp={getProfilePicture(profile, 'AVATAR')}
                    id={profile.id}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}

export default InputMentions
