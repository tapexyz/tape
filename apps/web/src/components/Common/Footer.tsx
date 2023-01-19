import usePersistStore from '@lib/store/persist'
import Link from 'next/link'
import React from 'react'
import {
  Analytics,
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_ROADMAP_URL,
  LENSTUBE_STATUS_PAGE,
  LENSTUBE_TWITTER_HANDLE,
  TRACK
} from 'utils'

const Footer = () => {
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  return (
    <div className="grid grid-cols-2 text-sm">
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={LENSTUBE_STATUS_PAGE}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)
        }}
        target="_blank"
      >
        Status
      </Link>
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
        href="/discord"
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.DISCORD)
        }}
        target="_blank"
      >
        Discord
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href="/thanks"
        target="_blank"
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.THANKS)
        }}
      >
        Thanks
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={LENSTUBE_ROADMAP_URL}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)
        }}
        target="_blank"
      >
        Feedback
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
        Terms
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
        Privacy
      </Link>
    </div>
  )
}

export default Footer
