<script setup lang="ts">
import type { IConversation } from '@/types';
import hljs from 'highlight.js';
import _ from 'lodash';
import { marked } from 'marked';

defineProps<{
  conv: IConversation;
  idx: number | undefined;
}>();
const renderer = {
  code(code: string, infostring: string | undefined, escaped: boolean) {
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
marked.use({ renderer });
function countAndConcat(str: string, substr: string) {
  // 使用正则表达式的全局匹配来查找子字符串
  const matches = str.match(new RegExp(substr, 'g'));

  // 判断子字符串的个数是奇数还是偶数
  const count = matches ? matches.length : 0;
  const isOdd = count % 2 === 1;

  // 根据判断结果返回相应的字符串
  return isOdd ? str + '\n' + substr : str;
}
/**
 * markdown to html
 */
function mdToHtml(md: string, conv: IConversation) {
  console.log(md, conv);

  if (md == '') {
    return '<p></p>';
  }

  const _md = countAndConcat(md, '```');

  var htmlMD = marked.parse(_md);
  htmlMD = htmlMD.trim();
  return htmlMD;
}
function suitable(idx: number | undefined, conv: IConversation, suit: any) {}
function next(conv: IConversation) {
  if (conv.idx == _.get(conv, 'speeches.length') - 1) {
    return;
  }
  _.set(conv, 'idx', _.get(conv, 'idx') + 1);
  //   refrechConversation();
}
function last(conv: IConversation) {
  if (conv.idx == 0) {
    return;
  }
  _.set(conv, 'idx', _.get(conv, 'idx') - 1);
  //   refrechConversation();
}
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
          class="relative h-[30px] w-[30px] p-1 rounded-sm text-white flex items-center justify-center"
          style="background-color: rgb(16, 163, 127)"
        >
          <img
            class="chat_avater"
            src="@/assets/imgs/chat.png"
            alt="chat_avater"
          />
        </div>

        <!-- 多个消息 -->
        <div
          v-if="_.get(conv, 'speeches.length') > 1"
          class="text-xs flex items-center justify-center gap-1 invisible absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible"
        >
          <button
            @click.stop="last(conv)"
            :disabled="!(_.get(conv, 'idx') > 0)"
            class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3 w-3"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span class="flex-grow flex-shrink-0"
            >{{ _.get(conv, 'idx') + 1 }} /
            {{ _.get(conv, 'speeches', []).length }}</span
          >
          <button
            @click.stop="next(conv)"
            :disabled="
              !(_.get(conv, 'idx') < _.get(conv, 'speeches', []).length - 1)
            "
            class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400"
          >
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3 w-3"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      <div
        class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]"
      >
        <div class="flex flex-grow flex-col gap-3">
          <!--  whitespace-pre-wrap -->
          <div class="min-h-[20px] flex flex-col items-start gap-4">
            <div
              v-html="
                mdToHtml(
                  _.get(conv, `speeches.${_.get(conv, 'idx')}`) ||
                    '大模型正在配置调试中，请等待回复...',
                  conv
                )
              "
              :class="{ 'result-streaming': conv.loading }"
              class="markdown prose-r w-full break-words dark:prose-invert light"
            ></div>
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
<style scoped lang="scss"></style>