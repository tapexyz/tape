import { Matcher } from 'interweave'
import Link from 'next/link'
import React from 'react'

const Hashtag = ({ ...props }: any) => {
  return (
    <span className="inline-flex items-center space-x-1">
      <span>
        <Link href={`/explore/${props.display.slice(1)}`} prefetch={false}>
          {props.display}
        </Link>
      </span>
    </span>
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
    return this.doMatch(value, /\B#(\w+)/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
