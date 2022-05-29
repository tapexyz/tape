import "../styles/index.css";
import "@rainbow-me/rainbowkit/styles.css";
import "plyr-react/dist/plyr.css";

import { ApolloProvider } from "@apollo/client";
import EthersProvider from "@components/wrappers/EthersProvider";
import client from "@lib/apollo";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider defaultTheme="light" attribute="class">
        <EthersProvider>
          <Component {...pageProps} />
        </EthersProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
