import { signIn, signOut } from "@/store/cookie";
import {
  TAPE_USER_AGENT,
  TAPE_WEBSITE_URL,
  LENS_API_URL
} from "@tape.xyz/constants";
import { RefreshDocument, type RefreshMutation } from "@tape.xyz/indexer";

export const refreshTokens = async (refreshToken: string) => {
  if (!refreshToken) {
    return signOut();
  }

  const response = await fetch(LENS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": TAPE_USER_AGENT,
      Accept: "application/graphql-response+json",
      origin: TAPE_WEBSITE_URL
    },
    body: JSON.stringify({
      query: RefreshDocument,
      variables: {
        request: { refreshToken }
      }
    })
  });

  const result = (await response.json()) as { data: RefreshMutation };
  if (result.data?.refresh?.__typename === "AuthenticationTokens") {
    const { accessToken, refreshToken, idToken } = result.data.refresh;
    return signIn({ accessToken, refreshToken, identityToken: idToken });
  }
  return signOut();
};
