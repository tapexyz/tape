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

  const { slugWithPrefix } = getProfile(publication.by)
  const publicationCover =
    getPublicationData(publication.metadata)?.asset?.cover || OG_IMAGE
  const pageUrl = `${TAPE_WEBSITE_URL}/watch/${publication.id}`

  return {
    'eth:nft:chain': 'polygon',
    'eth:nft:collection': `${publication.__typename} by ${slugWithPrefix} • ${TAPE_APP_NAME}`,
    'eth:nft:contract_address': collectModule.contract.address,
    'eth:nft:creator_address': publication.by.ownedBy.address,
    'eth:nft:media_url': publicationCover,
    'eth:nft:mint_count': publication.stats.countOpenActions,
    'eth:nft:mint_url': pageUrl,
    'eth:nft:schema': 'ERC721'
  }
}
