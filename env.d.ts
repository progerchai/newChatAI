/// <reference types="vite/client" />
declare module 'lodash';
declare module 'highlight.js';
declare module 'marked';

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
