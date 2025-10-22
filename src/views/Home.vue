<template>
  <div class="home">
    <div class="container">
      <div class="logo-section">
        <h1 class="main-title">🏮 中文取名神器</h1>
        <p class="subtitle">为您的宝宝起一个吉祥如意的名字</p>
      </div>
      
      <div class="features">
        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3>生辰八字</h3>
          <p>结合出生时间，分析五行八字</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🔥</div>
          <h3>五行补缺</h3>
          <p>根据八字五行，智能补齐缺失</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>经典用字</h3>
          <p>精选传统吉祥用字</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>个性定制</h3>
          <p>满足个性化取名需求</p>
        </div>
      </div>
      
      <div class="action-section">
        <van-button 
          type="primary" 
          size="large" 
          round 
          block
          @click="startNaming"
          class="start-btn"
        >
          开始取名
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startNaming = () => {
  router.push('/generate')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.logo-section {
  text-align: center;
  padding: 60px 0 40px;
}

.main-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 60px;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.feature-card h3 {
  font-size: 18px;
  margin-bottom: 8px;
  font-weight: 600;
}

.feature-card p {
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
}

.action-section {
  padding: 0 20px 40px;
}

.start-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 18px;
  font-weight: 600;
  height: 50px;
  backdrop-filter: blur(10px);
}

.start-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>