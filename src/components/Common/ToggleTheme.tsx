import { useTheme } from 'next-themes'
import React from 'react'
import { MdOutlineDarkMode, MdOutlineWbSunny } from 'react-icons/md'

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={() => {
          setTheme(theme === 'dark' ? 'light' : 'dark')
        }}
        className="p-2.5 focus:outline-none opacity-70 hover:opacity-100"
      >
        {theme === 'light' ? <MdOutlineDarkMode /> : <MdOutlineWbSunny />}
      </button>
    </div>
  )
}

export default ToggleTheme
