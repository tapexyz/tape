import { NoDataFound } from '@components/UIElements/NoDataFound'
import ProfileSuggestion from '@components/UIElements/ProfileSuggestion'
import useAppStore from '@lib/store'
import { tw, useDebounce, useOutsideClick } from '@tape.xyz/browser'
import {
  LENS_CUSTOM_FILTERS,
  LENS_NAMESPACE_PREFIX,
  TAPE_ADMIN_ADDRESS,
  TAPE_APP_NAME
} from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  splitNumber,
  trimify
} from '@tape.xyz/generic'
import type { Profile, RecipientDataInput } from '@tape.xyz/lens'
import { LimitType, useSearchProfilesLazyQuery } from '@tape.xyz/lens'
import {
  InfoOutline,
  Input,
  Spinner,
  TimesOutline,
  Tooltip
} from '@tape.xyz/ui'
import type { FC, RefObject } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { isAddress } from 'viem'

type Props = {
  submitContainerRef: RefObject<HTMLDivElement>
}

const Splits: FC<Props> = ({ submitContainerRef }) => {
  const uploadedMedia = useAppStore((state) => state.uploadedMedia)
  const setUploadedMedia = useAppStore((state) => state.setUploadedMedia)
  const splitRecipients = uploadedMedia.collectModule.multiRecipients ?? []
  const [searchKeyword, setSearchKeyword] = useState('')
  const debouncedValue = useDebounce<string>(searchKeyword, 500)

  const [searchProfiles, { data: profilesData, loading: profilesLoading }] =
    useSearchProfilesLazyQuery()
  const profiles = profilesData?.searchProfiles?.items as Profile[]

  const setSplitRecipients = (multiRecipients: RecipientDataInput[]) => {
    const enabled = Boolean(splitRecipients.length)
    setUploadedMedia({
      collectModule: {
        ...uploadedMedia.collectModule,
        multiRecipients,
        isMultiRecipientFeeCollect: enabled
      }
    })
  }

  const getIsValidAddress = (address: string) => isAddress(address)
  const isIncludesDonationAddress =
    splitRecipients.filter((el) => el.recipient === TAPE_ADMIN_ADDRESS).length >
    0

  const resultsRef = useRef(null)
  useOutsideClick(resultsRef, () => {
    setSearchKeyword('')
  })

  const onDebounce = async () => {
    if (trimify(searchKeyword).length) {
      await searchProfiles({
        variables: {
          request: {
            limit: LimitType.Ten,
            query: searchKeyword,
            where: {
              customFilters: LENS_CUSTOM_FILTERS
            }
          }
        }
      })
    }
  }

  useEffect(() => {
    onDebounce()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue])

  const onChangeSplit = async (
    key: 'recipient' | 'split',
    value: string,
    index: number
  ) => {
    const splits = splitRecipients
    const changedSplit = splits[index]
    if (key === 'split') {
      changedSplit[key] = Number(Number(value).toFixed(2))
    } else {
      changedSplit[key] = value
      if (!getIsValidAddress(value)) {
        setSearchKeyword(value)
      }
    }
    splits[index] = changedSplit
    setSplitRecipients([...splits])
  }

  const scrollToSubmit = () => {
    // requires some time because the input fields shifts the layout back down
    setTimeout(() => {
      submitContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const addDonation = () => {
    const splits = splitRecipients
    splits.push({ recipient: TAPE_ADMIN_ADDRESS, split: 2 })
    setSplitRecipients([...splits])
    scrollToSubmit()
  }

  const addRecipient = () => {
    const splits = splitRecipients
    splits.push({ recipient: '', split: 1 })
    setSplitRecipients([...splits])
    scrollToSubmit()
  }

  const removeRecipient = (index: number) => {
    const splits = splitRecipients
    if (index >= 0) {
      splits.splice(index, 1)
    }
    setSplitRecipients([...splits])
  }

  const splitEvenly = () => {
    const equalSplits = splitNumber(100, splitRecipients.length)
    const splits = splitRecipients.map((splitRecipient, i) => {
      return {
        recipient: splitRecipient.recipient,
        split: equalSplits[i]
      }
    })
    setSplitRecipients([...splits])
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center">
        <span className="text-sm font-medium">Split revenue</span>
        <Tooltip content="Split collect revenue with anyone" placement="top">
          <span>
            <InfoOutline className="mx-1 size-3 opacity-70" />
          </span>
        </Tooltip>
      </div>
      {splitRecipients.map((splitRecipient, i) => (
        <div className="flex gap-1.5" key={i}>
          <div className="relative w-full">
            <Input
              placeholder={`0x12345...89 or ${LENS_NAMESPACE_PREFIX}tape`}
              value={splitRecipient.recipient}
              onChange={(e) => onChangeSplit('recipient', e.target.value, i)}
              autoFocus
              autoComplete="off"
              spellCheck="false"
              title={
                splitRecipient.recipient === TAPE_ADMIN_ADDRESS
                  ? TAPE_APP_NAME
                  : undefined
              }
              suffix={
                splitRecipient.recipient === TAPE_ADMIN_ADDRESS
                  ? `${TAPE_APP_NAME}.xyz`.toLowerCase()
                  : ''
              }
              disabled={splitRecipient.recipient === TAPE_ADMIN_ADDRESS}
              error={getIsValidAddress(splitRecipient.recipient) ? '' : ' '}
              showError={false}
            />
            {searchKeyword.length &&
            !getIsValidAddress(splitRecipients[i].recipient) ? (
              <div
                ref={resultsRef}
                className="tape-border z-10 mt-1 w-full overflow-hidden rounded-md bg-white focus:outline-none md:absolute dark:bg-black"
              >
                {profilesLoading && <Spinner className="my-4" />}
                {!profiles?.length && !profilesLoading ? (
                  <NoDataFound isCenter text="No profiles found" />
                ) : null}
                {profiles?.slice(0, 2)?.map((profile) => (
                  <button
                    type="button"
                    onClick={() => {
                      onChangeSplit('recipient', getProfile(profile).address, i)
                      setSearchKeyword('')
                    }}
                    className="w-full"
                    key={profile.id}
                  >
                    <ProfileSuggestion
                      id={profile.id}
                      pfp={getProfilePicture(profile, 'AVATAR')}
                      handle={getProfile(profile).slug}
                      followers={profile.stats.followers}
                      className="hover:bg-brand-50 text-left dark:hover:bg-black"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="w-1/3">
            <Input
              type="number"
              placeholder="2"
              suffix="%"
              value={splitRecipient.split}
              onChange={(e) => onChangeSplit('split', e.target.value, i)}
            />
          </div>
          <button
            type="button"
            className="rounded-lg px-2 text-red-500"
            onClick={() => removeRecipient(i)}
          >
            <TimesOutline className="size-4" outlined={false} />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between space-x-1.5 pt-1">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            className={tw(
              'rounded border border-gray-700 px-1 text-[10px] font-bold uppercase tracking-wider opacity-70 dark:border-gray-300',
              splitRecipients.length >= 5 && 'invisible'
            )}
            onClick={() => addRecipient()}
          >
            Add recipient
          </button>
          {!isIncludesDonationAddress && (
            <button
              type="button"
              className={tw(
                'rounded border border-gray-700 px-1 text-[10px] font-bold uppercase tracking-wider opacity-70 dark:border-gray-300',
                splitRecipients.length >= 5 && 'invisible'
              )}
              onClick={() => addDonation()}
            >
              Add Donation
            </button>
          )}
        </div>
        {splitRecipients?.length > 1 && (
          <button
            type="button"
            className="rounded border border-gray-700 px-1 text-[10px] font-bold uppercase tracking-wider opacity-70 dark:border-gray-300"
            onClick={() => splitEvenly()}
          >
            Split evenly
          </button>
        )}
      </div>
    </div>
  )
}

export default Splits
