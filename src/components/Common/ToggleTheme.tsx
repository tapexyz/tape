import { useTheme } from 'next-themes'
import React from 'react'
import { MdOutlineDarkMode, MdOutlineWbSunny } from 'react-icons/md'

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
        }}
        className="flex items-center px-2 py-1.5 space-x-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none opacity-70 hover:opacity-100"
      >
        {theme === 'light' ? <MdOutlineDarkMode /> : <MdOutlineWbSunny />}
        <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
      </button>
    </div>
  )
}

export default ToggleTheme
