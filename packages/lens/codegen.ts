import type { CodegenConfig } from '@graphql-codegen/cli'

import LensEndpoint from './endpoints'

const config: CodegenConfig = {
  overwrite: true,
  schema: LensEndpoint.Staging,
  documents: './documents/**/*.graphql',
  customFetch: 'node-fetch',
  generates: {
    'generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        'fragment-matcher'
      ]
    }
  },
  hooks: {
    afterAllFileWrite: ['eslint --fix', 'prettier --write']
  }
}

export default config
