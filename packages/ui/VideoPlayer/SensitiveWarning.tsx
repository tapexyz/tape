import type { FC } from 'react'
import React from 'react'

type Props = {
  acceptWarning: () => void
}

const SensitiveWarning: FC<Props> = ({ acceptWarning }) => {
  return (
    <div className="flex h-56 w-full items-center justify-center space-x-5 rounded-xl bg-black px-10 text-lg text-white md:h-[60vh]">
      <div className="flex flex-col">
        <div className="text-base">
          The following video has sensitive content and may inappropriate or
          offensive to some audiences. <div>Viewer discretion is advised.</div>
        </div>
        <div>
          <button
            type="button"
            className="mt-5 rounded-xl bg-gray-800 px-5 py-2 text-sm outline-none"
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
