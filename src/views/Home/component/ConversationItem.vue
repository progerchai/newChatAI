<script setup lang="ts">
import { IconBad, IconGood } from '@/components/icons';
import type { IConversation } from '@/types';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import _ from 'lodash';
import MarkdownIt from 'markdown-it';
import { marked } from 'marked';

const md = MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></div></div>`;
      } catch (__) {
        console.log(__, 'error');
      }
    }
    return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${md.utils.escapeHtml(
      str
    )}</code></div></div>`;
  },
});

const text =
  '$$1 \Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,. $$' +
  '``` console.log(22222) ```' +
  '以下是一道关于支持向量机的单项选择题：<br><br>支持向量机（Support Vector Machine，SVM）是一种监督学习算法，用于分类和回归分析。SVM的主要思想是找到一个超平面，使得超平面上的数据点尽可能地被分离。以下关于SVM的说法错误的是：<br><br>A. SVM是一种线性分类算法<br>B. SVM具有较高的泛化能力<br>C. SVM可以处理高维数据<br>D. SVM只能用于二分类问题<br><br>答案：D. SVM只能用于二分类问题<br><br>解析：支持向量机可以用于二分类问题，也可以用于多分类问题。因此，选项D错误。';
const katexStr = '$$\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.$$';
const props = defineProps<{
  conv: IConversation;
  idx: number | undefined;
}>();

const renderer = {
  code(code: string, infostring: string, escaped: boolean) {
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
function countAndConcat(str: string, substr: string) {
  // 使用正则表达式的全局匹配来查找子字符串
  const matches = str.match(new RegExp(substr, 'g'));

  // 判断子字符串的个数是奇数还是偶数
  const count = matches ? matches.length : 0;
  const isOdd = count % 2 === 1;

  // 根据判断结果返回相应的字符串
  return isOdd ? str + '\n' + substr : str;
}
// marked.use({ renderer });
// marked.use(KatexExtension({}));

function mdToHtml(md: string) {
  if (md == '') {
    return '<p></p>';
  }

  md = countAndConcat(md, '```');
  var htmlMD = marked.parse(md);
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
            <!-- <vue-markdown
              :source="
                [_.get(conv, `speeches`, [])].join('') ||
                '大模型正在配置调试中，请等待回复1...'
              "
            /> -->
            <!-- <div v-html="md.render(text)"></div> -->
            <div
              v-html="
                mdToHtml(
                  [_.get(conv, `speeches`, [])].join('') ||
                    '正在排队处理中，请稍等......'
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
