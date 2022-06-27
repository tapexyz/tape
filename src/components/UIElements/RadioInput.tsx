import React, { FC } from 'react'

type Props = {
  question: React.ReactNode
  checked: boolean
  // eslint-disable-next-line no-unused-vars
  onChange: (b: boolean) => void
}

const RadioInput: FC<Props> = ({ question, checked, onChange }) => {
  return (
    <div>
      <label className="text-sm">{question}</label>
      <div className="flex space-x-4 items-center mt-1.5 text-xs">
        <div className="flex items-center">
          <input
            className="w-3 h-3 text-indigo-600 bg-indigo-100 border-indigo-300 focus:outline-none dark:bg-indigo-700 dark:border-indigo-900"
            type="radio"
            id="option1"
            checked={checked}
            onChange={() => onChange(true)}
          />
          <label
            className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            htmlFor="option1"
          >
            Yes
          </label>
        </div>
        <div className="flex items-center">
          <input
            className="w-3 h-3 text-indigo-600 bg-indigo-100 border-gray-300 focus:outline-none dark:bg-indigo-700 dark:border-indigo-600"
            type="radio"
            id="option2"
            checked={!checked}
            onChange={() => onChange(false)}
          />
          <label
            className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300"
            htmlFor="option2"
          >
            No
          </label>
        </div>
      </div>
    </div>
  )
}

export default RadioInput
