<script setup lang="ts">
import { IconBad, IconGood } from '@/components/icons';
import { comment } from '@/service/home';
import type { IConversation, ISuitable } from '@/types';
import 'highlight.js/styles/monokai.css';
import _ from 'lodash';
import mathjaxPlugin from 'markdown-it-mathjax3';
import Markdown from 'vue3-markdown-it';
const props = defineProps<{
  conv: IConversation;
  idx: number | undefined;
  onChangeConversation: (idx: number, conv: IConversation) => void;
}>();
function suitable(index: number, conv: IConversation, suit: ISuitable) {
  comment({
    sessionId: Number(conv.idx),
    suitable: suit,
    id: Number(conv.id),
  }).then((res) => {
    if (res.code === 'SUCCESS') {
      const _conv = _.cloneDeep(conv);
      _conv.suitable = suit;
      props.onChangeConversation(index, _conv);
    }
  });
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
          class="relative h-[30px] w-[30px] rounded-sm text-white flex items-center justify-center"
        >
          <img
            class="chat_avater"
            src="https://s1.imagehub.cc/images/2023/08/21/chat.png"
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
              @click.stop="suitable(Number(idx), conv, -1)"
              v-if="conv.suitable === 0 || conv.suitable === -1"
              :class="{
                suitable_selected: conv.suitable === -1,
              }"
              class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
            >
              <IconBad />
            </button>
            <button
              @click.stop="suitable(Number(idx), conv, 1)"
              v-if="conv.suitable === 0 || conv.suitable === 1"
              :class="{
                suitable_selected: conv.suitable === 1,
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
button {
  background-color: transparent;
}
</style>
