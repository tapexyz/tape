import { getCssText } from '@livepeer/react'
import {
  Head,
  Html,
  Main,
  default as NextDocument,
  NextScript
} from 'next/document'
import * as React from 'react'

class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <style
            dangerouslySetInnerHTML={{ __html: getCssText() }}
            id="stitches"
          />
          <meta content="noindex" name="robots" />
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
