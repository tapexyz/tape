import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

const Hashtag = ({ ...props }: any) => {
  return (
    <Link href={`/explore/hashtag/${props.display?.slice(1)}`}>
      {props.display}
    </Link>
  )
}

export class HashtagMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(Hashtag, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /\B#[\w&-]+/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
