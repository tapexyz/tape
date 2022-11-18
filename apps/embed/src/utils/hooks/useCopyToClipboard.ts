/* eslint-disable no-unused-vars */
import logger from '@lib/logger'
import { useState } from 'react'

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean> // Return success

const useCopyToClipboard = (): [CopyFn, CopiedValue] => {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null)

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      logger.warn('[Copy to Clipboard Not Supported]')
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch (error) {
      setCopiedText(null)
      logger.error('[Error Copy to Clipboard]', error)
      return false
    }
  }

  return [copy, copiedText]
}

export default useCopyToClipboard
