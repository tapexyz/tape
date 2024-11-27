import { hydrateAuthTokens } from "@/store/cookie";
import {
  TAPE_USER_AGENT,
  TAPE_WEBSITE_URL,
  TESTNET_API_URL
} from "@tape.xyz/constants";
import type { TypedDocumentString } from "@tape.xyz/indexer";

export const execute = async <TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) => {
  const { accessToken } = hydrateAuthTokens();
  try {
    const response = await fetch(TESTNET_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": TAPE_USER_AGENT,
        Accept: "application/graphql-response+json",
        origin: TAPE_WEBSITE_URL,
        ...(accessToken && {
          "x-access-token": `Bearer ${accessToken}`
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
