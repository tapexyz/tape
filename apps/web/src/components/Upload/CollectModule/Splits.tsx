import InfoOutline from '@components/Common/Icons/InfoOutline'
import TimesOutline from '@components/Common/Icons/TimesOutline'
import { Input } from '@components/UIElements/Input'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { useResolveProfileAddressLazyQuery } from 'lens'
import React from 'react'
import { Analytics, IS_MAINNET, TRACK } from 'utils'
import splitNumber from 'utils/functions/splitNumber'

const Splits = () => {
  const uploadedVideo = useAppStore((state) => state.uploadedVideo)
  const setUploadedVideo = useAppStore((state) => state.setUploadedVideo)
  const splitRecipients = uploadedVideo.collectModule.multiRecipients ?? []

  const [resolveChannelAddress, { loading: resolving }] =
    useResolveProfileAddressLazyQuery()

  const setSplitRecipients = (
    multiRecipients: { recipient: string; split: number }[]
  ) => {
    setUploadedVideo({
      collectModule: {
        ...uploadedVideo.collectModule,
        multiRecipients,
        isMultiRecipientFeeCollect: Boolean(splitRecipients.length)
      }
    })
  }

  const getIsValidAddress = (address: string) => ethers.utils.isAddress(address)
  const getIsHandle = (value: string) =>
    value.includes(IS_MAINNET ? '.lens' : '.test')

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
    splits.push({ recipient: '', split: 0 })
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
          content="Split all future video revenue with given addresses."
          placement="top"
        >
          <span>
            <InfoOutline className="my-0.5 mx-1 h-3 w-3 opacity-70" />
          </span>
        </Tooltip>
      </div>
      {splitRecipients.map((splitRecipient, i) => (
        <div className="flex gap-1.5" key={i}>
          <Input
            placeholder="0x1234...89 or handle.lens"
            value={splitRecipient.recipient}
            validationError={
              getIsValidAddress(splitRecipient.recipient) ? '' : ' '
            }
            className={clsx(
              resolving &&
                getIsHandle(splitRecipient.recipient) &&
                'animate-pulse'
            )}
            autoComplete="off"
            showErrorLabel={false}
            onChange={(e) => onChangeSplit('recipient', e.target.value, i)}
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
            <TimesOutline className="h-5 w-5 opacity-70 hover:text-red-500" />
          </button>
        </div>
      ))}
      <div className="flex items-center justify-between space-x-1.5 pt-1">
        <button
          type="button"
          className="rounded border border-gray-700 px-1 text-[10px] font-semibold uppercase tracking-wider opacity-70 dark:border-gray-300"
          onClick={() => addRecipient()}
        >
          Add recipient
        </button>
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
