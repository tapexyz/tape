import { STATIC_ASSETS } from '@tape.xyz/constants'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class AppDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link
            rel="icon"
            href={`${STATIC_ASSETS}/brand/logo.svg`}
            type="image/svg+xml"
          />
          <link
            rel="icon"
            href={`${STATIC_ASSETS}/brand/favicons/favicon.ico`}
            type="image/x-icon"
          />
          <link
            rel="shortcut icon"
            href={`${STATIC_ASSETS}/brand/favicons/favicon.ico`}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${STATIC_ASSETS}/brand/favicons/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${STATIC_ASSETS}/brand/favicons/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${STATIC_ASSETS}/brand/favicons/favicon-16x16.png`}
          />
          <meta name="theme-color" content="#000000" />
          <link
            rel="manifest"
            href={`${STATIC_ASSETS}/brand/favicons/manifest.json`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
