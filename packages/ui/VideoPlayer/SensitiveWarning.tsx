import type { FC } from 'react'
import React from 'react'

type Props = {
  acceptWarning: () => void
}

const SensitiveWarning: FC<Props> = ({ acceptWarning }) => {
  return (
    <div className="dark:bg-cod flex aspect-[16/9] h-full w-full items-center justify-center space-x-5 rounded-xl bg-gray-100 p-10 text-lg dark:text-white">
      <div className="flex flex-col">
        <div className="text-base">
          The following video has sensitive content and may be inappropriate or
          offensive to some audiences. <b>Viewer discretion is advised.</b>
        </div>
        <div>
          <button
            type="button"
            className="mt-5 rounded-md bg-gray-800 px-5 py-2 text-sm font-medium text-white outline-none"
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
