import usePersistStore from '@lib/store/persist'
import { Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  TAPE_GITHUB_HANDLE,
  TAPE_ROADMAP_URL,
  TAPE_STATUS_PAGE,
  TAPE_X_HANDLE
} from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  const setSidebarCollapsed = usePersistStore(
    (state) => state.setSidebarCollapsed
  )

  return (
    <div className="grid grid-cols-2 text-sm">
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={TAPE_ROADMAP_URL}
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
        href={TAPE_STATUS_PAGE}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)
        }}
        target="_blank"
      >
        <Trans>Status</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={`https://github.com/${TAPE_GITHUB_HANDLE}`}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.GITHUB)
        }}
        target="_blank"
      >
        GitHub
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={`https://x.com/${TAPE_X_HANDLE}`}
        onClick={() => {
          setSidebarCollapsed(true)
          Analytics.track(TRACK.SYSTEM.MORE_MENU.X)
        }}
        target="_blank"
      >
        x.com
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
        <Trans>Thanks</Trans>
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
