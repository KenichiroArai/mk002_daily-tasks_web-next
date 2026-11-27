import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// 依存の向きは app -> dailyTasks -> shared の一方向だけを許可する
const noAppImport = {
  group: ['@/app', '@/app/*'],
  message: 'app/ はルーティング専用です。app/ 以外から import しないでください。',
};
const noDailyTasksImport = {
  group: ['@/dailyTasks', '@/dailyTasks/*'],
  message: 'shared/・config/ から dailyTasks/ に依存しないでください。',
};
const noDailyTasksInternalImport = {
  group: ['@/dailyTasks/*/*'],
  message:
    '機能の内部を直接 import せず、dailyTasks/<機能名>/index.ts を経由してください（同じ機能の中では相対パスを使います）。',
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // 戻り値 result は先頭で let 宣言してから代入する（コーディングルール）。prefer-const と衝突するため無効化する
    rules: {
      'prefer-const': 'off',
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [noDailyTasksInternalImport] }],
    },
  },
  {
    files: ['src/dailyTasks/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [noAppImport, noDailyTasksInternalImport] }],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}', 'src/config/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [noAppImport, noDailyTasksImport] }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'public/data/**', 'coverage/**', 'next-env.d.ts']),
]);