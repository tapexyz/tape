import useCopyToClipboard from '@utils/hooks/useCopyToClipboard'
import React, { FC } from 'react'
import toast from 'react-hot-toast'
import { IoCopyOutline } from 'react-icons/io5'
import { StreamData } from 'src/types/local'

type Props = {
  stream: StreamData
}

const StreamDetails: FC<Props> = ({ stream }) => {
  const [, copy] = useCopyToClipboard()

  const onCopyKey = async (value: string) => {
    await copy(value)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="p-1">
      <div className="mt-4">
        <div className="text-xs font-semibold opacity-70">Stream URL</div>
        <div className="flex items-center justify-between">
          <span>{stream.hostUrl}</span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() => onCopyKey(stream.hostUrl)}
            type="button"
          >
            <IoCopyOutline />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold opacity-70">Stream Key</div>
        <div className="flex items-center justify-between">
          <span>{stream.streamKey}</span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() => onCopyKey(stream.streamKey)}
            type="button"
          >
            <IoCopyOutline />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StreamDetails
