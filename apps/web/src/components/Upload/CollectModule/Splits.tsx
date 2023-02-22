import InfoOutline from '@components/Common/Icons/InfoOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import { utils } from 'ethers'
import type { RecipientDataInput } from 'lens'
import { useResolveProfileAddressLazyQuery } from 'lens'
import React from 'react'
import {
  Analytics,
  IS_MAINNET,
  LENSTUBE_APP_NAME,
  LENSTUBE_DONATION_ADDRESS,
  TRACK
} from 'utils'
import splitNumber from 'utils/functions/splitNumber'

const Splits = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const splitRecipients = uploadedVideo.collectModule.multiRecipients ?? []

  const [resolveChannelAddress, { loading: resolving }] =
    useResolveProfileAddressLazyQuery()

  const setSplitRecipients = (multiRecipients: RecipientDataInput[]) => {
    const enabled = Boolean(splitRecipients.length)
    setUploadedVideo({
      collectModule: {
        ...uploadedVideo.collectModule,
        multiRecipients,
        isMultiRecipientFeeCollect: enabled
      }
    })
  }

  const getIsValidAddress = (address: string) => utils.isAddress(address)
  const isIncludesDonationAddress =
    splitRecipients.filter((el) => el.recipient === LENSTUBE_DONATION_ADDRESS)
      .length > 0
  const getIsHandle = (value: string) => {
    return IS_MAINNET && value === 'lensprotocol'
      ? true
      : value.includes(IS_MAINNET ? '.lens' : '.test')
  }

  const onChangeSplit = async (
    key: 'recipient' | 'split',
    value: string,
    index: number
  ) => {
    const splits = splitRecipients
    const changedSplit = splits[index]
    if (key === 'split') {
      changedSplit[key] = Number(value)
    } else {
      changedSplit[key] = value
      if (!getIsValidAddress(value) && getIsHandle(value)) {
        const { data } = await resolveChannelAddress({
          variables: {
            request: {
              handle: value
            }
          }
        })
        const resolvedAddress = data?.profile?.ownedBy ?? ''
        changedSplit[key] = resolvedAddress
        Analytics.track(TRACK.RESOLVE_CHANNEL_ADDRESS)
      }
    }
    splits[index] = changedSplit
    setSplitRecipients([...splits])
  }

  const addRecipient = () => {
    const splits = splitRecipients
    splits.push({ recipient: '', split: 1 })
    setSplitRecipients([...splits])
  }

  const addDonation = () => {
    const splits = splitRecipients
    splits.push({ recipient: LENSTUBE_DONATION_ADDRESS, split: 2 })
    setSplitRecipients([...splits])
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
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
          Split revenue
        </div>
        <Tooltip
          content="Split video revenue with multiple addresses."
          placement="top"
        >
          <span>
            <InfoOutline className="my-0.5 mx-1 h-3 w-3 opacity-70" />
          </span>
        </Tooltip>
      </div>
      {!splitRecipients.length && (
        <p>Help {LENSTUBE_APP_NAME} continue to grow by adding a donation.</p>
      )}
      {splitRecipients.map((splitRecipient, i) => (
        <div className="flex gap-1.5" key={i}>
          <Input
            className={clsx(
              resolving &&
                getIsHandle(splitRecipient.recipient) &&
                'animate-pulse'
            )}
            placeholder="0x1234...89 or handle.lens"
            value={splitRecipient.recipient}
            onChange={(e) => onChangeSplit('recipient', e.target.value, i)}
            autoFocus
            autoComplete="off"
            spellCheck="false"
            suffix={
              splitRecipient.recipient === LENSTUBE_DONATION_ADDRESS
                ? LENSTUBE_APP_NAME
                : ''
            }
            disabled={splitRecipient.recipient === LENSTUBE_DONATION_ADDRESS}
            validationError={
              getIsValidAddress(splitRecipient.recipient) ? '' : ' '
            }
            showErrorLabel={false}
          />
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
            className="rounded-xl border px-1 text-[10px] font-semibold uppercase tracking-wider dark:border-gray-600"
            onClick={() => removeRecipient(i)}
          >
            <TimesOutline
              className="h-5 w-5 opacity-70 hover:text-red-500"
              outline={false}
            />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between space-x-1.5 pt-1">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            className={clsx(
              'rounded border border-gray-700 px-1 text-[10px] font-semibold uppercase tracking-wider opacity-70 dark:border-gray-300',
              splitRecipients.length >= 5 && 'invisible'
            )}
            onClick={() => addRecipient()}
          >
            Add recipient
          </button>
          {!isIncludesDonationAddress && (
            <button
              type="button"
              className={clsx(
                'rounded border border-gray-700 px-1 text-[10px] font-semibold uppercase tracking-wider opacity-70 dark:border-gray-300',
                splitRecipients.length >= 5 && 'invisible'
              )}
              onClick={() => addDonation()}
            >
              Add Donation
            </button>
          )}
        </div>
        {splitRecipients?.length >= 1 && (
          <button
            type="button"
            className="rounded border border-gray-700 px-1 text-[10px] font-semibold uppercase tracking-wider opacity-70 dark:border-gray-300"
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
