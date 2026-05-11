const path = require('path');
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const tailwindPlugin = require('eslint-plugin-tailwindcss');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const noOnlyTestsPlugin = require('eslint-plugin-no-only-tests');

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'coverage/**',
      'pnpm-lock.yaml',
      '.pnpm-store/**',
      '*.log',
      '.vscode/**',
      'test/test-result/**',
      'coverage-summary/**',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  ...nextCoreWebVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      tailwindcss: tailwindPlugin,
    },
    rules: tailwindPlugin.configs.recommended.rules,
  },
  prettierRecommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'no-only-tests': noOnlyTestsPlugin,
    },
    settings: {
      react: { version: 'detect' },
      tailwindcss: {
        callees: ['classnames', 'clsx', 'clsxm'],
        config: path.join(__dirname, 'tailwind.config.ts'),
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: { project: './' },
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-debugger': 'error',
      'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
      quotes: [
        'warn',
        'single',
        { allowTemplateLiterals: true, avoidEscape: true },
      ],
      'no-return-await': 'error',
      'require-await': 'error',
      'no-only-tests/no-only-tests': 'error',
      'import/newline-after-import': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],
      'import/no-cycle': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-i18next',
              message: 'Import from "next-i18next".',
            },
            {
              name: 'axiosNest',
              message: 'Import from "@/api/axiosNest".',
            },
            {
              name: 'axiosSSRNest',
              message: 'Import from "@/api/axiosSSRNest".',
            },
            {
              name: 'react-hot-toast',
              message: 'Use "@/shared/utils/useToast" instead.',
            },
            {
              name: 'clsx',
              message: 'Use "@/shared/utils/clsxm" instead.',
            },
            {
              name: 'tailwind-merge',
              message: 'Use "@/shared/utils/clsxm" instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
];
