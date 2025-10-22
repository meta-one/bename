<template>
  <div class="favorites">
    <div class="container">
      <div class="page-header">
        <van-nav-bar 
          title="我的收藏" 
          left-arrow 
          @click-left="goBack"
          class="nav-bar"
        />
      </div>
      
      <div class="favorites-section" v-if="favorites.length > 0">
        <div class="result-item" v-for="(name, index) in favorites" :key="index">
          <div class="result-header">
            <div class="name-display">
              <span class="family-name">{{ name.fullName }}</span>
            </div>
            <div class="name-score">
              <van-rate v-model="name.stars" readonly allow-half />
              <span class="score-text">{{ name.scores.totalScore }}分</span>
            </div>
          </div>
          
          <div class="result-details">
            <div class="detail-row">
              <span class="detail-label">寓意：</span>
              <span class="detail-value">{{ name.meanings.join('，') }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">五行：</span>
              <span class="detail-value">{{ name.elements.join('，') }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">收藏时间：</span>
              <span class="detail-value">{{ formatDate(name.addedAt) }}</span>
            </div>
          </div>
          
          <div class="result-actions">
            <van-button 
              size="small" 
              type="primary" 
              plain
              @click="showDetails(name)"
            >
              详细分析
            </van-button>
            <van-button 
              size="small" 
              type="danger" 
              plain
              @click="removeFavorite(index)"
            >
              取消收藏
            </van-button>
          </div>
        </div>
      </div>
      
      <div class="empty-section" v-else>
        <van-empty description="暂无收藏的名字" />
        <van-button 
          type="primary" 
          size="large" 
          round 
          @click="goToGenerate"
          class="generate-btn"
        >
          去取名
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const favorites = ref([])

onMounted(() => {
  loadFavorites()
})

const loadFavorites = () => {
  favorites.value = JSON.parse(localStorage.getItem('favoriteNames') || '[]')
}

const goBack = () => {
  router.back()
}

const goToGenerate = () => {
  router.push('/generate')
}

const showDetails = (name) => {
  // 这里可以复用Results页面的详细分析逻辑
  showToast('详细分析功能开发中')
}

const removeFavorite = async (index) => {
  const confirmed = await showConfirmDialog({
    title: '确认取消收藏',
    message: '确定要取消收藏这个名字吗？'
  })
  
  if (confirmed) {
    favorites.value.splice(index, 1)
    localStorage.setItem('favoriteNames', JSON.stringify(favorites.value))
    showToast('已取消收藏')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.favorites {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  background: transparent;
}

.favorites-section {
  padding: 16px;
}

.result-item {
  margin-bottom: 16px;
  padding: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.name-display {
  display: flex;
  align-items: baseline;
}

.family-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.name-score {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.result-details {
  margin-bottom: 15px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
  line-height: 1.5;
}

.detail-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.detail-value {
  color: #333;
  flex: 1;
}

.result-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.empty-section {
  text-align: center;
  padding: 60px 20px;
}

.generate-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
}
</style>