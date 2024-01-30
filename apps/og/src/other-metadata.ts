import { OG_IMAGE, TAPE_APP_NAME, TAPE_WEBSITE_URL } from '@tape.xyz/constants'
import { getProfile, getPublicationData } from '@tape.xyz/generic'
import isOpenActionAllowed from '@tape.xyz/generic/functions/isOpenActionAllowed'
import type { PrimaryPublication } from '@tape.xyz/lens'

export const getCollectModuleMetadata = (publication: PrimaryPublication) => {
  const { openActionModules } = publication

  if (!openActionModules) {
    return
  }

  const openAction = openActionModules.filter((module) =>
    isOpenActionAllowed([module])
  )

  const collectModule = openAction.length ? openAction[0] : null

  if (!collectModule) {
    return
  }

  const pageUrl = `${TAPE_WEBSITE_URL}/watch/${publication.id}`
  const publicationTitle = getPublicationData(publication.metadata)?.title || ''
  const title = `${publicationTitle} by ${
    getProfile(publication.by).slugWithPrefix
  } • ${TAPE_APP_NAME}`
  const publicationCover =
    getPublicationData(publication.metadata)?.asset?.cover || OG_IMAGE

  return {
    'eth:nft:chain': 'polygon',
    'eth:nft:collection': title,
    'eth:nft:contract_address': collectModule.contract.address,
    'eth:nft:creator_address': publication.by.ownedBy.address,
    'eth:nft:media_url': publicationCover,
    'eth:nft:mint_count': publication.stats.countOpenActions,
    'eth:nft:mint_url': pageUrl,
    'eth:nft:schema': 'ERC721'
  }
}
