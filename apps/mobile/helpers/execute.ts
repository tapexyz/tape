import { getSession, signIn } from "@/store/auth";
import { LENS_API_URL, TAPE_USER_AGENT } from "@tape.xyz/constants";
import { parseJwt } from "@tape.xyz/generic";
import type { TypedDocumentString } from "@tape.xyz/indexer";
import { refreshAuthTokens } from "./refresh";

export const execute = async <TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) => {
  let willExpireSoon = false;
  const session = await getSession();

  if (session.accessToken) {
    willExpireSoon = Date.now() >= parseJwt(session.accessToken)?.exp * 1000;
  }

  try {
    if (willExpireSoon && session.refreshToken) {
      const refresh = await refreshAuthTokens(session.refreshToken);
      if (refresh) {
        await signIn({
          accessToken: refresh.accessToken,
          refreshToken: refresh.refreshToken,
          id: session.id
        });
      }
    }

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
