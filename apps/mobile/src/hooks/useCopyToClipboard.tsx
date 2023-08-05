import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'

const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState('')

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text)
  }

  const fetchCopiedText = async () => {
    const text = await Clipboard.getStringAsync()
    setCopiedText(text)
  }

  return {
    copiedText,
    copyToClipboard,
    fetchCopiedText
  }
}

export default useCopyToClipboard
