import {
  LENSTUBE_APP_DESCRIPTION,
  LENSTUBE_APP_NAME,
  LENSTUBE_EMBED_URL,
  LENSTUBE_TWITTER_HANDLE,
  LENSTUBE_WEBSITE_URL,
  STATIC_ASSETS
} from 'utils'

type Args = {
  title: string
  description: string
  image: string
  page?: 'PROFILE' | 'VIDEO'
  handle?: string
  pubId?: string
}

const getMetaTags = ({
  title,
  description,
  image,
  page,
  handle,
  pubId
}: Args) => {
  const isVideo = page === 'VIDEO'
  const meta = {
    title: `${title} ~ Lenstube` ?? LENSTUBE_APP_NAME,
    description: description || LENSTUBE_APP_DESCRIPTION,
    image: image ?? `${STATIC_ASSETS}/images/seo/og.png`,
    url: isVideo
      ? `${LENSTUBE_WEBSITE_URL}/watch/${pubId}`
      : `${LENSTUBE_WEBSITE_URL}/channel/${handle}`
  }

  let defaultMeta = `<title>${meta.title}</title>
              <meta content="${meta.description}" name="description" />
              <meta name="robots" content="follow, index" />
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
              <link rel="canonical" href="${meta.url}" />
              <meta property="og:url" content="${meta.url}" />
              <meta property="og:site_name" content="${LENSTUBE_APP_NAME}" />
              <meta property="og:description" content="${meta.description}" />
              <meta property="og:title" content="${meta.title}" />
              <meta property="og:image" content="${meta.image}" />
              <meta property="og:image:width" content="${
                isVideo ? 480 : 400
              }" />
              <meta property="og:image:height" content="${
                isVideo ? 360 : 400
              }" />
              <meta property="twitter:image:width" content="${
                isVideo ? 480 : 400
              }" />
              <meta property="twitter:image:height" content="${
                isVideo ? 360 : 400
              }" />
              <meta name="twitter:site" content="@lenstubexyz" />
              <meta name="twitter:title" content="${meta.title}" />
              <meta name="twitter:description" content="${meta.description}" />
              <meta property="twitter:image" content="${meta.image}" />
              <meta property="twitter:creator" content="${LENSTUBE_TWITTER_HANDLE}" />
              <meta name="twitter:card" content="${
                isVideo ? 'summary_large_image' : 'summary'
              }" />`

  if (isVideo) {
    const embedUrl = `${LENSTUBE_EMBED_URL}/${pubId}`
    defaultMeta += `<meta property="og:video" content="${LENSTUBE_EMBED_URL}" />
      <meta property="og:video:width" content="1280" />
      <meta property="og:video:height" content="720" />
      <meta property="og:video:url" content="${embedUrl}" />
      <meta property="og:video:type" content="text/html" />
      <meta property="og:video:secure_url" content="${meta.url}"/>
      <meta name="twitter:card" content="player" />
      <meta name="twitter:player" content="${embedUrl}" />
      <meta property="twitter:player:width" content="1280" />
      <meta property="twitter:player:height" content="720" />
      <link rel="iframely player" type="text/html" href="${embedUrl}" media="(aspect-ratio: 1280/720)" />`
  }

  return `<!DOCTYPE html>
          <html lang="en">
            <head>
              ${defaultMeta}
            </head>
            <body>
              <h1>${title}</h1>
            </body>
          </html>`
}

export default getMetaTags
