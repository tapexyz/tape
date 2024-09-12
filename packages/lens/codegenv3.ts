import type { CodegenConfig } from "@graphql-codegen/cli";
import { LensEndpoint } from "@tape.xyz/constants";

const config: CodegenConfig = {
  schema: LensEndpoint.Staging,
  documents: "documents/**/*.graphql",
  generates: {
    "gql/generated/": {
      preset: "client",
      config: {
        documentMode: "string",
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["biome format --write ."],
  },
};

export default config;
