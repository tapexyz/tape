import { execute } from "@/helpers/execute";
import { queryOptions } from "@tanstack/react-query";
import { PublicationDocument } from "@tape.xyz/indexer";

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
