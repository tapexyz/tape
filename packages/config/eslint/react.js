/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    require.resolve('./base.js'),
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': [
      2,
      {
        "ignore": [
          "jsx",
          "global",
        ]
      }
    ],
    'react/jsx-no-useless-fragment': 'error',
    'react/self-closing-comp': 'error'
  },
  settings: { react: { version: 'detect' } }
}
