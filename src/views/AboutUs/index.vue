<script setup lang="ts">
/*
 *@description: about us
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-06 15:53:36
 */
</script>
<template>
  <div class="content">
    <img class="content-logo" src="@/assets/imgs/logo_cover.png" />
    <div class="content-text">
      在“教材建设、课程共享和平台增效”三位一体的人工智能教育教学新模式的基础上，浙江大学与高等教育出版社联合推出人工智能领域大模型
      <blod class="blod-text">“智海-三乐（wisdomBot）”</blod>
      ，充分利用智能技术加快推动人才培养模式、教学方法改革，进而形成数字化和智能化的教育教学、科学研究基座能力。三乐将于23年秋冬学期在浙江大学图灵班及101核心课程《人工智能引论》试点高校的教学过程中进行试用，为师生提供智能问答、试题生成、学习导航等功能。
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-between: center;
  display: flex;
  flex-direction: column;
  padding: 0px 20%;

  &-logo {
    width: 80%;
    height: 400px;
    object-fit: cover;
  }
  &-text {
    width: 100%;
    font-size: 20px;
  }
  .blod-text {
    font-weight: 600;
  }
}
@media (max-width: 640px) {
  .content {
    padding: 12px;
    padding-bottom: 20vh;
    &-logo {
      width: 80%;
      object-fit: contain;
    }
  }
}
</style>
