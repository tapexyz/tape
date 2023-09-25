import { Analytics, TRACK } from '@lenstube/browser'
import { SUPPORTED_LOCALES } from '@lenstube/constants'
import { storeLocale } from '@lib/i18n'
import { useLingui } from '@lingui/react'
import { DropdownMenu, Text } from '@radix-ui/themes'
import React from 'react'

import GlobeOutline from './Icons/GlobeOutline'

const Locale = () => {
  const { i18n } = useLingui()
  const selectedLocale = SUPPORTED_LOCALES[i18n.locale]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button className="flex h-12 w-12 items-center justify-center rounded-full p-3.5 hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-800">
          <GlobeOutline className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" variant="soft">
        {Object.keys(SUPPORTED_LOCALES).map((key) => (
          <DropdownMenu.Item
            key={key}
            color={selectedLocale === SUPPORTED_LOCALES[key] ? 'green' : 'gray'}
            onClick={() => {
              storeLocale(key)
              Analytics.track(TRACK.SYSTEM.SELECT_LOCALE, {
                locale: key
              })
            }}
          >
            <Text
              as="p"
              size="4"
              weight={
                selectedLocale === SUPPORTED_LOCALES[key] ? 'bold' : 'regular'
              }
              className="w-24"
            >
              {SUPPORTED_LOCALES[key]}
            </Text>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default Locale
