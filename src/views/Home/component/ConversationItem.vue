<script setup lang="ts">
import { IconBad, IconGood } from '@/components/icons';
import type { IConversation } from '@/types';
import hljs from 'highlight.js';
import Markdown from 'vue3-markdown-it';
import 'highlight.js/styles/monokai.css';
import _ from 'lodash';
import * as mathjaxPlugin from 'markdown-it-mathjax3';

const katexStr = '$$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.$$';
const table =
  '|  表头   | 表头  |\n|  ----  | ----  |\n| 单元格  | 单元格 |\n| 单元格  | 单元格 |';
const props = defineProps<{
  conv: IConversation;
  idx: number | undefined;
}>();
const renderer = {
  code(code: string, infostring: string, escaped: boolean) {
    console.log(22222, code, infostring, escaped);

    var codeHtml = code;
    if (infostring && infostring == 'html') {
      codeHtml = encodeURIComponent(code);
    }
    if (infostring) {
      codeHtml = hljs.highlightAuto(code).value;
    }

    console.log(code, infostring, escaped, codeHtml);

    return `<div class="bg-black mb-4 rounded-md">
      <div class="code_header flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans">
        <span>${infostring || ''}</span>
        <button onclick="copy(this)" class="flex ml-auto gap-2">
          <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          </svg>
          <span>Copy code</span>
          <code style="display:none">${encodeURIComponent(code)}</code>
        </button>
      </div>
      <div class="p-4 overflow-y-auto">
        <code class="!whitespace-pre hljs language-${infostring}">${codeHtml}</code>
      </div>
    </div>`;
  },
  paragraph(text: string) {
    return `<p style="white-space:pre-wrap;">${text}</p>`;
  },
};

function suitable(idx: number | undefined, conv: IConversation, suit: any) {}
</script>
<template>
  <!-- human -->
  <div
    v-if="conv.speaker == 'human'"
    class="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800"
  >
    <div
      class="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0"
    >
      <div class="w-[30px] flex flex-col relative items-end">
        <div class="relative flex">
          <span class="human">
            <span class="human-avater">
              <img
                aria-hidden="true"
                src="@/assets/imgs/human1.png"
                alt="huamn"
                class="human-avater-img"
              />
            </span>
          </span>
        </div>
      </div>
      <div
        class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]"
      >
        <div class="flex flex-grow flex-col gap-3">
          <div
            class="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap"
          >
            {{ conv.speech }}
          </div>
        </div>
        <div class="flex justify-between"></div>
      </div>
    </div>
  </div>

  <!-- ai -->
  <div
    v-if="conv.speaker == 'ai'"
    class="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]"
  >
    <div
      class="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0"
    >
      <div class="w-[30px] flex flex-col relative items-end">
        <div
          class="relative h-[30px] w-[30px] rounded-sm text-white flex items-center justify-center"
        >
          <img
            class="chat_avater"
            src="@/assets/imgs/chat.png"
            alt="chat_avater"
          />
        </div>
      </div>
      <div
        class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]"
      >
        <div class="flex flex-grow flex-col gap-3">
          <!--  whitespace-pre-wrap -->
          <div class="min-h-[20px] flex flex-col items-start gap-4">
            <Markdown
              class="cus-markdown"
              :html="true"
              :source="
                [_.get(conv, `speeches`, [])].join('') ||
                '正在排队处理中，请稍等......'
              "
              :plugins="[{ plugin: mathjaxPlugin }]"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <div
            class="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible"
          >
            <button
              @click.stop="suitable(idx, conv, 1)"
              v-if="conv.suitable == 0 || conv.suitable == 1"
              :class="{
                suitable_selected: conv.suitable == 1,
              }"
              class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
            >
              <IconBad />
            </button>
            <button
              @click.stop="suitable(idx, conv, -1)"
              v-if="conv.suitable == 0 || conv.suitable == -1"
              :class="{
                suitable_selected: conv.suitable == -1,
              }"
              class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
            >
              <IconGood />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.chat_avater {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 2px;
  background-color: transparent;
}
.cus-markdown {
  width: 100%;
}
</style>
<style lang="scss">
a {
  white-space: break-spaces;
  word-wrap: break-word;
}
mjx-assistive-mml {
  clip: unset !important;
  display: inline-block !important;
  position: relative !important;
}
mjx-container {
  svg {
    display: none !important;
  }
}
</style>
