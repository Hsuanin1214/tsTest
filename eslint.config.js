import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import pluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,ts,tsx,vue}'] // ✅ 加上 ts, tsx
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,

  {
    files: ['**/*.{ts,tsx,vue}'], // ✅ 1. 指定哪些檔案會被這組設定套用
    languageOptions: {
      parser: parserTs, // ✅ 2. 指定用 TypeScript 專用的解析器（parser）
      parserOptions: {
        ecmaVersion: 'latest', // ✅ 3. 支援最新 ES 語法（例如 optional chaining）
        sourceType: 'module', // ✅ 4. 支援 ES 模組（import/export）
        project: './tsconfig.json', // ✅ 5. 可選，讓 ESLint 能使用 TS 的完整型別資訊（強型別檢查）
        extraFileExtensions: ['.vue'] // ✅ 6. 告訴 parser 也要處理 .vue 檔案中的 <script lang="ts">
      }
    },
    plugins: {
      '@typescript-eslint': pluginTs, // ✅ 7. 引入 TypeScript 專用的 ESLint 插件
      prettier: pluginPrettier // ✅ 8. 引入 Prettier 插件來統一格式風格
    },
    rules: {
      // ✅ 9. 套用 TypeScript 官方推薦規則
      ...pluginTs.configs.recommended.rules,

      // ✅ 10. 加入 Prettier 格式規則：若不符合會出警告
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'avoid',
          printWidth: 120,
          semi: true,
          singleQuote: true,
          trailingComma: 'none'
        }
      ]
    }
  }
]);
