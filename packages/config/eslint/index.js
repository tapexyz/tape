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
    'prettier',
    'unicorn',
    'perfectionist'
  ],
  extends: ['next', 'next/core-web-vitals', 'plugin:perfectionist/recommended-alphabetical'],
  rules: {
    curly: 'error',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'import/no-duplicates': ['error', { considerQueryString: true }],
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react/jsx-no-useless-fragment': 2,
    'no-use-before-define': ['error'],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'prefer-destructuring': ['error', { VariableDeclarator: { object: true } }],
    '@next/next/no-html-link-for-pages': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@next/next/no-img-element': 'off',
    'jsx-a11y/role-supports-aria-props': 'off',
    'unicorn/no-lonely-if': 'error',
    'unicorn/no-useless-undefined': 'error'
  }
}
