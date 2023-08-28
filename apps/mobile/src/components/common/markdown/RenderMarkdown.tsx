import type { RenderRules } from '@ronradtke/react-native-markdown-display'
import MarkdownDisplay, {
  MarkdownIt
} from '@ronradtke/react-native-markdown-display'
import markdownItRegex from 'markdown-it-regex'
import React, { useMemo } from 'react'
import { Linking, Pressable, Text, type TextStyle } from 'react-native'

import { theme } from '~/helpers/theme'

import HashtagLink from './HashtagLink'
import MentionLink from './MentionLink'

export type MarkupTextProps = {
  content: string
  textStyle?: TextStyle
}

const rules: RenderRules = {
  paragraph: (node, children, _parent, styles) => {
    return (
      <Text key={node.key} style={styles._VIEW_SAFE_paragraph}>
        {children}
      </Text>
    )
  },
  link: ({ attributes }, children) => {
    return (
      <Pressable
        onPress={() => Linking.openURL(attributes.href)}
        style={{ justifyContent: 'center' }}
      >
        <Text style={{ textDecorationColor: theme.colors.indigo }}>
          {children}
        </Text>
      </Pressable>
    )
  },
  mention: ({ key, content }) => {
    return <MentionLink key={key} handle={content} />
  },
  hashtag: ({ key, content }) => {
    return <HashtagLink key={key} hashtag={content} />
  }
}

const RenderMarkdown = ({ content, textStyle }: MarkupTextProps) => {
  const renderedStyle = useMemo(() => {
    const style: Record<string, TextStyle> = {
      text: { ...textStyle },
      heading1: {
        fontFamily: 'font-bold'
      },
      heading2: {
        fontFamily: 'font-bold'
      },
      strong: {
        fontFamily: 'font-bold'
      },
      heading3: {
        fontFamily: 'font-bold'
      },
      heading4: {
        fontFamily: 'font-bold'
      },
      heading5: {
        fontFamily: 'font-bold'
      },
      heading6: {
        fontFamily: 'font-bold'
      }
    }

    return style
  }, [textStyle])

  return (
    <MarkdownDisplay
      rules={rules}
      style={renderedStyle}
      markdownit={MarkdownIt({
        typographer: true,
        linkify: true,
        html: false
      })
        .use(markdownItRegex, {
          name: 'mention',
          regex: /(@[a-z\d-_.]{1,31})/
        })
        .use(markdownItRegex, {
          name: 'hashtag',
          regex: /(#\w*[A-Za-z]\w*)/g
        })}
    >
      {content}
    </MarkdownDisplay>
  )
}

export default RenderMarkdown
