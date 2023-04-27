import DropMenu from '@components/UIElements/DropMenu'
import { storeLocale } from '@lib/i18n'
import usePersistStore from '@lib/store/persist'
import { useLingui } from '@lingui/react'
import clsx from 'clsx'
import React from 'react'
import { Analytics, SUPPORTED_LOCALES, TRACK } from 'utils'

import GlobeOutline from './Icons/GlobeOutline'

const Locale = () => {
  const sidebarCollapsed = usePersistStore((state) => state.sidebarCollapsed)
  const { i18n } = useLingui()
  const selectedLocale = SUPPORTED_LOCALES[i18n.locale]

  return (
    <DropMenu
      trigger={
        <button
          className={clsx(
            'flex h-12 items-center justify-center space-x-2 rounded-full p-3.5 opacity-90 hover:bg-gray-50 hover:opacity-100 focus:outline-none dark:hover:bg-gray-800',
            sidebarCollapsed ? 'w-12' : 'w-full'
          )}
        >
          <GlobeOutline className="h-4 w-4" />
          {!sidebarCollapsed && (
            <span className="text-sm">{selectedLocale}</span>
          )}
        </button>
      }
      position="bottom"
      positionClassName={sidebarCollapsed ? 'ml-20' : 'ml-44'}
      className="flex justify-center"
    >
      <div className="space-y-1 overflow-hidden rounded-xl border bg-gray-100 p-1 shadow dark:border-gray-800 dark:bg-black">
        {Object.keys(SUPPORTED_LOCALES).map((key) => (
          <button
            key={key}
            className={clsx(
              'dark:hover:bg-theme w-28 cursor-pointer overflow-hidden rounded-lg px-3 py-1 text-left hover:bg-white focus:outline-none',
              selectedLocale === SUPPORTED_LOCALES[key] && 'bg-white'
            )}
            onClick={() => {
              storeLocale(key)
              Analytics.track(TRACK.SYSTEM.SELECT_LOCALE, {
                locale: key
              })
            }}
          >
            {SUPPORTED_LOCALES[key]}
          </button>
        ))}
      </div>
    </DropMenu>
  )
}

export default Locale
