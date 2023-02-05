import type { FC } from 'react'
import React, { useId } from 'react'

type Props = {
  question: React.ReactNode
  checked: boolean
  onChange: (b: boolean) => void
}

const RadioInput: FC<Props> = ({ question, checked, onChange }) => {
  const id = useId()
  return (
    <div>
      <label className="text-sm">{question}</label>
      <div className="mt-1.5 flex items-center space-x-4 text-xs">
        <div className="flex items-center">
          <input
            className="h-3 w-3 border-indigo-300 bg-indigo-100 text-indigo-600 focus:outline-none dark:border-indigo-900 dark:bg-indigo-700"
            type="radio"
            id={`option1_${id}`}
            checked={checked}
            onChange={() => onChange(true)}
          />
          <label
            className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            htmlFor={`option1_${id}`}
          >
            Yes
          </label>
        </div>
        <div className="flex items-center">
          <input
            className="h-3 w-3 border-gray-300 bg-indigo-100 text-indigo-600 focus:outline-none dark:border-indigo-600 dark:bg-indigo-700"
            type="radio"
            id={`option2_${id}`}
            checked={!checked}
            onChange={() => onChange(false)}
          />
          <label
            className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            htmlFor={`option2_${id}`}
          >
            No
          </label>
        </div>
      </div>
    </div>
  )
}

export default RadioInput
