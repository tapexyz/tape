import { execute } from "@/helpers/execute";
import { queryOptions } from "@tanstack/react-query";
import { ProfileDocument, RefreshDocument } from "@tape.xyz/lens/gql";

export const profileByIdQuery = (forProfileId: string | null) => {
  return queryOptions({
    queryKey: ["profile", forProfileId],
    queryFn: () =>
      execute(ProfileDocument, {
        request: { forProfileId }
      })
  });
};

export const tokensQuery = (refreshToken: string | null) => {
  return queryOptions({
    queryKey: ["tokens"],
    queryFn: () =>
      execute(RefreshDocument, {
        request: { refreshToken }
      }),
    gcTime: 0,
    staleTime: 0
  });
};
