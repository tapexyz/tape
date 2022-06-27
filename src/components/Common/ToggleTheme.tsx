import { useTheme } from 'next-themes'
import React from 'react'

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }}
      className="inline-flex px-2.5 py-1.5 items-center w-full space-x-2 rounded-lg opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-900"
    >
      {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
    </button>
  )
}

export default ToggleTheme
