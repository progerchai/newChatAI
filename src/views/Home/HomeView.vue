<script setup lang="ts">
/*
 *@description: 首页
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 15:10:24
 */
import '@/assets/index.css';
import {
  IconLightning,
  IconPlus,
  IconSun,
  IconWarning,
  IconBad,
  IconGood,
  IconPost,
} from '@/components/icons';
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
  conversations: Array<any>;
  conversation: Array<any>;
  chatMsg: string;
  chatTitle: string;
  convLoading: boolean;
  isShowGoBottom: boolean;
  oldConv: any;
  convTitletmp: string;
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
  oldConv: undefined,
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

      if (conversation.length == 2 && rconv['speeches'].length == 1) {
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
function initConvs(
  convs: Array<{ speaker: string; idx: number; speeches: any[] }>
) {
  for (let i = 0; i < convs.length; i++) {
    var conv = convs[i];
    if (conv.speaker == 'human') {
      continue;
    }
    conv['idx'] = conv['speeches'].length - 1;
  }
  return convs;
}
function last(conv: { idx: number }) {
  if (conv.idx == 0) {
    return;
  }
  conv.idx--;
  refrechConversation();
}
function suitable(
  idx: number,
  conv: { idx: number; suitable: any },
  suit: any
) {
  const { cid } = state;
  var cdate = {
    idx: idx,
    msg_idx: conv.idx,
    suitable: suit,
  };
  conv.suitable[conv.idx] = suit;
  axios
    .put(`/api/ai/suitable/${cid}`, cdate)
    .then((result) => {
      console.log(result);
      refrechConversation();
    })
    .catch((err) => {});
}
function next(conv: { idx: number; suitable: any; speeches: any[] }) {
  if (conv.idx == conv['speeches'].length - 1) {
    return;
  }
  conv.idx++;
  refrechConversation();
}
function inputChat(msg: string) {
  state.chatMsg = msg;
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
function mdToHtml(md: string, conv: any) {
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

  var rconv = conversation[conversation.length - 1];
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
function generateConvTitle(conv: any) {
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
function selectConversation(conv: any, loadConv: any) {
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
function editTitle(idx: number, conv: any) {
  state.convTitletmp = conv.title;
  conv.editable = true;
  state.conversation[idx] = conv;
  setTimeout(() => {
    document.getElementById('titleInput')?.focus();
  }, 150);
}
function titleInputBlur(idx: number, conv: any) {
  setTimeout(() => {
    cancelChangeConvTitle(idx, conv);
  }, 100);
}
function changeConvTitle(idx: number, conv: any) {
  conv.title = state.convTitletmp;
  saveConversations();
  cancelChangeConvTitle(idx, conv);
}
function cancelChangeConvTitle(idx: number, conv: any) {
  conv.editable = false;
  state.conversations[idx] = conv;
}
function delConv(cidx: number) {
  state.conversations.splice(cidx, 1);
  saveConversations();
}
function cancelDelConv(idx: number, conv: any) {
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
                            <span
                              style="
                                box-sizing: border-box;
                                display: inline-block;
                                overflow: hidden;
                                width: initial;
                                height: initial;
                                background: none;
                                opacity: 1;
                                border: 0px;
                                margin: 0px;
                                padding: 0px;
                                position: relative;
                                max-width: 100%;
                              "
                            >
                              <span
                                style="
                                  box-sizing: border-box;
                                  display: block;
                                  width: initial;
                                  height: initial;
                                  background: none;
                                  opacity: 1;
                                  border: 0px;
                                  margin: 0px;
                                  padding: 0px;
                                  max-width: 100%;
                                "
                              >
                                <img
                                  aria-hidden="true"
                                  src="@/assets/imgs/human1.png"
                                  alt=" huamn"
                                  style="
                                    display: block;
                                    max-width: 100%;
                                    width: initial;
                                    height: initial;
                                    background: none;
                                    opacity: 1;
                                    border: 0px;
                                    margin: 0px;
                                    padding: 0px;
                                  "
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
                          <div
                            v-if="false"
                            class="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible"
                          >
                            <button
                              class="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400 md:invisible md:group-hover:visible"
                            >
                              <svg
                                stroke="currentColor"
                                fill="none"
                                stroke-width="2"
                                viewBox="0 0 24 24"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="h-4 w-4"
                                height="1em"
                                width="1em"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                ></path>
                                <path
                                  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                ></path>
                              </svg>
                            </button>
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
                            <svg
                              width="41"
                              height="41"
                              viewBox="0 0 41 41"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              stroke-width="1.5"
                              class="h-6 w-6"
                            >
                              <path
                                d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </div>

                          <!-- 多个消息 -->
                          <div
                            v-if="conv.speeches.length > 1"
                            class="text-xs flex items-center justify-center gap-1 invisible absolute left-0 top-2 -ml-4 -translate-x-full group-hover:visible"
                          >
                            <button
                              @click.stop="last(conv)"
                              :disabled="!(conv.idx > 0)"
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
                                v-html="mdToHtml(conv.speeches[conv.idx], conv)"
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
                      三乐
                    </h1>
                    <div class="md:flex items-start text-center gap-3.5">
                      <div class="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                        <h2
                          class="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2"
                        >
                          <IconSun />
                          Examples
                        </h2>
                        <ul
                          class="flex flex-col gap-3.5 w-full sm:max-w-md m-auto"
                        >
                          <button
                            @click="
                              inputChat(
                                'Explain quantum computing in simple terms'
                              )
                            "
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                          >
                            "Explain quantum computing in simple terms" →
                          </button>
                          <button
                            @click="
                              inputChat(
                                'Got any creative ideas for a 10 year old’s birthday?'
                              )
                            "
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                          >
                            "Got any creative ideas for a 10 year old’s
                            birthday?" →
                          </button>
                          <button
                            @click="
                              inputChat(
                                'How do I make an HTTP request in Javascript?'
                              )
                            "
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                          >
                            "How do I make an HTTP request in Javascript?" →
                          </button>
                        </ul>
                      </div>
                      <div class="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                        <h2
                          class="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2"
                        >
                          <IconLightning />
                          Capabilities
                        </h2>
                        <ul
                          class="flex flex-col gap-3.5 w-full sm:max-w-md m-auto"
                        >
                          <li
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md"
                          >
                            Remembers what user said earlier in the conversation
                          </li>
                          <li
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md"
                          >
                            Allows user to provide follow-up corrections
                          </li>
                          <li
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md"
                          >
                            Trained to decline inappropriate requests
                          </li>
                        </ul>
                      </div>
                      <div class="flex flex-col mb-8 md:mb-auto gap-3.5 flex-1">
                        <h2
                          class="flex gap-3 items-center m-auto text-lg font-normal md:flex-col md:gap-2"
                        >
                          <IconWarning />
                          Limitations
                        </h2>
                        <ul
                          class="flex flex-col gap-3.5 w-full sm:max-w-md m-auto"
                        >
                          <li
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md"
                          >
                            May occasionally generate incorrect information
                          </li>
                          <li
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md"
                          >
                            May occasionally produce harmful instructions or
                            biased content
                          </li>
                          <li
                            class="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md"
                          >
                            Limited knowledge of world and events after 2021
                          </li>
                        </ul>
                      </div>
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
