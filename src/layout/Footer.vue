<script setup lang="ts">
/*
 *@description: footer
 *@author: progerchai
 *@email: progerchai@gmail.com
 *@date: 2023-08-17 21:24:09
 */
const footerLinks = [
  { name: '浙江大学', link: 'https://www.zju.edu.cn/' },
  { name: '高教社', link: 'https://www.hep.com.cn/' },
  { name: '阿里云', link: 'https://www.aliyun.com/' },
  { name: '华院计算', link: 'http://unidt.cn/' },
  { name: '浙大上海高研院', link: 'http://sias.zju.edu.cn/' },
  { name: '智海', link: 'https://aiplusx.com.cn/' },
];
</script>
<template>
  <div class="bg-gray-900 footer">
    <a
      class="footer-item"
      v-for="{ name, link } in footerLinks"
      target="_blank"
      :href="link"
    >
      {{ name }}
    </a>
  </div>
</template>

<style scoped lang="scss">
.footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  left: 0px;
  line-height: 36px;
  display: flex;
  justify-content: flex-end;
  padding-right: 5%;
  align-items: center;
  &-item {
    margin-right: 24px;
    color: #999;
    &:hover {
      color: #1d57ee;
    }
  }
}
</style>
