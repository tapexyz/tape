import Picker from '@emoji-mart/react'
import { STATIC_ASSETS } from '@tape.xyz/constants'
import {
  EmojiOutline,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@tape.xyz/ui'
import axios from 'axios'
import { useTheme } from 'next-themes'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

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
    <Popover>
      <PopoverTrigger>
        <span className="cursor-pointer">
          <EmojiOutline className="size-5" />
        </span>
      </PopoverTrigger>
      <PopoverContent align="end" className="!p-0">
        <Picker
          data={data}
          navPosition="bottom"
          theme={resolvedTheme}
          previewPosition="none"
          onEmojiSelect={(data: { native: string }) =>
            onEmojiSelect(data.native)
          }
          emojiButtonColors={[
            'rgba(155,223,88,.7)',
            'rgba(149,211,254,.7)',
            'rgba(247,233,34,.7)',
            'rgba(238,166,252,.7)',
            'rgba(255,213,143,.7)',
            'rgba(211,209,255,.7)'
          ]}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
