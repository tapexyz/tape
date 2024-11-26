import { execute } from "@/helpers/execute";
import { queryOptions } from "@tanstack/react-query";
import { LENS_NAMESPACE_PREFIX } from "@tape.xyz/constants";
import { ProfileDocument } from "@tape.xyz/indexer";

export const profileQuery = (handle: string) => {
  const isValidId = /^~/.test(handle);
  const request = isValidId
    ? { forProfileId: handle.replace(/^~/, "") }
    : { forHandle: `${LENS_NAMESPACE_PREFIX}${handle}` };

  return queryOptions({
    queryKey: ["profile", handle],
    queryFn: () =>
      execute(ProfileDocument, {
        request
      })
  });
};
