import { IS_MAINNET, STATIC_ASSETS } from '@utils/constants'
import Document, {
  DocumentContext,
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document'

type Props = Record<string, unknown> & DocumentProps
class LenstubeDocument extends Document<Props> {
  static async getInitialProps(context: DocumentContext) {
    const initialProps = await Document.getInitialProps(context)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link
            href="https://assets.lenstube.xyz/css/font.css"
            rel="stylesheet"
          />
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
          <link
            rel="manifest"
            href={`${STATIC_ASSETS}/images/favicons/site.webmanifest`}
          />
          <link
            rel="mask-icon"
            href={`${STATIC_ASSETS}/images/favicons/safari-pinned-tab.svg`}
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#000000" />
          {IS_MAINNET && (
            <script
              async
              defer
              data-website-id="2ecff432-293c-4211-8639-f4a4bf65551d"
              src="https://sudo-umami.up.railway.app/umami.js"
            ></script>
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
