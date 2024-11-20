import { execute } from "@/helpers/execute";
import { queryOptions } from "@tanstack/react-query";
import { ProfileDocument } from "@tape.xyz/indexer";

export const profileByIdQuery = (forProfileId: string | null) => {
  return queryOptions({
    queryKey: ["account", forProfileId],
    queryFn: () =>
      execute(ProfileDocument, {
        request: { forProfileId }
      }),
    enabled: Boolean(forProfileId)
  });
};
