<template>
  <div id="app">
    <router-view />
    
    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/generate" icon="add-o">取名</van-tabbar-item>
      <van-tabbar-item replace to="/favorites" icon="star-o">收藏</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const active = ref(0)

// 根据当前路由更新底部导航栏
watch(() => route.path, (newPath) => {
  switch (newPath) {
    case '/':
      active.value = 0
      break
    case '/generate':
      active.value = 1
      break
    case '/favorites':
      active.value = 2
      break
    case '/results':
      active.value = -1 // 结果页面不显示底部导航栏
      break
    default:
      active.value = 0
  }
})
</script>

<style>
#app {
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px; /* 为底部导航栏留出空间 */
}

/* 在results页面隐藏底部导航栏 */
.router-link-exact-active[href="/results"] + .van-tabbar {
  display: none;
}
</style>