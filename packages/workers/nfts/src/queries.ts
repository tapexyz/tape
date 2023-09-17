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
