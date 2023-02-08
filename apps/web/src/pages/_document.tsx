import Document, { Head, Html, Main, NextScript } from 'next/document'
import Script from 'next/script'
import React from 'react'
import { IS_MAINNET, STATIC_ASSETS } from 'utils'

class LenstubeDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link
            rel="shortcut icon"
            href={`${STATIC_ASSETS}/images/favicons/favicon.ico`}
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${STATIC_ASSETS}/images/favicons/apple-touch-icon.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${STATIC_ASSETS}/images/favicons/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${STATIC_ASSETS}/images/favicons/favicon-16x16.png`}
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#000000" />

          {IS_MAINNET && (
            <Script
              strategy="lazyOnload"
              id="tinybird"
              defer
              src="https://unpkg.com/@tinybirdco/flock.js"
              data-host="https://api.tinybird.co"
              data-token="p.eyJ1IjogImI1YzEwMWY0LTY0MmMtNDJhNy1hZmMxLWIwMjNkZjU2ZWY5YiIsICJpZCI6ICIzY2RmMjVmNi1lMmQ4LTQ3MGItYmFlMy02MDBlMDU4MDQyN2EifQ.67XL26aJbQyvWHEFpyzg38DA3OHRpdIVsQ4FdyD2G5A"
            />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default LenstubeDocument
