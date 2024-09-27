import { infiniteQueryOptions } from "@tanstack/react-query";
import {
  ALLOWED_APP_IDS,
  LENSTUBE_BYTES_APP_ID,
  TAPE_APP_ID
} from "@tape.xyz/constants";
import {
  ExplorePublicationsOrderByType,
  ModExplorePublicationType,
  ModExplorePublicationsDocument,
  PublicationMetadataMainFocusType,
  execute
} from "@tape.xyz/lens/gql";

export const modExplorePublicationsQuery = infiniteQueryOptions({
  queryKey: ["modExplorePublications"],
  queryFn: ({ pageParam }) =>
    execute(ModExplorePublicationsDocument, {
      request: {
        where: {
          publicationTypes: [ModExplorePublicationType.Post],
          metadata: {
            mainContentFocus: [
              PublicationMetadataMainFocusType.Video,
              PublicationMetadataMainFocusType.ShortVideo
            ],
            publishedOn: [
              TAPE_APP_ID,
              LENSTUBE_BYTES_APP_ID,
              ...ALLOWED_APP_IDS
            ]
          }
        },
        orderBy: ExplorePublicationsOrderByType.Latest,
        cursor: pageParam
      }
    }),
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.modExplorePublications.pageInfo.next
});
