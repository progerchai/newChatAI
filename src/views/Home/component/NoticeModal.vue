<script setup lang="ts">
/*
 *@description: 进入提示弹窗
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-05 15:09:47
 */
const props = defineProps<{
  popupShow: boolean;
  onCancel: () => void;
}>();
</script>
<template>
  <div id="headlessui-portal-root" v-if="props.popupShow">
    <div data-headlessui-portal="">
      <button
        type="button"
        aria-hidden="true"
        style="
          position: fixed;
          top: 1px;
          left: 1px;
          width: 1px;
          height: 0px;
          padding: 0px;
          margin: -1px;
          overflow: hidden;
          clip: rect(0px, 0px, 0px, 0px);
          white-space: nowrap;
          border-width: 0px;
        "
      ></button>
      <div>
        <div
          class="relative z-50"
          id="headlessui-dialog-:r3:"
          role="dialog"
          aria-modal="true"
          data-headlessui-state="open"
          aria-labelledby="headlessui-dialog-title-:r5:"
        >
          <div
            class="fixed inset-0 bg-gray-500/90 transition-opacity dark:bg-gray-800/90"
          ></div>
          <div class="fixed inset-0 z-50 overflow-y-auto">
            <div
              class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
            >
              <div
                v-if="props.popupShow"
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:p-6 sm:max-w-lg opacity-100 translate-y-0 sm:scale-100"
                id="headlessui-dialog-panel-:r1:"
                data-headlessui-state="open"
              >
                <div class="flex items-center sm:flex">
                  <div class="mt-3 text-center sm:mt-0 sm:text-left"></div>
                </div>
                <div class="prose dark:prose-invert">
                  <div class="mb-5">
                    <h2 class="!mt-4 font-normal !mb-2">
                      <b>安全须知</b>
                    </h2>
                  </div>
                  <div class="flex gap-4 flex-col text-sm">
                    <div
                      class="flex p-4 bg-gray-50 dark:bg-white/5 rounded-md items-center gap-4 min-h-[71px]"
                    >
                      <div class="w-10 text-2xl text-center">🔬</div>
                      <div class="flex-1 leading-5">
                        当前服务体验仅供内部使用，服务生成的所有内容都是人工智能模型生成，我们对其生成内容的准确性，完整性和功能性不做任何保证，并且其生成的内容不代表我们的态度和观点。
                      </div>
                    </div>
                    <div
                      class="flex p-4 bg-gray-50 dark:bg-white/5 rounded-md items-center gap-4 min-h-[71px]"
                    >
                      <div class="w-10 text-2xl text-center">🚨</div>
                      <div class="flex-1 leading-5">
                        请尽量避免在应用中输入个人隐私数据，避免个人信息泄漏。
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-4 mt-6">
                    <button
                      @click="props.onCancel"
                      class="btn flex justify-center gap-2 btn-primary ml-auto"
                    >
                      我已阅读并知晓
                    </button>
                  </div>
                </div>
                <div
                  class="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row-reverse"
                ></div>
              </div>

              <div
                v-if="false"
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:p-6 sm:max-w-lg"
                id="headlessui-dialog-panel-:r4:"
                data-headlessui-state="open"
              >
                <div class="flex items-center sm:flex">
                  <div
                    class="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 bg-green-100"
                  >
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-6 w-6 text-green-700"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                      ></path>
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:text-left">
                    <h3
                      class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                      id="headlessui-dialog-title-:r5:"
                      data-headlessui-state="open"
                    >
                      Provide additional feedback
                    </h3>
                  </div>
                </div>
                <form>
                  <textarea
                    id="feedback-other"
                    placeholder="What would the ideal answer have been?"
                    rows="3"
                    class="mt-4 mb-1 w-full rounded-md dark:bg-gray-800 dark:focus:border-white dark:focus:ring-white"
                    tabindex="0"
                    style="height: 89.4815px; overflow-y: hidden"
                  ></textarea>
                </form>
                <div
                  class="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row-reverse"
                >
                  <button class="btn flex justify-center gap-2 btn-neutral">
                    Submit feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-hidden="true"
        style="
          position: fixed;
          top: 1px;
          left: 1px;
          width: 1px;
          height: 0px;
          padding: 0px;
          margin: -1px;
          overflow: hidden;
          clip: rect(0px, 0px, 0px, 0px);
          white-space: nowrap;
          border-width: 0px;
        "
      ></button>
    </div>
  </div>
</template>
