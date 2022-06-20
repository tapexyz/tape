import { useTheme } from 'next-themes'
import React from 'react'
import { MdOutlineDarkMode, MdOutlineWbSunny } from 'react-icons/md'

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
      }}
      className="inline-flex items-center w-full px-2 py-2 space-x-2 rounded-lg opacity-70 hover:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {theme === 'light' ? (
        <MdOutlineDarkMode className="text-lg" />
      ) : (
        <MdOutlineWbSunny className="text-lg" />
      )}
      <span className="text-sm whitespace-nowrap">
        {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
      </span>
    </button>
  )
}

export default ToggleTheme
