<script setup lang="ts">
/*
 *@description: 左侧菜单
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 15:59:07
 */
import {
  IconChat,
  IconDark,
  IconDelete,
  IconEdit,
  IconForward,
  IconLight,
  IconPlus,
  IconRight,
  IconTrash,
} from '@/components/icons';
import { generateConv, getHistory } from '@/service/home';
import type { IConversation } from '@/types';
import _ from 'lodash';
import { onMounted, reactive, ref } from 'vue';
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
  changeConvTitletmp: (tem: string) => void;
  titleInputBlur: (idx: number, conv: any) => void;
  changeConvTitle: (idx: number, conv: any) => void;
  cancelChangeConvTitle: (idx: number, conv: any) => void;
  cancelDelConv: (idx: number, conv: any) => void;
  changeTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
  onChangeSessionId: (id: number | undefined) => void;
}>();
const accountId = -1;
const history = ref<Array<IConversation>>([]);
const state = reactive<State>({
  selectConvId: 0,
  convTitletmp: '',
});
onMounted(() => {
  getHistory({ accountId }).then((res) => {
    if (res.code === 'SUCCESS') {
      history.value = res.data.list?.splice(0, 10);
      state.selectConvId = _.get(res, 'data.list[0].idx', 0);
    }
  });
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
  const _conversations = _.cloneDeep(history.value);
  _.remove(_conversations, (o: IConversation) => o.idx === idx);
  history.value = _conversations?.splice(0, 10);
}
/**
 * 清空会话
 */
function clearConversations() {
  history.value = [];
  state.selectConvId = 0;
  saveConversations();
}
/**
 * 保存会话
 */
function saveConversations() {}
/**
 * 新建会话
 */
function newChat() {
  generateConv({ accountId }).then((res) => {
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
/**
 * 编辑标题
 */
function editTitle(idx: number, conv: IConversation) {
  state.convTitletmp = conv.title;
  conv.editable = true;
  history.value[idx] = conv;
  // TODO: 请求接口
  setTimeout(() => {
    document.getElementById('titleInput')?.focus();
  }, 150);
}
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
            @click.stop="newChat"
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
                    {{ conversation.title }}
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
                      @click="editTitle(cidx, conversation)"
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
            @click="changeTheme(theme === 'light' ? 'dark' : 'light')"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconDark v-if="theme === 'light'" />
            <IconLight v-if="theme === 'dark'" />
            {{ theme === 'light' ? '暗色主题' : '亮色主题' }}
          </a>
          <a
            href="https://aiplusx.com.cn/"
            target="_blank"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconForward />
            智海</a
          >
          <a
            href="https://www.hep.com.cn/"
            target="_blank"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconForward />
            高教出版社</a
          >
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.left-menu {
  padding-top: 60px;
}
</style>
