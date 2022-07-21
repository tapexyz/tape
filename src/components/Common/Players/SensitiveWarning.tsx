import React from 'react'
import { IoWarningOutline } from 'react-icons/io5'

type Props = {
  acceptWarning: () => void
}

export default function SensitiveWarning({ acceptWarning }: Props) {
  return (
    <div className="flex items-center justify-center w-full px-10 space-x-5 text-lg text-white bg-black aspect-h-9 rounded-xl aspect-video h-96">
      <IoWarningOutline className="h-28 w-28" />
      <div className="flex flex-col">
        <div className="text-base">
          The following video has sensitive content and may inappropriate or
          offensive to some audiences. <div>Viewer discretion is advised.</div>
        </div>
        <div>
          <button
            className="px-5 py-2 mt-5 text-sm bg-gray-800 outline-none rounded-xl"
            onClick={() => acceptWarning()}
          >
            I understand & wish to proceed
          </button>
        </div>
      </div>
    </div>
  )
}
