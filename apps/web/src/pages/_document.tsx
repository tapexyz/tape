import { STATIC_ASSETS, TAPE_APP_NAME } from '@tape.xyz/constants'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

class AppDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <link
            href={`${STATIC_ASSETS}/brand/logo.svg`}
            rel="icon"
            type="image/svg+xml"
          />
          <link
            href={`${STATIC_ASSETS}/brand/favicons/favicon.ico`}
            rel="icon"
            type="image/x-icon"
          />
          <link
            href={`${STATIC_ASSETS}/brand/favicons/favicon.ico`}
            rel="shortcut icon"
          />
          <link
            href={`${STATIC_ASSETS}/brand/favicons/apple-touch-icon.png`}
            rel="apple-touch-icon"
            sizes="180x180"
          />
          <link
            href={`${STATIC_ASSETS}/brand/favicons/favicon-32x32.png`}
            rel="icon"
            sizes="32x32"
            type="image/png"
          />
          <link
            href={`${STATIC_ASSETS}/brand/favicons/favicon-16x16.png`}
            rel="icon"
            sizes="16x16"
            type="image/png"
          />
          <meta content="#000000" name="theme-color" />
          <link href="/manifest.json" rel="manifest" />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta
            content="default"
            name="apple-mobile-web-app-status-bar-style"
          />
          <meta content={TAPE_APP_NAME} name="apple-mobile-web-app-title" />
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
