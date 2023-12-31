<script setup lang="ts">
/*
 *@description: 左侧菜单
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 15:59:07
 */
import {
  Ellipsis,
  IconChat,
  IconDelete,
  IconEdit,
  IconForward,
  IconPlus,
  IconRight,
  IconTrash,
} from '@/components';
import {
  changeSessionTitle,
  clearSession,
  deleteSession,
  generateConv,
  getHistory,
  sendFeed,
} from '@/service/home';
import type { IConversation } from '@/types';
import { ElMessage } from 'element-plus';
import _ from 'lodash';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const store = useStore('global');
const { isPc, userInfo } = store.state;
const router = useRouter();
interface State {
  /**
   * 被选中的对话id
   */
  selectConvId: number | undefined;
  /**
   * 标题暂存
   */
  convTitletmp: string | undefined;
}
const props = defineProps<{
  conversations: IConversation[];
  titleInputBlur: (idx: number, conv: any) => void;
  cancelChangeConvTitle: (idx: number, conv: any) => void;
  cancelDelConv: (idx: number, conv: any) => void;
  changeTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
  onChangeSessionId: (id: number | undefined) => void;
}>();
const { proxy } = getCurrentInstance() as any;
const history = ref<Array<IConversation>>([]);
const state = reactive<State>({
  selectConvId: -1,
  convTitletmp: '',
});
const getHistoryFunc = async (idx?: number) => {
  await getHistory().then((res) => {
    if (res.code === 'SUCCESS') {
      const data = res.data.list?.slice(0, 10);
      history.value = data;
      idx && selectConversation(idx);
    }
  });
};
const setHistoryTitle = (idx: number, title: string) => {
  const value = history.value;
  value.forEach((item) => {
    if (item.idx === idx) {
      item.title = title;
    }
  });
  history.value = value;
};
onMounted(() => {
  getHistoryFunc();
});
/**
 * 选中会话
 * @param idx
 */
function selectConversation(idx: number | undefined) {
  state.selectConvId = idx;
  props.onChangeSessionId(idx);
}
/**
 * 删除会话
 */
function delConv(idx: number | undefined) {
  deleteSession({ sessionId: Number(idx) }).then((res) => {
    if (res.code === 'SUCCESS') {
      const _conversations = _.cloneDeep(history.value);
      _.remove(_conversations, (o: IConversation) => o.idx === idx);
      history.value = _conversations;
      state.selectConvId = -1;
      props.onChangeSessionId(-1);
    }
  });
}
/**
 * 编辑标题
 */
function changeConvTitle(cidx: number, conv: IConversation) {
  changeSessionTitle({
    sessionId: Number(conv.idx),
    title: String(state.convTitletmp),
  }).then((res) => {
    if (res.code === 'SUCCESS') {
      state.convTitletmp = '';
      conv.editable = false;
      getHistoryFunc(conv.idx);
    }
  });
}
function changeConvTitletmp(title: string) {
  state.convTitletmp = title;
}

/**
 * 清空会话
 */
function clearConversations() {
  clearSession().then((res) => {
    if (res.code === 'SUCCESS') {
      history.value = [];
      state.selectConvId = -1;
    }
  });
}
// 打开反馈弹窗
function openFeedModal() {
  proxy
    .$prompt(
      '请输入反馈内容，<span>更详细反馈请点击<a style="color: blue" href="https://www.wjx.cn/vm/h0QgTiI.aspx#" target="_blank">这里</a><span>',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{1,100}$/,
        inputType: 'textarea',
        inputErrorMessage: '反馈内容长度必须介于 1 和 100 之间',
        dangerouslyUseHTMLString: true,
      }
    )
    .then(({ value }: { value: string }) => {
      submitFeed(value);
    })
    .catch(() => {});
}
/**
 * 提交反馈
 */
function submitFeed(content: string) {
  sendFeed({ content: content }).then((res) => {
    if (res.code === 'SUCCESS') {
      ElMessage.success(res.message);
    }
  });
}
/**
 * 保存会话
 */
function saveConversations() {}
/**
 * 新建会话
 */
async function newChat(idx?: number) {
  if (idx) {
    await getHistoryFunc(idx);
  } else {
    await generateConv({}).then((res) => {
      if (res.code === 'SUCCESS') {
        const newId = res.data;
        state.selectConvId = newId;
        props.onChangeSessionId(newId);
        history.value = [
          { idx: newId, title: `新会话` },
          ...history.value,
        ]?.splice(0, 10);
      }
    });
  }
}
/**
 * 开启编辑标题
 */
function openEditTitle(conv: IConversation) {
  state.convTitletmp = conv.title;
  conv.editable = true;
  setTimeout(() => {
    document.getElementById('titleInput')?.focus();
  }, 150);
}
defineExpose({
  newChat,
  setHistoryTitle,
});
</script>
<template>
  <div
    class="dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col left-menu"
  >
    <div class="flex h-full min-h-0 flex-col">
      <div
        ref="menu"
        class="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20"
      >
        <nav ref="navEle" class="flex h-full flex-1 flex-col space-y-1 p-2">
          <a
            @click.stop="
              () => {
                newChat();
              }
            "
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
          >
            <IconPlus />新建会话
          </a>

          <!-- 对话列表 -->
          <div
            class="flex-col flex-1 overflow-y-auto border-b border-white/20"
            style="padding-bottom: 5px"
          >
            <div class="flex flex-col gap-2 text-gray-100 text-sm">
              <template v-for="(conversation, cidx) in history">
                <div
                  v-if="conversation.editable"
                  class="m-focus flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer hover:pr-14 break-all pr-14 bg-gray-800 hover:bg-gray-800"
                >
                  <IconChat />
                  <input
                    id="titleInput"
                    :value="state.convTitletmp"
                    @input="(e: Event) => changeConvTitletmp((e.target as any)?.value)"
                    @blur="titleInputBlur(cidx, conversation)"
                    type="text"
                    class="text-sm border-none bg-transparent p-0 m-0 w-full mr-0"
                    autofocus="true"
                  />
                  <div class="absolute flex right-1 z-10 text-gray-300 visible">
                    <button
                      @click="changeConvTitle(cidx, conversation)"
                      class="p-1 hover:text-white"
                    >
                      <IconRight />
                    </button>
                    <button
                      @click="cancelChangeConvTitle(cidx, conversation)"
                      class="p-1 hover:text-white"
                    >
                      <IconDelete />
                    </button>
                  </div>
                </div>

                <a
                  v-else-if="conversation.delete"
                  @blur="cancelDelConv(cidx, conversation)"
                  class="m-focus flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all pr-14 bg-gray-800 hover:bg-gray-800 group"
                >
                  <IconTrash />
                  <div
                    class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative"
                  >
                    要删除 "{{ conversation.title }}" 吗?
                    <div
                      class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800"
                    ></div>
                  </div>
                  <div class="absolute flex right-1 z-10 text-gray-300 visible">
                    <button
                      @click="delConv(conversation.idx)"
                      class="p-1 hover:text-white"
                    >
                      <IconRight />
                    </button>
                    <button
                      @click="cancelDelConv(cidx, conversation)"
                      class="p-1 hover:text-white"
                    >
                      <IconDelete />
                    </button>
                  </div>
                </a>

                <a
                  v-else
                  @click.stop.prevent="selectConversation(conversation.idx)"
                  :class="{
                    'bg-gray-800 hover:bg-gray-800 pr-14':
                      conversation.idx === state.selectConvId,
                    'hover:bg-[#2A2B32] hover:pr-4':
                      conversation.idx !== state.selectConvId,
                  }"
                  class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all group"
                >
                  <IconChat />
                  <div
                    class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative"
                  >
                    <Ellipsis :text="conversation.title" />
                    <div
                      :class="{
                        'from-gray-800':
                          conversation.idx === state.selectConvId,
                        'from-gray-900 group-hover:from-[#2A2B32]':
                          conversation.idx !== state.selectConvId,
                      }"
                      class="inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"
                    ></div>
                  </div>
                  <div
                    v-show="conversation.idx === state.selectConvId"
                    class="absolute flex right-1 z-10 text-gray-300 visible"
                  >
                    <button
                      @click="openEditTitle(conversation)"
                      class="p-1 hover:text-white"
                    >
                      <IconEdit />
                    </button>
                    <button
                      @click="conversation.delete = true"
                      class="p-1 hover:text-white"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </a>
              </template>
            </div>
          </div>

          <a
            v-if="history.length > 0"
            @click.stop.prevent="clearConversations"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconTrash />
            清空会话
          </a>
          <a
            v-if="userInfo.uid && userInfo.uid !== -1"
            @click.stop.prevent="openFeedModal"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconForward />
            我要反馈
          </a>
          <!-- <a
            @click="changeTheme(theme === 'light' ? 'dark' : 'light')"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconDark v-if="theme === 'light'" />
            <IconLight v-if="theme === 'dark'" />
            {{ theme === 'light' ? '暗色主题' : '亮色主题' }}
          </a> -->
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-menu {
  padding-top: 60px;
}
button {
  background-color: transparent;
}
</style>
