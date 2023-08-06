<script setup lang="ts">
// @ts-nocheck
/*
 *@description: 首页
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 15:10:24
 */
import '@/assets/index.css';
import { IconBad, IconGood, IconPlus, IconPost } from '@/components/icons';
import type { IConversation } from '@/types';
import axios from 'axios';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import _ from 'lodash';
import { marked } from 'marked';
import {
  getCurrentInstance,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue';
import LeftMenu from './component/LeftMenu.vue';
import NoticeModal from './component/NoticeModal.vue';
interface State {
  theme: 'light' | 'dark';
  popupShow: boolean;
  avatarIdx: number;
  conversations: Array<IConversation>;
  conversation: Array<IConversation>;
  chatMsg: string; // 当前对话输入文本信息
  chatTitle: string;
  convLoading: boolean;
  isShowGoBottom: boolean;
  oldConv: IConversation | null;
  convTitletmp: string | undefined;
  source: any;
  rsource: any;
  tsource: any;
  cid: number | null;
}
const inputChatRef = ref(null);
const chatContainer = ref(null);
const instance = getCurrentInstance();
const state = reactive<State>({
  theme: 'light',
  popupShow: false, // TODO:
  avatarIdx: 1,
  conversations: [],
  conversation: [],
  chatMsg: '',
  chatTitle: '新建会话',
  convLoading: false,
  isShowGoBottom: false,
  oldConv: null,
  convTitletmp: '',
  source: undefined,
  rsource: undefined,
  tsource: undefined,
  cid: null,
});
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
function closeSource() {
  let { source, tsource, rsource } = state;
  if (source) {
    source.close();
    source = undefined;
  }
  if (tsource) {
    tsource.close();
    tsource = undefined;
  }
  if (rsource) {
    rsource.close();
    rsource = undefined;
  }
}
function stopChat() {
  let { conversation, cid } = state;
  axios
    .put(`/api/stop/chat/${cid}`, {})
    .then((result) => {
      const rconv = conversation[conversation.length - 1];
      rconv['loading'] = false;
      state.convLoading = false;

      if (conversation.length == 2 && rconv['speeches']?.length == 1) {
        var newConv = {
          id: cid,
          title: '新建会话',
        };

        generateConvTitle(newConv);
        state.conversations.unshift(newConv);
        selectConversation(newConv, false);
        saveConversations();
      }

      refrechConversation();
      closeSource();
    })
    .catch((err) => {
      closeSource();
    });
}
function changeHeight() {
  let elem = inputChatRef.value as any;
  elem.style.height = '24px';
  var scrollHeight = elem.scrollHeight;
  if (24 >= scrollHeight || state.chatMsg.length == 0) {
    resetHeight();
    return;
  }

  elem.style.removeProperty('overflow-y');
  elem.style.height = scrollHeight + 'px';
}
function resetHeight() {
  let elem = inputChatRef.value as any;
  _.set(elem, 'style.height', '24px');
  _.set(elem, 'style.overflow-y', 'hidden');
}
/**
 * 关闭弹窗
 */
function closePopup() {
  state.popupShow = false;
}
function vueCopy(node: Element) {
  var code = node.getElementsByTagName('code')[0].innerHTML;
  var text = decodeURIComponent(code);
  (instance as any)?.ctx?.copyText(text).then(
    () => {
      var svg = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Copied!</span>`;
      const nodeInnerHtml = node.innerHTML;
      node.innerHTML = svg;

      setTimeout(() => {
        node.innerHTML = nodeInnerHtml;
      }, 1000);
    },
    () => {
      console.log('复制失败');
    }
  );
}
function changeTheme(_theme: 'light' | 'dark') {
  state.theme = _theme;
  var html = document.getElementsByTagName('html')[0];
  html.classList.remove('light', 'dark');
  html.classList.add(_theme);
  (html.style as any)['color-scheme'] = _theme;
  localStorage.setItem('theme', _theme);
}
function initConvs(convs: IConversation[]) {
  for (let i = 0; i < convs.length; i++) {
    var conv = convs[i];
    if (conv.speaker == 'human') {
      continue;
    }
    conv['idx'] = _.get(conv, 'speeches.length', 0) - 1;
  }
  return convs;
}
function last(conv: IConversation) {
  if (conv.idx == 0) {
    return;
  }
  _.set(conv, 'idx', _.get(conv, 'idx') - 1);
  refrechConversation();
}
function suitable(idx: number, conv: IConversation, suit: any) {
  const { cid } = state;
  var cdate = {
    idx: idx,
    msg_idx: conv.idx,
    suitable: suit,
  };
  _.set(conv, `suitable[${conv?.idx}]`, suit);
  axios
    .put(`/api/ai/suitable/${cid}`, cdate)
    .then((result) => {
      console.log(result);
      refrechConversation();
    })
    .catch((err) => {});
}
function next(conv: IConversation) {
  if (conv.idx == _.get(conv, 'speeches.length') - 1) {
    return;
  }
  _.set(conv, 'idx', _.get(conv, 'idx') + 1);
  refrechConversation();
}
function countAndConcat(str: string, substr: string) {
  // 使用正则表达式的全局匹配来查找子字符串
  const matches = str.match(new RegExp(substr, 'g'));

  // 判断子字符串的个数是奇数还是偶数
  const count = matches ? matches.length : 0;
  const isOdd = count % 2 === 1;

  // 根据判断结果返回相应的字符串
  return isOdd ? str + '\n' + substr : str;
}
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
function refrechConversation() {
  let { conversation } = state;
  conversation = JSON.parse(JSON.stringify(conversation));
}
function chatRepeat() {
  let { convLoading, conversation, cid } = state;
  if (convLoading) {
    return;
  }
  convLoading = true;

  var rconv = conversation[conversation.length - 1] || {};
  rconv['idx'] = rconv['suitable'].length;
  rconv['loading'] = true;
  rconv['suitable'].push(0);
  rconv['speeches'].push('');
  refrechConversation();

  const _rsource = (state.rsource = new EventSource(`/api/chat/repeat/${cid}`));
  _rsource.addEventListener('open', function () {
    console.log('connect');
  });

  //如果服务器响应报文中没有指明事件，默认触发message事件
  _rsource.addEventListener('message', function (e) {
    console.log(`resp:(${e.data})`);
    let rconv = conversation[conversation.length - 1];
    if (e.data == '[DONE]') {
      _rsource.close();

      rconv['loading'] = false;
      convLoading = false;
      refrechConversation();
      state.rsource = undefined;
      return;
    }

    let content = e.data;
    if (content.includes('[ENTRY]')) {
      content = content.replaceAll('[ENTRY]', '\n');
    }

    // 滚动到最下面
    handleScrollBottom();

    const idx = rconv.idx;
    rconv['speeches'][idx] += content;
    refrechConversation();
  });

  //发生错误，则会触发error事件
  _rsource.addEventListener('error', function (e: { data: any }) {
    console.log('error:' + e.data);
    _rsource.close();
    state.rsource = undefined;
  });
}
function judgeInput(e: KeyboardEvent) {
  if (!e.shiftKey && e.keyCode == 13) {
    e.cancelBubble = true; //ie阻止冒泡行为
    e.stopPropagation(); //Firefox阻止冒泡行为
    e.preventDefault(); //取消事件的默认动作*换行
    send();
  }
}
/**
 * 发送chat 信息
 */
function send() {
  let { chatMsg, convLoading, conversation, cid } = state;
  if (chatMsg.trim().length == 0) {
    return;
  }
  if (convLoading) {
    return;
  }
  convLoading = true;
  let first = conversation.length == 0;

  conversation.push({
    speaker: 'human',
    speech: chatMsg.trim().replace(/\n/g, ''),
  });
  chatMsg = '';
  let conv = {
    idx: 0,
    loading: true,
    speaker: 'ai',
    suitable: [0],
    speeches: [''],
  };
  conversation.push(conv);

  // 滚动到最下面
  handleScrollBottom();

  var _source = (state.source = new EventSource(
    `/api/chat/${cid}?prompt=${encodeURIComponent(chatMsg)}`
  ));

  // source.addEventListener('open', function () {
  //   console.log('connect');
  // });

  //如果服务器响应报文中没有指明事件，默认触发message事件
  _source.addEventListener('message', function (e) {
    console.log(`resp:(${e.data})`);

    let conv = conversation[conversation.length - 1];
    if (e.data == '[DONE]') {
      _source.close();
      conv['loading'] = false;
      state.convLoading = false;

      if (first) {
        let newConv = {
          id: cid,
          title: '新建会话',
        };

        generateConvTitle(newConv);
        state.conversations.unshift(newConv);
        selectConversation(newConv, false);
        saveConversations();
      }
      refrechConversation();
      state.source = undefined;
      return;
    }

    let content = e.data;
    if (content.includes('[ENTRY]')) {
      content = content.replaceAll('[ENTRY]', '\n');
    }

    // 滚动到最下面
    handleScrollBottom();

    conv['speeches'][0] += content;
    refrechConversation();
  });

  //发生错误，则会触发error事件
  _source.addEventListener('error', function (e: any) {
    console.log('error:' + e.data);
    _source.close();
    state.source = undefined;
  });
}
function generateConvTitle(conv: IConversation) {
  const { cid } = state;
  var _tsource = (state.tsource = new EventSource(`/api/chat/title/${cid}`));

  //如果服务器响应报文中没有指明事件，默认触发message事件
  conv.title = '';
  _tsource.addEventListener('message', function (e) {
    if (e.data == '[DONE]') {
      _tsource.close();
      selectConversation(conv, false);
      saveConversations();
      state.tsource = undefined;
      return;
    }

    conv.title += e.data;
    selectConversation(conv, false);
  });

  _tsource.addEventListener('error', function (e: any) {
    console.log('error:' + e.data);
    _tsource.close();
    state.tsource = undefined;
  });
}
function newChat() {
  let { conversation, conversations } = state;
  if (conversation.length == 0) {
    return;
  }

  state.chatTitle = '新建会话';
  document.title = '新建会话';
  const _conversations = conversations;
  for (let idx in _conversations) {
    var conv = _conversations[idx];
    delete conv.editable;
    delete conv.selected;
    delete conv.delete;
  }

  loadId();
}
function loadId() {
  axios
    .post(`/api/generate/id`, {})
    .then((result) => {
      console.log(result);
      const resp = result.data;
      state.cid = resp.data;
      state.conversation = [];
    })
    .catch((err) => {});
}
function loadConversations() {
  let convs = localStorage.getItem('conversations') || '[]';
  state.conversations = JSON.parse(convs);
}
function saveConversations() {
  const { conversations } = state;
  var _conversations = JSON.parse(JSON.stringify(conversations));
  for (let idx in _conversations) {
    var conv = _conversations[idx];
    delete conv.editable;
    delete conv.selected;
    delete conv.delete;
  }
  let convs = JSON.stringify(_conversations);
  localStorage.setItem('conversations', convs);
}
function clearConversations() {
  state.conversations = [];
  saveConversations();
}
function selectConversation(conv: IConversation, loadConv: boolean) {
  const { oldConv } = state;
  if (oldConv) {
    state.oldConv = { selected: false };
  }
  conv.selected = true;
  state.oldConv = conv;

  document.title = conv.title || 'chatai';
  state.chatTitle = conv.title || 'chatai';

  if (!loadConv) {
    return;
  }

  axios
    .get(`/api/conv/${conv.id}`)
    .then((result) => {
      console.log(result);
      var resp = result.data;
      var content = resp.data;

      state.cid = conv.id;
      state.conversation = initConvs(content.convs);
      setTimeout(() => {
        isScrollAndNotBottom();
      }, 300);
    })
    .catch((err) => {});
}
function editTitle(idx: number, conv: IConversation) {
  state.convTitletmp = conv.title;
  conv.editable = true;
  state.conversation[idx] = conv;
  setTimeout(() => {
    document.getElementById('titleInput')?.focus();
  }, 150);
}
function titleInputBlur(idx: number, conv: IConversation) {
  setTimeout(() => {
    cancelChangeConvTitle(idx, conv);
  }, 100);
}
function changeConvTitle(idx: number, conv: IConversation) {
  conv.title = state.convTitletmp;
  saveConversations();
  cancelChangeConvTitle(idx, conv);
}
function cancelChangeConvTitle(idx: number, conv: IConversation) {
  conv.editable = false;
  state.conversations[idx] = conv;
}
function delConv(cidx: number) {
  state.conversations.splice(cidx, 1);
  saveConversations();
}
function cancelDelConv(idx: number, conv: IConversation) {
  conv.delete = false;
  state.conversations[idx] = conv;
}
function loadAvatar() {
  let avatar = localStorage.getItem('avatar') || Math.ceil(Math.random() * 9);
  state.avatarIdx = Number(avatar);
}
function handleScrollBottom() {
  nextTick(() => {
    let scrollElem = chatContainer.value as any;
    scrollElem.scrollTo({
      top: scrollElem.scrollHeight,
      behavior: 'smooth',
    });
  });
}
function isScrollAndNotBottom() {
  let chatDivEle = chatContainer.value as any;
  if (!chatDivEle) {
    return;
  }

  if (chatDivEle.scrollHeight <= chatDivEle.clientHeight) {
    state.isShowGoBottom = false;
    return;
  }

  const scrollTop = chatDivEle.scrollTop;
  const windowHeight = chatDivEle.clientHeight;
  const scrollHeight = chatDivEle.scrollHeight;
  if (scrollTop + windowHeight >= scrollHeight - 50) {
    state.isShowGoBottom = false;
    return;
  }

  state.isShowGoBottom = true;
}
watch(
  () => state.chatMsg,
  () => {
    changeHeight();
  }
);
onMounted(() => {
  let theme = localStorage.getItem('theme') || 'light';
  changeTheme(theme as 'dark' | 'light');
  loadId();
  loadConversations();
  loadAvatar();

  let chatDivEle = chatContainer.value as any;
  chatDivEle.addEventListener('scroll', isScrollAndNotBottom, true);
  (window as any).copy = vueCopy;
});
</script>
<template>
  <div id="__next">
    <div class="content">
      <!-- 菜单导航 -->
      <LeftMenu
        :new-chat="newChat"
        :conversations="state.conversations"
        :conv-titletmp="state.convTitletmp"
        :change-conv-titletmp="(tmp:string)=>{state.convTitletmp = tmp}"
        :title-input-blur="titleInputBlur"
        :change-conv-title="changeConvTitle"
        :cancel-change-conv-title="cancelChangeConvTitle"
        :cancel-del-conv="cancelDelConv"
        :del-conv="delConv"
        :select-conversation="selectConversation"
        :edit-title="editTitle"
        :clear-conversations="clearConversations"
        :theme="state.theme"
        :change-theme="changeTheme"
      />
      <div class="flex flex-1 flex-col md:pl-[260px] content-right">
        <main
          class="relative w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 content-main"
        >
          <!-- 聊天窗 -->
          <div class="flex-1 overflow-hidden">
            <div
              class="react-scroll-to-bottom--css-ncqif-79elbk h-full dark:bg-gray-800"
            >
              <div
                ref="chatContainer"
                class="react-scroll-to-bottom--css-krija-1n7m0yu"
              >
                <div
                  class="flex flex-col items-center text-sm dark:bg-gray-800"
                >
                  <!-- 对话item -->
                  <template v-for="(conv, idx) in state.conversation">
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
                              :disabled="!(conv?.idx > 0)"
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
                              >{{ conv.idx + 1 }} /
                              {{ conv.speeches.length }}</span
                            >
                            <button
                              @click.stop="next(conv)"
                              :disabled="!(conv.idx < conv.speeches.length - 1)"
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
                            <div
                              class="min-h-[20px] flex flex-col items-start gap-4"
                            >
                              <div
                                v-html="
                                  mdToHtml(
                                    conv.speeches[conv.idx] ||
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
                                v-if="
                                  conv.suitable[conv.idx] == 0 ||
                                  conv.suitable[conv.idx] == 1
                                "
                                :class="{
                                  suitable_selected:
                                    conv.suitable[conv.idx] == 1,
                                }"
                                class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                              >
                                <IconBad />
                              </button>
                              <button
                                @click.stop="suitable(idx, conv, -1)"
                                v-if="
                                  conv.suitable[conv.idx] == 0 ||
                                  conv.suitable[conv.idx] == -1
                                "
                                :class="{
                                  suitable_selected:
                                    conv.suitable[conv.idx] == -1,
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

                  <div
                    v-if="state.conversation.length == 0"
                    class="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100"
                  >
                    <img
                      class="home-cover"
                      src="@/assets/imgs/home_cover.png"
                    />
                    <h1
                      class="text-4xl font-semibold text-center mt-6 sm:mt-[20vh] ml-auto mr-auto mb-10 flex gap-2 items-center justify-center home-page-title"
                    >
                      智海三乐
                    </h1>
                    <div class="welcome-text">
                      欢迎访问智海三乐，请提出你的人工智能知识问题，我们一起学习！
                    </div>
                  </div>

                  <div class="w-full h-32 md:h-48 flex-shrink-0"></div>
                </div>

                <transition name="el-fade-in-linear">
                  <!-- 回到底部 -->
                  <button
                    v-show="state.isShowGoBottom"
                    @click="handleScrollBottom"
                    class="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 bg-gray-50 text-gray-600 dark:border-white/10 dark:bg-white/10 dark:text-gray-200"
                  >
                    <IconPlus />
                  </button>
                </transition>
              </div>
            </div>
          </div>

          <!-- 底部输入 -->
          <div
            class="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient"
          >
            <form
              class="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6"
            >
              <div class="relative flex h-full flex-1 md:flex-col">
                <div
                  class="flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center"
                >
                  <button
                    v-if="!state.convLoading && state.conversation.length > 0"
                    @click.stop.prevent="chatRepeat"
                    id="chatRepeat"
                    class="btn flex justify-center gap-2 btn-neutral border-0 md:border"
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
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <polyline points="23 20 23 14 17 14"></polyline>
                      <path
                        d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                      ></path>
                    </svg>
                    <p class="none">Regenerate response</p>
                  </button>

                  <button
                    v-if="state.convLoading"
                    @click.stop.prevent="stopChat"
                    id="stopChat"
                    class="btn relative btn-neutral border-0 md:border"
                  >
                    <div class="flex w-full items-center justify-center gap-2">
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
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect></svg
                      >Stop generating
                    </div>
                  </button>
                </div>
                <div
                  class="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
                >
                  <textarea
                    v-model="state.chatMsg"
                    ref="inputChatRef"
                    @keydown="judgeInput"
                    tabindex="0"
                    data-id="root"
                    style="max-height: 200px; height: 24px; overflow-y: hidden"
                    rows="1"
                    class="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"
                  ></textarea>
                  <button
                    @click.stop.prevent="send"
                    :disabled="state.convLoading"
                    class="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                  >
                    <div
                      v-if="state.convLoading"
                      class="text-2xl"
                      style="line-height: 1.3rem"
                    >
                      <span class="load_dot1">·</span
                      ><span class="load_dot2">·</span
                      ><span class="load_dot3">·</span>
                    </div>
                    <IconPost v-else />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  </div>

  <!-- 弹窗 -->
  <NoticeModal :popup-show="state.popupShow" :on-cancel="closePopup" />
</template>

<style lang="scss" scoped>
@import './Homeview.scss';
</style>
