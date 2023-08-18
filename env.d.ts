/// <reference types="vite/client" />
declare module 'lodash';
declare module 'highlight.js';
declare module 'vue3-markdown-it';
declare module 'element-plus';

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
