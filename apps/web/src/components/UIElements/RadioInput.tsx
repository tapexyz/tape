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
      <div className="flex space-x-4 items-center mt-1.5 text-xs">
        <div className="flex items-center">
          <input
            className="w-3 h-3 text-indigo-600 bg-indigo-100 border-indigo-300 focus:outline-none dark:bg-indigo-700 dark:border-indigo-900"
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
            className="w-3 h-3 text-indigo-600 bg-indigo-100 border-gray-300 focus:outline-none dark:bg-indigo-700 dark:border-indigo-600"
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
