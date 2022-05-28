import { ApolloClient, from, HttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { API_URL } from "@utils/constants";
import { REFRESH_AUTHENTICATION_MUTATION } from "@utils/gql/queries";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import axios from "axios";
import jwtDecode from "jwt-decode";
import result, { AuthenticationResult } from "src/types";

const httpLink = new HttpLink({
  uri: API_URL,
  fetch,
});

const authLink = setContext((_, { headers }) => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    headers: {
      ...headers,
      "x-access-token": accessToken ? `Bearer ${accessToken}` : "",
    },
  };
});

const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const accessTokenDecrypted: any = jwtDecode(accessToken);
      if (Date.now() >= accessTokenDecrypted.exp * 1000) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  fetchAccessToken: () => {
    return axios.post(API_URL, {
      operationName: "Refresh",
      query: REFRESH_AUTHENTICATION_MUTATION,
      variables: {
        request: { refreshToken: localStorage.getItem("refreshToken") },
      },
    });
  },
  handleFetch: (response: any) => {
    const { refresh }: { refresh: AuthenticationResult } = response?.data?.data;
    const accessToken = refresh?.accessToken;
    const refreshToken = refresh?.refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  handleResponse: () => (response: any) => {
    const { refresh }: { refresh: AuthenticationResult } = response?.data?.data;
    const accessToken = refresh?.accessToken;
    const refreshToken = refresh?.refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  },
  handleError: (err: Error) => {
    console.log("🚀 ~ file: apollo.ts ~ err", err);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
});

const client = new ApolloClient({
  link: from([authLink, refreshLink, httpLink]),
  cache: new InMemoryCache({ possibleTypes: result.possibleTypes }),
});

export default client;
