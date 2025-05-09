import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import vueParser from 'vue-eslint-parser';

const commonRules = {
  'unicorn/better-regex': 'warn',
  'no-console': 'off',
  'no-debugger': 'warn',
  semi: [2, 'always'],
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
  quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
  'import/extensions': 'off',
  'prettier/prettier': 'error',
  'padding-line-between-statements': [
    'error',
    {
      blankLine: 'always',
      prev: '*',
      next: ['if', 'for', 'while', 'switch'],
    },
    { blankLine: 'always', prev: '*', next: 'return' },
    { blankLine: 'always', prev: ['const', 'let'], next: '*' },
    { blankLine: 'always', prev: '*', next: ['const', 'let'] },
    {
      blankLine: 'any',
      prev: ['const', 'let'],
      next: ['export', 'const', 'let'],
    },
  ],
  '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'never' }],
  '@typescript-eslint/consistent-type-definitions': 'off',
  '@typescript-eslint/array-type': 'off',
  'unicorn/prefer-event-target': 'off',
  '@typescript-eslint/consistent-type-imports': 'warn',
  '@typescript-eslint/explicit-function-return-type': 'warn',
  '@typescript-eslint/no-unsafe-argument': 'warn',
  '@typescript-eslint/explicit-member-accessibility': [
    'warn',
    { accessibility: 'explicit', overrides: { constructors: 'off' } },
  ],
  '@typescript-eslint/member-ordering': 'error',
  'class-methods-use-this': 'error',

  '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
  'unicorn/no-array-callback-reference': 'off',
  'unicorn/no-array-for-each': 'off',
  'unicorn/no-array-reduce': 'off',
  'unicorn/no-null': 'off',
  'unicorn/number-literal-case': 'off',
  'unicorn/numeric-separators-style': 'off',
  'unicorn/prevent-abbreviations': [
    'error',
    {
      allowList: {
        acc: true,
        env: true,
        i: true,
        j: true,
        props: true,
        Props: true,
      },
    },
  ],
};

export default tseslint.config(
  {
    ignores: [
      'eslint.config.mjs',
      'commitlint.config.cjs',
      './src/vue.d.ts',
      './src/vite-env.d.ts',
      'vite.config.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  eslintPluginUnicorn.configs.recommended,
  eslintPluginPrettierRecommended,

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.eslint.json',
        extraFileExtensions: ['.vue'],
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },

  {
    rules: {
      ...commonRules,
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['**/*.{js,jsx}'],
    rules: commonRules,
  },
);
