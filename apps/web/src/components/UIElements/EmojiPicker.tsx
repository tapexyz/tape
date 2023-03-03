import EmojiOutline from '@components/Common/Icons/EmojiOutline'
import Picker from '@emoji-mart/react'
import axios from 'axios'
import { useTheme } from 'next-themes'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { STATIC_ASSETS } from 'utils'

import DropMenu from './DropMenu'

type EmojiData = {
  aliases: Object
  categories: Object[]
  emojis: Object
  sheet: Object
}

type Props = {
  onEmojiSelect: (emoji: string) => void
}

const EmojiPicker: FC<Props> = ({ onEmojiSelect }) => {
  const [data, setData] = useState<EmojiData>()
  const { resolvedTheme } = useTheme()

  const fetchEmojiData = async () => {
    const response = await axios.get(`${STATIC_ASSETS}/data/emoji.json`)
    setData(response.data)
  }

  useEffect(() => {
    fetchEmojiData()
  }, [])

  return (
    <DropMenu
      trigger={
        <div className="hidden text-inherit opacity-50 hover:opacity-100 group-hover:visible md:block">
          <EmojiOutline className="h-5 w-5" />
        </div>
      }
    >
      <Picker
        autoFocus
        data={data}
        navPosition="bottom"
        theme={resolvedTheme}
        previewPosition="none"
        onEmojiSelect={(data: { native: string }) => onEmojiSelect(data.native)}
      />
    </DropMenu>
  )
}

export default EmojiPicker
