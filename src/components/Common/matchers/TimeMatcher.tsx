import { getSecondsFromTime } from '@utils/functions/getSecondsFromTime'
import { Matcher } from 'interweave'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const ChapterLink = ({ ...props }: any) => {
  const { query } = useRouter()
  return (
    <Link href={`/watch/${query.id}?t=${getSecondsFromTime(props.display)}`}>
      {props.display}
    </Link>
  )
}

export class TimeMatcher extends Matcher {
  replaceWith(match: string, props: any) {
    return React.createElement(ChapterLink, props, match)
  }

  asTag(): string {
    return 'a'
  }

  match(value: string) {
    return this.doMatch(
      value,
      /^(0?[0-9]|1[0-9]):[0-5][0-9]|:[0-5][0-9]$/,
      (matches) => {
        return {
          display: matches[0]
        }
      }
    )
  }
}
