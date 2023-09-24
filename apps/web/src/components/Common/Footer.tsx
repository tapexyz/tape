import { Analytics, TRACK } from '@lenstube/browser'
import {
  LENSTUBE_GITHUB_HANDLE,
  LENSTUBE_ROADMAP_URL,
  LENSTUBE_STATUS_PAGE,
  LENSTUBE_X_HANDLE
} from '@lenstube/constants'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="grid grid-cols-2 text-sm">
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={LENSTUBE_ROADMAP_URL}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)
        }}
        target="_blank"
      >
        <Trans>Feedback</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={LENSTUBE_STATUS_PAGE}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)
        }}
        target="_blank"
      >
        <Trans>Status</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={`https://github.com/${LENSTUBE_GITHUB_HANDLE}`}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.GITHUB)
        }}
        target="_blank"
      >
        Github
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        href={`https://x.com/${LENSTUBE_X_HANDLE}`}
        onClick={() => {
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
          Analytics.track(TRACK.SYSTEM.MORE_MENU.THANKS)
        }}
      >
        <Trans>Thanks</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
        target="_blank"
        onClick={() => {
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
