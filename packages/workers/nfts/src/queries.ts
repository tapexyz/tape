export const NFTS_QUERY = `query NftsQuery($owner: Identity!, $limit: Int!, $cursor: String) {
    Ethereum: TokenBalances(
      input: {filter: {owner: {_eq: $owner}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: $limit, cursor: $cursor}
    ) {
      TokenBalance {
        tokenNfts {
            metaData {
                name
                image
                description
            }
            chainId
            address
            tokenId
            contentValue {
                video
                audio
            }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
    Polygon: TokenBalances(
      input: {filter: {owner: {_eq: $owner}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: polygon, limit: $limit, cursor: $cursor}
    ) {
      TokenBalance {
        tokenNfts {
            metaData {
                name
                image
                description
            }
            chainId
            address
            tokenId
            contentValue {
                video
                audio
            }
        }
      }
      pageInfo {
        nextCursor
        prevCursor
      }
    }
  }`

export const ZORA_NFTS_QUERY = `query NFTs($limit: Int!) {
  tokens(
    filter: {mediaType: VIDEO}
    pagination: {limit: $limit}
    sort: {sortKey: NONE, sortDirection: DESC}
  ) {
    nodes {
      token {
        name
        description
        collectionAddress
        collectionName
        tokenId
        owner
        tokenContract {
          totalSupply
          chain
          network
        }
        content {
          mediaEncoding {
            ... on VideoEncodingTypes {
              large
              poster
              thumbnail
            }
          }
          url
        }
        image {
          url
          mimeType
          mediaEncoding {
            ... on ImageEncodingTypes {
              large
              poster
              thumbnail
            }
          }
        }
        mintInfo {
          mintContext {
            blockTimestamp
          }
        }
        metadata
      }
    }
    pageInfo {
      endCursor
      hasNextPage
      limit
    }
  }
}`
