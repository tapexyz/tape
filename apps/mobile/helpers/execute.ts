import { hydrateSession } from "@/store/auth";
import { LENS_API_URL, TAPE_USER_AGENT } from "@tape.xyz/constants";
import type { TypedDocumentString } from "@tape.xyz/lens/gql";

export const execute = async <TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) => {
  const session = hydrateSession();

  try {
    const response = await fetch(LENS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": TAPE_USER_AGENT,
        Accept: "application/graphql-response+json",
        ...(session.accessToken && {
          "x-access-token": `Bearer ${session.accessToken}`
        })
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
