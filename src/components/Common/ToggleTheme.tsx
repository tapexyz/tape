import Tooltip from '@components/UIElements/Tooltip'
import { useTheme } from 'next-themes'
import React from 'react'
import { MdOutlineDarkMode, MdOutlineWbSunny } from 'react-icons/md'

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col w-full space-y-2 mb-0.5">
      <Tooltip
        placement="right"
        content={theme === 'light' ? 'Swtich to Dark' : 'Switch to Light'}
      >
        <button
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }}
          className="flex p-3 py-4 space-x-2 justify-center rounded-lg hover:bg-gray-50 dark:hover:bg-[#181818] focus:outline-none opacity-70 hover:opacity-100"
        >
          {theme === 'light' ? <MdOutlineDarkMode /> : <MdOutlineWbSunny />}
        </button>
      </Tooltip>
    </div>
  )
}

export default ToggleTheme
