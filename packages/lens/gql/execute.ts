import { LENS_API_URL, TAPE_USER_AGENT } from "@tape.xyz/constants";

import type { TypedDocumentString } from "./generated/graphql";

export const execute = async <TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) => {
  try {
    const response = await fetch(LENS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": TAPE_USER_AGENT,
        Accept: "application/graphql-response+json",
        "x-access-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4MmQiLCJldm1BZGRyZXNzIjoiMHgwMWQ3OUJjRWFFYWFEZmI4ZkQyRjJmNTMwMDUyODlDRmNGNDgzNDY0Iiwicm9sZSI6InByb2ZpbGUiLCJhdXRob3JpemF0aW9uSWQiOiJjYmRiZmNjOC05ZDg3LTRiMTYtODZjNS05MTQ2ZjVkNGNkYWMiLCJpYXQiOjE3Mjc0MTk0NDcsImV4cCI6MTcyNzQyMTI0N30.Tn0sdwpG4OsTSwR3Se_bFOfMWDF_FmmCWyCR3AJ9CqI"
      },
      body: JSON.stringify({
        query: query,
        variables
      })
    });

    if (!response.ok) {
      throw new Error("[GQL] Fetch failed", { cause: response });
    }
    const result = await response.json();

    return result.data as TResult;
  } catch (error) {
    throw new Error("[GQL] Execute failed", { cause: error });
  }
};
