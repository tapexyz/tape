import { getCssText } from '@livepeer/react'
import {
  default as NextDocument,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'
import * as React from 'react'

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
          <meta name="robots" content="noindex" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
