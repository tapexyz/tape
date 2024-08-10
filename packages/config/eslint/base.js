/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    es2022: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'simple-import-sort',
    'prettier',
    'unicorn',
    'import',
    'perfectionist'
  ],
  rules: {
    curly: 'error',
    'no-unused-vars': 'off',
    'prettier/prettier': 'error',
    'unused-imports/no-unused-imports': 'error',
    'require-await': 'error',
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'prefer-destructuring': ['error', { VariableDeclarator: { object: true } }],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-use-before-define': 'error',
    'no-unexpected-multiline': 'error',
    'unicorn/catch-error-name': 'error',
    'unicorn/no-lonely-if': 'error',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unicorn/no-useless-undefined': 'error'
  },
  ignorePatterns: ['generated.ts', 'node_modules', 'dist', '.next', 'out', 'generated']
}
