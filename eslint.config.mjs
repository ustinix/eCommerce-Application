import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import vueParser from 'vue-eslint-parser';
import vue from 'eslint-plugin-vue';
import vuetify from 'eslint-plugin-vuetify';

const commonRules = {
  'unicorn/better-regex': 'warn',
  'no-console': 'off',
  'no-debugger': 'warn',
  semi: [2, 'always'],
  'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
  quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
  'import/extensions': 'off',
  'prettier/prettier': 'error',
  'padding-line-between-statements': 'off',
  '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'never' }],
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
  'unicorn/prefer-structured-clone': 'off',
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
      '**/dist/**',
      '**/node_modules/**',
      'coverage/',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...vue.configs['flat/base'],
  ...vuetify.configs['flat/base'],
  eslintPluginUnicorn.configs.recommended,
  eslintPluginPrettierRecommended,

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
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
      'vuetify/no-deprecated-classes': 'warn',
      'vue/no-undef-properties': 'off',
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
    rules: commonRules,
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    rules: commonRules,
  },
);
