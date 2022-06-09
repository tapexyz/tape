import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

function ChannelLink({ ...props }: any) {
  return (
    <Link href={`/${props.display.slice(1)}`} prefetch={false}>
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
    return this.doMatch(value, /@[a-zA-Z0-9_.]+/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
