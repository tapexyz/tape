import type { FC } from 'react'
import React from 'react'

type Props = {
  acceptWarning: () => void
}

const SensitiveWarning: FC<Props> = ({ acceptWarning }) => {
  return (
    <div className="flex items-center justify-center w-full h-56 md:h-[60vh] px-10 space-x-5 text-lg text-white bg-black rounded-xl">
      <div className="flex flex-col">
        <div className="text-base">
          The following video has sensitive content and may inappropriate or
          offensive to some audiences. <div>Viewer discretion is advised.</div>
        </div>
        <div>
          <button
            type="button"
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

export default SensitiveWarning
