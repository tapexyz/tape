import { getSecondsFromTime } from '@utils/functions/formatTime'
import { Matcher } from 'interweave'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const TimeLink = ({ ...props }: any) => {
  const { query } = useRouter()
  return (
    <Link href={`/watch/${query.id}?t=${getSecondsFromTime(props.display)}`}>
      {props.display}
    </Link>
  )
}

export class TimeMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(TimeLink, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(value, /\d{2}:\d{2}:\d{2}|\d{2}:\d{2}/, (matches) => {
      return {
        display: matches[0]
      }
    })
  }
}
