import React from 'react'
import { TbAlertTriangle } from 'react-icons/tb'

type Props = {
  acceptWarning: () => void
}

export default function SensitiveWarning({ acceptWarning }: Props) {
  return (
    <div className="bg-black rounded-xl aspect-video flex w-full h-96 text-white justify-center items-center text-lg px-10 space-x-5">
      <TbAlertTriangle className="h-28 w-28" />
      <div className="flex flex-col">
        <div>
          The following video has sensitive content and may inappropriate or
          offensive to some audiences. Viewer discretion is advised
        </div>
        <button
          className="bg-gray-800 px-5 py-2 mt-5 rounded w-80"
          onClick={() => acceptWarning()}
        >
          I understand & wish to proceed
        </button>
      </div>
    </div>
  )
}
