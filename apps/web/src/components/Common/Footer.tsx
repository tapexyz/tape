import usePersistStore from '@lib/store/persist'
import { Trans } from '@lingui/react'
import Link from 'next/link'
import React from 'react'
import {
  Analytics,
  LENSTUBE_DISCORD_INVITE_URL,
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_ROADMAP_URL,
  LENSTUBE_TWITTER_HANDLE,
  TRACK
} from 'utils'

const Footer: React.FC = () => {
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  return (
    <div className="grid grid-cols-2 text-sm">
      {/* <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={LENSTUBE_STATUS_PAGE}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)
        }}
        target="_blank"
      >
        <Trans>Status</Trans>
      </Link> */}
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={`https://github.com/${LENSTUBE_GITHUB_HANDLE}`}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.GITHUB)
        }}
        target="_blank"
      >
        Github
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={`https://twitter.com/${LENSTUBE_TWITTER_HANDLE}`}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.TWITTER)
        }}
        target="_blank"
      >
        Twitter
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={`${LENSTUBE_DISCORD_INVITE_URL}`}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.DISCORD)
        }}
        target="_blank"
      >
        Discord
      </Link>
      {/* <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href="/thanks"
        target="_blank"
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.THANKS)
        }}
      >
        <Trans>Thanks</Trans>
      </Link> */}
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={LENSTUBE_ROADMAP_URL}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)
        }}
        target="_blank"
      >
        <Trans>Feedback</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        target="_blank"
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.TERMS)
        }}
        href="/terms"
      >
        <Trans>Terms</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        target="_blank"
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.PRIVACY)
        }}
        href="/privacy"
      >
        <Trans>Privacy</Trans>
      </Link>
    </div>
  )
}

export default Footer
