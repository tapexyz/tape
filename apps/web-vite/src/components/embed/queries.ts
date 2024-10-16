import { queryOptions } from "@tanstack/react-query";
import { PublicationDocument, execute } from "@tape.xyz/lens/gql";

export const publicationQuery = (id: string) =>
  queryOptions({
    queryKey: ["publication", id],
    queryFn: () =>
      execute(PublicationDocument, {
        request: {
          forId: id
        }
      })
  });
