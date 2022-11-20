import { useState } from 'react'

import logger from '../logger'

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean> // Return success

function useCopyToClipboard(): [CopyFn, CopiedValue] {
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
    } catch {
      setCopiedText(null)
      return false
    }
  }

  return [copy, copiedText]
}

export default useCopyToClipboard
