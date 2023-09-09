<script setup lang="ts">
/*
 *@description: about us
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-06 15:53:36
 */
const linkDict = [
  {
    label: '浙江大学',
    link: 'https://www.zju.edu.cn/',
    logo: 'https://s1.imagehub.cc/images/2023/09/09/zju.png',
  },
  {
    label: '高教社',
    link: 'https://www.hep.com.cn/',
    logo: 'https://s1.imagehub.cc/images/2023/09/09/hep.png',
  },
  {
    label: '阿里云',
    link: 'https://www.aliyun.com/',
    logo: 'https://s1.imagehub.cc/images/2023/09/09/aliyun.png',
  },
  {
    label: '华院计算',
    link: 'http://unidt.cn/',
    logo: 'https://s1.imagehub.cc/images/2023/09/09/unidt.png',
  },
  {
    label: '智海',
    link: 'https://aiplusx.com.cn/',
    logo: 'https://s1.imagehub.cc/images/2023/09/09/zhihai.webp',
  },
];
</script>
<template>
  <div class="content">
    <img
      class="content-logo"
      src="https://s1.imagehub.cc/images/2023/08/21/logo_cover.png"
    />
    <div class="content-text">
      在“教材建设、课程共享和平台增效”三位一体的人工智能教育教学新模式的基础上，浙江大学与高等教育出版社联合阿里云、华院计算推出人工智能领域大模型
      <blod class="blod-text">“智海-三乐（wisdomBot）”</blod>
      ，充分利用智能技术加快推动人才培养模式、教学方法改革，进而形成数字化和智能化的教育教学、科学研究基座能力。三乐将于23年秋冬学期在浙江大学图灵班及101核心课程《人工智能引论》试点高校的教学过程中进行试用，为师生提供智能问答、试题生成、学习导航等功能。
    </div>
  </div>
  <div class="footer">
    <a
      class="footer-item"
      :href="item.link"
      target="_blank"
      v-for="item in linkDict"
    >
      <img class="footer-item-logo" :src="item.logo" :alt="item.label" />
      {{ item.label }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 0px 20%;
  padding-bottom: 120px;

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
    padding-bottom: 120px;
    &-logo {
      width: 80%;
      object-fit: contain;
    }
  }
}
.footer {
  // background-color: rgba(32, 33, 35, 1);
  background-color: #6f6f6f;
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding-top: 20px;
  padding-bottom: 20px;
  &-item + &-item {
    margin-left: 24px;
  }
  &-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &-logo {
      width: 140px;
      height: 100px;
      object-fit: contain;
    }
  }
}
</style>
