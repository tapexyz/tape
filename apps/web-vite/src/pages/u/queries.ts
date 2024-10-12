import { queryOptions } from "@tanstack/react-query";
import { ProfileDocument, execute } from "@tape.xyz/lens/gql";

export const profileQuery = (handle: string) =>
  queryOptions({
    queryKey: ["profile", handle],
    queryFn: () =>
      execute(ProfileDocument, {
        request: {
          forHandle: handle
        }
      })
  });
