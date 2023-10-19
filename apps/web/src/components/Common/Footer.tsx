import { Trans } from '@lingui/macro'
import { Analytics, TRACK } from '@tape.xyz/browser'
import {
  TAPE_FEEDBACK_URL,
  TAPE_GITHUB_HANDLE,
  TAPE_STATUS_PAGE,
  TAPE_X_HANDLE
} from '@tape.xyz/constants'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="grid grid-cols-2 text-sm">
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`https://github.com/${TAPE_GITHUB_HANDLE}/brand-kit`}
        target="_blank"
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.BRAND_KIT)
        }}
      >
        <Trans>Brand Kit</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`https://github.com/${TAPE_GITHUB_HANDLE}`}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.GITHUB)
        }}
        target="_blank"
      >
        Source Code
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`${TAPE_FEEDBACK_URL}/feature-requests`}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.FEEDBACK)
        }}
        target="_blank"
      >
        <Trans>Feedback</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={TAPE_FEEDBACK_URL}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.ROADMAP)
        }}
        target="_blank"
      >
        <Trans>Roadmap</Trans>
      </Link>

      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={`https://x.com/${TAPE_X_HANDLE}`}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.X)
        }}
        target="_blank"
      >
        X (Twitter)
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href="/discord"
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.DISCORD)
        }}
        target="_blank"
      >
        Discord
      </Link>

      <Link
        className="rounded-lg px-2.5 py-1.5"
        href="/thanks"
        target="_blank"
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.THANKS)
        }}
      >
        <Trans>Thanks</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
        href={TAPE_STATUS_PAGE}
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)
        }}
        target="_blank"
      >
        <Trans>System Status</Trans>
      </Link>

      <Link
        className="rounded-lg px-2.5 py-1.5"
        target="_blank"
        onClick={() => {
          Analytics.track(TRACK.SYSTEM.MORE_MENU.TERMS)
        }}
        href="/terms"
      >
        <Trans>Terms</Trans>
      </Link>
      <Link
        className="rounded-lg px-2.5 py-1.5"
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
