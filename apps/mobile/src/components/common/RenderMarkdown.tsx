import type { FC } from 'react'
import React from 'react'
import Markdown from 'react-native-marked'
import type { MarkedStyles } from 'react-native-marked/dist/typescript/theme/types'

type Props = {
  content: string
  styles?: MarkedStyles
}

const RenderMarkdown: FC<Props> = ({ content, styles }) => {
  return (
    <Markdown
      styles={styles}
      value={content}
      flatListProps={{
        initialNumToRender: 8
      }}
    />
  )
}

export default RenderMarkdown
