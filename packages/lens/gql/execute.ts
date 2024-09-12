import { LENS_API_URL } from "@tape.xyz/constants";

import type { TypedDocumentString } from "./generated/graphql";

export const execute = async <TResult = any, TVariables = any>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) => {
  try {
    const response = await fetch(LENS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "tape.xyz",
        Accept: "application/graphql-response+json",
      },
      body: JSON.stringify({
        query: query,
        variables,
      }),
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
