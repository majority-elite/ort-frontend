/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  ignorePatterns: ['!**/.server', '!**/.client', '!.storybook'],

  plugins: ['prettier'],
  // Base config
  extends: ['eslint:recommended', 'plugin:storybook/recommended'],

  overrides: [
    // React
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      plugins: ['react', 'jsx-a11y'],
      extends: [
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      settings: {
        react: {
          version: 'detect',
        },
        formComponents: ['Form'],
        linkComponents: [
          { name: 'Link', linkAttribute: 'to' },
          { name: 'NavLink', linkAttribute: 'to' },
        ],
        'import/resolver': {
          typescript: {},
        },
      },
      rules: {
        'react-hooks/exhaustive-deps': 'error',
        'react/function-component-definition': [
          'warn',
          {
            namedComponents: 'arrow-function',
            unnamedComponents: 'arrow-function',
          },
        ],
      },
    },

    // Typescript
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint', 'import'],
      parser: '@typescript-eslint/parser',
      settings: {
        'import/internal-regex': '^~/',
        'import/resolver': {
          node: {
            extensions: ['.ts', '.tsx'],
          },
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
      ],
      rules: {
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
          },
          {
            selector: [
              'class',
              'enum',
              'interface',
              'typeAlias',
              'typeParameter',
            ],
            format: ['PascalCase'],
          },
          {
            selector: 'typeParameter',
            format: ['PascalCase'],
            prefix: ['_'],
            filter: '^_',
          },
          {
            selector: ['enumMember'],
            format: ['UPPER_CASE'],
          },
          {
            selector: ['objectLiteralProperty'],
            format: null,
          },
          {
            selector: 'variable',
            format: ['camelCase'],
            prefix: ['api_', 'unstable_'],
            filter: '(^api_|^unstable_)',
          },
        ],
      },
    },

    // Node
    {
      files: ['.eslintrc.cjs'],
      env: {
        node: true,
      },
    },

    {
      files: ['./server/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                // https://github.com/vitejs/vite/issues/10063
                group: ['@/*', '@server/*', 'app/*', 'server/*'],
                message: 'server 디렉토리 안에서는 상대 경로를 사용해 주세요.',
              },
            ],
          },
        ],
      },
    },
  ],

  rules: {
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'arrow-body-style': ['warn', 'as-needed'],
    'prettier/prettier': 'warn',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['..*'],
            message: '다른 경로에 있는 모듈은 절대 경로로 불러와 주세요.',
          },
          {
            group: ['app/*', 'server/*'],
            message: '`@/`, `@server` 등 올바른 절대 경로를 사용해 주세요.',
          },
          {
            group: ['@remix-run/react'],
            importNames: ['useFetcher'],
            message: '`@/hooks/useTypedFetcher`를 사용해 주세요.',
          },
        ],
      },
    ],
  },
};
