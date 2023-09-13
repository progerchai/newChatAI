import legacy from '@vitejs/plugin-legacy';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
// import { Plugin as importToCDN } from 'vite-plugin-cdn-import';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    hmr: true,
    proxy: {
      '^/api': {
        target: 'http://119.23.229.128/api',
        // target: 'https://sanle.hep.com.cn/api',
        changeOrigin: true, //开启代理
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    open: 'http://localhost:5173',
  },
  plugins: [
    vue(),
    vueJsx(),
    // importToCDN({
    //   modules: [
    //     {
    //       name: 'vue3-markdown-it',
    //       var: 'Markdown',
    //       path: 'https://cdn.jsdelivr.net/npm/vue3-markdown-it@1.0.10/dist/vue3-markdown-it.umd.min.js',
    //     },
    //     {
    //       name: 'markdown-it-mathjax3',
    //       var: 'mathjaxPlugin',
    //       path: 'https://cdn.jsdelivr.net/npm/markdown-it-mathjax3@4.3.2/index.min.js',
    //     },
    //   ],
    // }),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // ...(process.env.NODE_ENV === 'production'
      //   ? {
      //       'vue3-markdown-it':
      //         'https://cdn.jsdelivr.net/npm/vue3-markdown-it@1.0.10/dist/vue3-markdown-it.umd.min.js',
      //       'markdown-it-mathjax3':
      //         'https://cdn.jsdelivr.net/npm/markdown-it-mathjax3@4.3.2/index.min.js',
      //     }
      //   : {}),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: any): string {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString();
          }
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    //   关闭文件计算
    reportCompressedSize: false,
    sourcemap: false,
  },
});
