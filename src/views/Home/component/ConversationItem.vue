<script setup lang="ts">
import { IconBad, IconGood } from '@/components/icons';
import type { IConversation } from '@/types';
import katex from 'katex';
import _ from 'lodash';

defineProps<{
  conv: IConversation;
  idx: number | undefined;
}>();
function suitable(idx: number | undefined, conv: IConversation, suit: any) { }
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
  <div v-if="conv.speaker == 'human'"
    class="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800">
    <div class="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
      <div class="w-[30px] flex flex-col relative items-end">
        <div class="relative flex">
          <span class="human">
            <span class="human-avater">
              <img aria-hidden="true" src="@/assets/imgs/human1.png" alt="huamn" class="human-avater-img" />
            </span>
          </span>
        </div>
      </div>
      <div class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
        <div class="flex flex-grow flex-col gap-3">
          <div class="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
            {{ conv.speech }}
          </div>
        </div>
        <div class="flex justify-between"></div>
      </div>
    </div>
  </div>

  <!-- ai -->
  <div v-if="conv.speaker == 'ai'"
    class="w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50 dark:bg-[#444654]">
    <div class="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
      <div class="w-[30px] flex flex-col relative items-end">
        <div class="relative h-[30px] w-[30px] rounded-sm text-white flex items-center justify-center">
          <img class="chat_avater" src="@/assets/imgs/chat.png" alt="chat_avater" />
        </div>

        <!-- 多个消息 -->
        <div v-if="_.get(conv, 'speeches.length') > 1"
          class="text-xs flex items-center justify-center gap-1 invisible absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible">
          <button @click.stop="last(conv)" :disabled="!(_.get(conv, 'idx') > 0)"
            class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400">
            <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <span class="flex-grow flex-shrink-0">{{ _.get(conv, 'idx') + 1 }} /
            {{ _.get(conv, 'speeches', []).length }}</span>
          <button @click.stop="next(conv)" :disabled="!(_.get(conv, 'idx') < _.get(conv, 'speeches', []).length - 1)
            " class="dark:text-white disabled:text-gray-300 dark:disabled:text-gray-400">
            <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" stroke-linecap="round"
              stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      <div class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
        <div class="flex flex-grow flex-col gap-3">
          <!--  whitespace-pre-wrap -->
          <div class="min-h-[20px] flex flex-col items-start gap-4">
            <vue-markdown :source="[_.get(conv, `speeches`, [])].join('') ||
              '大模型正在配置调试中，请等待回复1...'" />
            <div v-html="katex.renderToString(
              [_.get(conv, `speeches`, [])].join('') ||
              '大模型正在配置调试中，请等待回复...'
            )
              " :class="{ 'result-streaming': conv.loading }"
              class="markdown prose-r w-full break-words dark:prose-invert light"></div>
          </div>
        </div>
        <div class="flex justify-between">
          <div
            class="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
            <button @click.stop="suitable(idx, conv, 1)" v-if="conv.suitable == 0 || conv.suitable == 1" :class="{
              suitable_selected: conv.suitable == 1,
            }"
              class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
              <IconBad />
            </button>
            <button @click.stop="suitable(idx, conv, -1)" v-if="conv.suitable == 0 || conv.suitable == -1" :class="{
              suitable_selected: conv.suitable == -1,
            }"
              class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400">
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
</style>
<style lang="scss">
.katex {
  font: unset;

  &-html {
    width: 100%;
  }

  .base {
    width: 100%;

    span {
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
      display: inline-block;
    }
  }
}
</style>
