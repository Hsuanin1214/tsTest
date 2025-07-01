import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

// const base =
// 	process.env.NODE_ENV === 'production' ||
// 	process.env.NODE_ENV === 'production-test'
// 		? '/eiameeting/'
// 		: '/';

const base = './';
// const base = '/eiameeting/';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // prettierRecommended, // 不確定是否需要
  // rules: {
  //   'prettier/prettier': [
  //     'warn',
  //     {
  //       arrowParens: 'avoid',
  //       printWidth: 120,
  //       semi: true,
  //       singleQuote: true,
  //       trailingComma: 'none'
  //     }
  //   ]
  // },
  base
});
