import { Interweave } from 'interweave'
import React from 'react'

import { EmailMatcher } from './matchers/EmailMatcher'
import { HashtagMatcher } from './matchers/HashtagMatcher'
import { MentionMatcher } from './matchers/MentionMatcher'
import { TimeMatcher } from './matchers/TimeMatcher'
import { UrlMatcher } from './matchers/UrlMatcher'

const InterweaveContent = ({ content }: { content: string }) => {
  const matchers = [
    new TimeMatcher('time'),
    new HashtagMatcher('hashtag'),
    new EmailMatcher('email'),
    new MentionMatcher('mention'),
    new UrlMatcher('url')
  ]
  return (
    <span className="interweave-content">
      <Interweave
        content={content?.trim()}
        newWindow
        escapeHtml
        matchers={matchers}
      />
    </span>
  )
}

export default InterweaveContent
