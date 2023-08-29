/// <reference types="vite/client" />
declare module 'lodash';
declare module 'highlight.js';
declare module 'vue3-markdown-it';
declare module 'element-plus';
declare module 'markdown-it-mathjax3';
declare module 'js-cookie';
declare module 'vuex' {
  export * from 'vuex/types/index.d.ts';
  export * from 'vuex/types/helpers.d.ts';
  export * from 'vuex/types/logger.d.ts';
  export * from 'vuex/types/vue.d.ts';
}

declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: defineComponent<{}, {}, any>;
  export default component;
}
