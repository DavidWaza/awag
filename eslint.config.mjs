import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

/**
 * Native ESLint v9 flat config.
 *
 * We intentionally do NOT go through `eslint-config-next`'s legacy
 * `next/core-web-vitals` shareable config via FlatCompat: as of
 * eslint-config-next@16 + eslint@9, that bridge throws
 * "Converting circular structure to JSON" because eslint-plugin-react's
 * flat config self-references its own plugin object, which the legacy
 * eslintrc validator can't serialize when reporting errors. Using each
 * plugin's native flat export directly avoids that path entirely.
 * `next build` type-checks and runs its own Rust-based linting regardless,
 * so this file is for editor/CI feedback, not a Next.js requirement.
 */
export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooks,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactHooks.configs['recommended-latest'].rules,
    },
  },
  {
    rules: {
      // Project conventions -------------------------------------------------
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettierConfig, // must stay last: turns off formatting rules eslint would fight prettier over
);
