<template>
  <!-- <div>页面未找到</div> -->
  <div id="notfound">
    <div class="notfound">
      <div class="notfound-404">
        <h1>Oops!</h1>
        <h2>404 - 页面找不到啦～</h2>
      </div>
      <a href="/">前往首页</a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#notfound {
  position: relative;
  height: 100vh;
  .notfound {
    max-width: 520px;
    width: 100%;
    line-height: 1.4;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    .notfound-404 {
      position: relative;
      height: 200px;
      margin: 0 auto 20px;
      z-index: -1;
    }
  }
}
</style>
