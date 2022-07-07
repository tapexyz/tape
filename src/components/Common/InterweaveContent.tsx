import { Interweave } from 'interweave'
import { UrlMatcher } from 'interweave-autolink'
import React from 'react'

import { HashtagMatcher } from './matchers/HashtagMatcher'
import { MentionMatcher } from './matchers/MentionMatcher'
import { TimeMatcher } from './matchers/TimeMatcher'

const InterweaveContent = ({ content }: { content: string }) => {
  return (
    <span className="interweave-content">
      <Interweave
        content={content}
        newWindow
        matchers={[
          new TimeMatcher('time'),
          new HashtagMatcher('hashtag'),
          new MentionMatcher('mention'),
          new UrlMatcher('url', { validateTLD: false })
        ]}
      />
    </span>
  )
}

export default InterweaveContent
