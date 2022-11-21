import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'
import { getHandle } from 'utils/functions/getHandle'

const ChannelLink = ({ ...props }: any) => {
  return (
    <Link href={`/channel/${getHandle(props.display?.slice(1))}`}>
      {props.display}
    </Link>
  )
}

export class MentionMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(ChannelLink, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /@[a-zA-Z0-9_.]+(\.lens|\.test)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
