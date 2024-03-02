import {
  DRAGVERSE_APPLE_TOUCH_ICON,
  DRAGVERSE_FAVICON,
  DRAGVERSE_FAVICON_16,
  DRAGVERSE_FAVICON_32,
  DRAGVERSE_LOGO,
  TAPE_APP_NAME
} from '@dragverse/constants'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class AppDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href={`${DRAGVERSE_LOGO}`} type="image/svg+xml" />
          <link rel="icon" href={`${DRAGVERSE_FAVICON}`} type="image/x-icon" />
          <link rel="shortcut icon" href={`${DRAGVERSE_FAVICON}`} />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${DRAGVERSE_APPLE_TOUCH_ICON}`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${DRAGVERSE_FAVICON_32}`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${DRAGVERSE_FAVICON_16}`}
          />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={TAPE_APP_NAME} />
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
