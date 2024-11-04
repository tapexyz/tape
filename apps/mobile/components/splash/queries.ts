import { execute } from "@/helpers/execute";
import { queryOptions } from "@tanstack/react-query";
import { ProfileDocument } from "@tape.xyz/lens/gql";

export const profileByIdQuery = (forProfileId: string | null) => {
  return queryOptions({
    queryKey: ["profile", forProfileId],
    queryFn: () =>
      execute(ProfileDocument, {
        request: { forProfileId }
      }),
    enabled: Boolean(forProfileId),
    gcTime: 0
  });
};
