import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import clsx from 'clsx'
import { useTheme } from 'next-themes'
import React from 'react'
import { MdOutlineDarkMode, MdOutlineWbSunny } from 'react-icons/md'

const ToggleTheme = () => {
  const { theme, setTheme } = useTheme()
  const { isSideBarOpen } = useAppStore()

  return (
    <div className="flex flex-col w-full items-center space-y-2 mb-0.5">
      <Tooltip
        placement="right"
        visible={!isSideBarOpen}
        content={theme === 'light' ? 'Swtich to Dark' : 'Switch to Light'}
      >
        <button
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }}
          className={clsx(
            'flex items-center p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none opacity-70 hover:opacity-100',
            { 'w-full': isSideBarOpen }
          )}
        >
          {theme === 'light' ? <MdOutlineDarkMode /> : <MdOutlineWbSunny />}
          {isSideBarOpen && (
            <span className="text-xs">
              {theme === 'light' ? 'Swtich to Dark' : 'Switch to Light'}
            </span>
          )}
        </button>
      </Tooltip>
    </div>
  )
}

export default ToggleTheme
