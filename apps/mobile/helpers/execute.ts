import { rqClient } from "@/components/providers/react-query";
import { hydrateSession, signIn } from "@/store/auth";
import { queryOptions } from "@tanstack/react-query";
import { LENS_API_URL, TAPE_USER_AGENT } from "@tape.xyz/constants";
import { parseJwt } from "@tape.xyz/generic";
import { RefreshDocument, type TypedDocumentString } from "@tape.xyz/lens/gql";

export const execute = async <TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) => {
  const session = hydrateSession();
  let willExpireSoon = false;

  if (session.accessToken) {
    willExpireSoon = Date.now() >= parseJwt(session.accessToken)?.exp * 1000;
  }

  try {
    if (willExpireSoon) {
      const { refresh } = await rqClient.fetchQuery(
        queryOptions({
          queryKey: ["tokens"],
          queryFn: () =>
            execute(RefreshDocument, {
              request: { refreshToken: session.refreshToken }
            }),
          gcTime: 0,
          staleTime: 0
        })
      );
      signIn({
        accessToken: refresh.accessToken,
        refreshToken: refresh.refreshToken,
        id: session.id
      });
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
