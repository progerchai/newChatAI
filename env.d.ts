/// <reference types="vite/client" />
declare module 'lodash';
declare module 'katex';
declare module 'vue-markdown';
declare module 'highlight.js';
declare module 'marked';

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
