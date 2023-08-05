<script setup lang="ts">
/*
 *@description: 左侧菜单
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 15:59:07
 */
import {
  IconDark,
  IconForward,
  IconGame,
  IconLight,
  IconPlus,
  IconTrash,
} from '@/components/icons';
defineProps<{
  newChat: () => void;
  conversations: any[];
  convTitletmp: string;
  changeConvTitletmp: (tem: string) => void;
  titleInputBlur: (idx: number, conv: any) => void;
  changeConvTitle: (idx: number, conv: any) => void;
  cancelChangeConvTitle: (idx: number, conv: any) => void;
  cancelDelConv: (idx: number, conv: any) => void;
  delConv: (idx: number) => void;
  selectConversation: (conv: any, judge: boolean) => void;
  editTitle: (idx: number, conv: any) => void;
  clearConversations: () => void;
  changeTheme: (theme: 'light' | 'dark') => void;
  theme: 'light' | 'dark';
}>();
</script>
<template>
  <div
    class="dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col"
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
            <IconPlus />
            New chat
          </a>

          <!-- 对话列表 -->
          <div
            class="flex-col flex-1 overflow-y-auto border-b border-white/20"
            style="padding-bottom: 5px"
          >
            <div class="flex flex-col gap-2 text-gray-100 text-sm">
              <template v-for="(conversation, cidx) in conversations">
                <div
                  v-if="conversation.editable"
                  class="m-focus flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer hover:pr-14 break-all pr-14 bg-gray-800 hover:bg-gray-800"
                >
                  <svg
                    stroke="currentColor"
                    fill="none"
                    stroke-width="2"
                    viewBox="0 0 24 24"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="h-4 w-4 flex-shrink-0"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    ></path>
                  </svg>
                  <input
                    id="titleInput"
                    :value="convTitletmp"
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
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button
                      @click="cancelChangeConvTitle(cidx, conversation)"
                      class="p-1 hover:text-white"
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
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
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
                    Delete "{{ conversation.title }}"?
                    <div
                      class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800"
                    ></div>
                  </div>
                  <div class="absolute flex right-1 z-10 text-gray-300 visible">
                    <button @click="delConv(cidx)" class="p-1 hover:text-white">
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
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    <button
                      @click="cancelDelConv(cidx, conversation)"
                      class="p-1 hover:text-white"
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
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </a>

                <a
                  v-else
                  @click.stop.prevent="selectConversation(conversation, true)"
                  :class="{
                    'bg-gray-800 hover:bg-gray-800 pr-14':
                      conversation.selected,
                    'hover:bg-[#2A2B32] hover:pr-4': !conversation.selected,
                  }"
                  class="flex py-3 px-3 items-center gap-3 relative rounded-md cursor-pointer break-all group"
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
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    ></path>
                  </svg>
                  <div
                    class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative"
                  >
                    {{ conversation.title }}
                    <div
                      :class="{
                        'from-gray-800': conversation.selected,
                        'from-gray-900 group-hover:from-[#2A2B32]':
                          !conversation.selected,
                      }"
                      class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l"
                    ></div>
                  </div>
                  <div
                    v-show="conversation.selected"
                    class="absolute flex right-1 z-10 text-gray-300 visible"
                  >
                    <button
                      @click="editTitle(cidx, conversation)"
                      class="p-1 hover:text-white"
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
                        <path d="M12 20h9"></path>
                        <path
                          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                        ></path>
                      </svg>
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
            v-if="conversations.length > 0"
            @click.stop.prevent="clearConversations"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconTrash />
            Clear conversations
          </a>
          <a
            @click="changeTheme(theme === 'light' ? 'dark' : 'light')"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconDark v-if="theme === 'light'" />
            <IconLight v-if="theme === 'dark'" />
            {{ theme === 'light' ? 'Dark mode' : 'Light mode' }}
          </a>
          <a
            href="https://discord.gg/openai"
            target="_blank"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconGame />
            OpenAI Discord</a
          >
          <a
            href="https://help.openai.com/en/collections/3742473-chatgpt"
            target="_blank"
            class="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
          >
            <IconForward />
            Updates &amp; FAQ</a
          >
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
