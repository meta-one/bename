<template>
  <div class="results">
    <div class="container">
      <div class="page-header">
        <van-nav-bar 
          title="取名结果" 
          left-arrow 
          @click-left="goBack"
          class="nav-bar"
        />
      </div>
      
      <div class="summary-section" v-if="!loading">
        <div class="card">
          <h3>五行八字分析</h3>
          <div class="elements-analysis">
            <div class="element-item" v-for="(count, element) in elements" :key="element">
              <span class="element-name">{{ element }}</span>
              <span class="element-count">{{ count }}</span>
            </div>
          </div>
          <div class="missing-elements" v-if="missingElements.length > 0">
            <p>建议补充五行：<span v-for="missing in missingElements" :key="missing.element" class="missing-element">
              {{ missing.element }}({{ missing.count }})
            </span></p>
          </div>
        </div>
      </div>
      
      <div class="loading-section" v-if="loading">
        <van-loading type="spinner" size="24px">正在生成名字...</van-loading>
      </div>
      
      <div class="results-section" v-else>
        <div class="result-item" v-for="(name, index) in names" :key="index">
          <div class="result-header">
            <div class="name-display">
              <span class="family-name">{{ formData.lastName }}</span>
              <span class="given-name">{{ name.fullName.replace(formData.lastName, '') }}</span>
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
              <span class="detail-label">分析：</span>
              <span class="detail-value">{{ name.analysis.overall }}</span>
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
              type="success" 
              plain
              @click="addToFavorites(name)"
            >
              收藏
            </van-button>
            <van-button 
              size="small" 
              type="warning" 
              plain
              @click="shareName(name)"
            >
              分享
            </van-button>
          </div>
        </div>
      </div>
      
      <div class="action-section">
        <van-button 
          type="primary" 
          size="large" 
          round 
          block
          @click="regenerateNames"
          :loading="loading"
          class="regenerate-btn"
        >
          重新生成
        </van-button>
        <van-button 
          type="default" 
          size="large" 
          round 
          block
          @click="goBack"
          class="back-btn"
        >
          返回修改
        </van-button>
      </div>
    </div>
    
    <!-- 详细分析弹窗 -->
    <van-popup v-model:show="showDetailPopup" position="bottom" :style="{ height: '70%' }">
      <div class="detail-popup">
        <div class="popup-header">
          <h3>{{ selectedName?.fullName }}</h3>
          <van-icon name="cross" @click="showDetailPopup = false" />
        </div>
        <div class="popup-content" v-if="selectedName">
          <div class="analysis-section">
            <h4>综合评价</h4>
            <p>{{ selectedName.analysis.overall }}</p>
          </div>
          
          <div class="analysis-section">
            <h4>五行分析</h4>
            <p>{{ selectedName.analysis.fiveElements }}</p>
          </div>
          
          <div class="analysis-section">
            <h4>各项得分</h4>
            <div class="score-breakdown">
              <div class="score-item">
                <span>寓意得分</span>
                <span>{{ selectedName.scores.meaningScore }}分</span>
              </div>
              <div class="score-item">
                <span>五行得分</span>
                <span>{{ selectedName.scores.elementScore }}分</span>
              </div>
              <div class="score-item">
                <span>字音得分</span>
                <span>{{ selectedName.scores.phoneticScore }}分</span>
              </div>
              <div class="score-item">
                <span>字形得分</span>
                <span>{{ selectedName.scores.shapeScore }}分</span>
              </div>
            </div>
          </div>
          
          <div class="analysis-section">
            <h4>建议</h4>
            <ul>
              <li v-for="(suggestion, index) in selectedName.analysis.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { NameGenerator } from '../utils/nameGenerator.js'

const router = useRouter()

const formData = reactive({})
const elements = ref({})
const missingElements = ref([])
const names = ref([])
const loading = ref(true)
const showDetailPopup = ref(false)
const selectedName = ref(null)

// 计算星级评分
const calculateStars = (score) => {
  return Math.round(score / 20) / 10
}

onMounted(async () => {
  // 从本地存储获取表单数据
  const savedData = localStorage.getItem('namingFormData')
  if (savedData) {
    Object.assign(formData, JSON.parse(savedData))
  }
  
  if (!formData.lastName) {
    showToast('请先填写基本信息')
    router.push('/generate')
    return
  }
  
  await generateNames()
})

const generateNames = async () => {
  loading.value = true
  
  try {
    const generator = new NameGenerator(formData)
    elements.value = generator.elements
    missingElements.value = generator.missingElements
    names.value = generator.generateNames()
    
    // 添加星级评分
    names.value.forEach(name => {
      name.stars = calculateStars(name.scores.totalScore)
    })
    
  } catch (error) {
    showToast('生成名字失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const regenerateNames = async () => {
  await generateNames()
}

const showDetails = (name) => {
  selectedName.value = name
  showDetailPopup.value = true
}

const addToFavorites = (name) => {
  // 获取现有收藏
  let favorites = JSON.parse(localStorage.getItem('favoriteNames') || '[]')
  
  // 检查是否已收藏
  if (!favorites.some(fav => fav.fullName === name.fullName)) {
    favorites.push({
      ...name,
      addedAt: new Date().toISOString()
    })
    localStorage.setItem('favoriteNames', JSON.stringify(favorites))
    showToast('收藏成功')
  } else {
    showToast('已经收藏过了')
  }
}

const shareName = (name) => {
  const shareText = `给宝宝取了个好名字：${name.fullName}，寓意：${name.meanings.join('，')}`
  
  if (navigator.share) {
    navigator.share({
      title: '中文取名神器',
      text: shareText
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
      showToast('已复制到剪贴板')
    })
  }
}
</script>

<style scoped>
.results {
  min-height: 100vh;
  background: #f5f5f5;
}

.nav-bar {
  background: transparent;
}

.summary-section {
  padding: 16px;
}

.elements-analysis {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.element-item {
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 50px;
}

.element-name {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.element-count {
  font-size: 14px;
  color: #666;
}

.missing-elements {
  margin-top: 15px;
  padding: 10px;
  background: #fff3cd;
  border-radius: 6px;
  border-left: 4px solid #ffc107;
}

.missing-element {
  color: #856404;
  font-weight: 500;
  margin-right: 10px;
}

.loading-section {
  text-align: center;
  padding: 60px 0;
}

.results-section {
  padding: 0 16px;
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
  margin-right: 5px;
}

.given-name {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
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
  min-width: 60px;
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

.action-section {
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.regenerate-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  font-size: 16px;
  font-weight: 600;
}

.back-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.detail-popup {
  height: 100%;
  overflow-y: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.popup-header h3 {
  font-size: 20px;
  color: #333;
}

.popup-content {
  padding: 20px;
}

.analysis-section {
  margin-bottom: 25px;
}

.analysis-section h4 {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.analysis-section p {
  line-height: 1.6;
  color: #666;
}

.score-breakdown {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.analysis-section ul {
  list-style: none;
  padding: 0;
}

.analysis-section li {
  padding: 5px 0;
  color: #666;
  position: relative;
  padding-left: 15px;
}

.analysis-section li::before {
  content: '•';
  color: #667eea;
  font-weight: bold;
  position: absolute;
  left: 0;
}
</style>