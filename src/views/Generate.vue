<template>
  <div class="generate">
    <van-nav-bar 
      title="填写信息" 
      left-arrow 
      @click-left="goBack"
      class="nav-bar"
    />
    
    <div class="form-container">
      <!-- 基本信息 -->
      <div class="form-section">
        <h3>基本信息</h3>
        
        <div class="form-item">
          <label>姓氏</label>
          <input 
            v-model="formData.lastName" 
            type="text" 
            placeholder="请输入姓氏"
            class="custom-input"
          />
        </div>
        
        <div class="form-item">
          <label>性别</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="formData.gender" 
                value="male" 
                class="radio-input"
              />
              <span class="radio-text">男孩</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="formData.gender" 
                value="female" 
                class="radio-input"
              />
              <span class="radio-text">女孩</span>
            </label>
          </div>
        </div>
        
        <div class="form-item">
          <label>出生日期</label>
          <div 
            class="custom-cell" 
            @click="showDatePicker = true"
          >
            <span class="cell-text">{{ formData.birthDate || '请选择出生日期' }}</span>
            <span class="cell-arrow">></span>
          </div>
        </div>
        
        <div class="form-item">
          <label>出生时间</label>
          <div 
            class="custom-cell" 
            @click="showTimePicker = true"
          >
            <span class="cell-text">{{ formData.birthTime || '请选择出生时间' }}</span>
            <span class="cell-arrow">></span>
          </div>
        </div>
      </div>
      
      <!-- 取名偏好 -->
      <div class="form-section">
        <h3>取名偏好</h3>
        
        <div class="form-item">
          <label>字数</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="formData.nameLength" 
                :value="2" 
                class="radio-input"
              />
              <span class="radio-text">两个字</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="formData.nameLength" 
                :value="3" 
                class="radio-input"
              />
              <span class="radio-text">三个字</span>
            </label>
          </div>
        </div>
        
        <div class="form-item">
          <label>期望寓意</label>
          <textarea 
            v-model="formData.meaning" 
            placeholder="比如：聪明、健康、快乐、成功等"
            class="custom-textarea"
            rows="3"
          ></textarea>
        </div>
        
        <div class="form-item">
          <label>避讳字</label>
          <input 
            v-model="formData.avoidChars" 
            type="text" 
            placeholder="请输入需要避开的字，用逗号分隔"
            class="custom-input"
          />
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="action-section">
        <button 
          @click="generateNames"
          :disabled="loading"
          class="generate-btn"
        >
          {{ loading ? '生成中...' : '生成名字' }}
        </button>
      </div>
    </div>
    
    <!-- 日期选择器 -->
    <van-calendar 
      v-model:show="showDatePicker" 
      @confirm="onDateConfirm"
      :min-date="minDate"
      :max-date="maxDate"
    />
    
    <!-- 时间选择器 -->
    <van-popup v-model:show="showTimePicker" position="bottom" round>
      <div class="time-picker-container">
        <div class="time-picker-header">
          <div class="cancel-btn" @click="showTimePicker = false">取消</div>
          <div class="time-picker-title">选择时间</div>
          <div class="confirm-btn" @click="confirmTime">确认</div>
        </div>
        <div class="time-picker-content">
          <div class="time-column">
            <div class="time-label">小时</div>
            <div class="time-options">
              <div 
                v-for="hour in 24" 
                :key="hour-1" 
                :class="['time-option', selectedHour === hour-1 ? 'selected' : '']"
                @click="selectedHour = hour-1"
              >
                {{ String(hour-1).padStart(2, '0') }}
              </div>
            </div>
          </div>
          <div class="time-column">
            <div class="time-label">分钟</div>
            <div class="time-options">
              <div 
                v-for="minute in 12" 
                :key="(minute-1)*5" 
                :class="['time-option', selectedMinute === (minute-1)*5 ? 'selected' : '']"
                @click="selectedMinute = (minute-1)*5"
              >
                {{ String((minute-1)*5).padStart(2, '0') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const formData = reactive({
  lastName: '',
  gender: 'male',
  birthDate: '',
  birthTime: '',
  nameLength: 2,
  meaning: '',
  avoidChars: ''
})

const showDatePicker = ref(false)
const showTimePicker = ref(false)
const selectedHour = ref(12)
const selectedMinute = ref(0)
const loading = ref(false)

const minDate = new Date(2000, 0, 1)
const maxDate = new Date(2030, 11, 31)

const goBack = () => {
  router.back()
}

const onDateConfirm = (date) => {
  formData.birthDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  showDatePicker.value = false
}

const confirmTime = () => {
  formData.birthTime = `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`
  showTimePicker.value = false
}

const generateNames = () => {
  if (!formData.lastName.trim()) {
    showToast('请输入姓氏')
    return
  }
  
  if (!formData.birthDate) {
    showToast('请选择出生日期')
    return
  }
  
  loading.value = true
  
  // 模拟生成名字的过程
  setTimeout(() => {
    // 存储表单数据到本地存储
    localStorage.setItem('namingFormData', JSON.stringify(formData))
    
    loading.value = false
    router.push('/results')
  }, 1500)
}
</script>

<style scoped>
.generate {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

.nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-container {
  padding: 16px;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.form-item {
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item label {
  display: block;
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.custom-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.custom-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.custom-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  transition: all 0.3s ease;
  background: #fafafa;
  font-family: inherit;
}

.custom-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.radio-label:hover {
  border-color: #667eea;
  background: white;
}

.radio-input {
  margin-right: 6px;
  cursor: pointer;
}

.radio-text {
  font-size: 16px;
  color: #666;
  user-select: none;
}

.radio-input:checked + .radio-text {
  color: #667eea;
  font-weight: 600;
}

.custom-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.custom-cell:hover {
  border-color: #667eea;
  background: white;
}

.cell-text {
  font-size: 16px;
  color: #333;
}

.cell-arrow {
  font-size: 16px;
  color: #999;
  transition: transform 0.3s ease;
}

.custom-cell:active .cell-arrow {
  transform: rotate(90deg);
}

.action-section {
  padding: 20px 0;
}

.generate-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* 自定义时间选择器样式 */
.time-picker-container {
  background: white;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.time-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.cancel-btn, .confirm-btn {
  padding: 8px 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.cancel-btn {
  color: #999;
  background: #f5f5f5;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.confirm-btn {
  color: white;
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.confirm-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.time-picker-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.time-picker-content {
  display: flex;
  padding: 20px;
  height: 300px;
}

.time-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.time-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.time-options {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.time-option {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: all 0.3s ease;
}

.time-option:hover {
  background: #f8f9fa;
  color: #333;
}

.time-option.selected {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  font-weight: 600;
}

/* 滚动条样式 */
.time-options::-webkit-scrollbar {
  width: 4px;
}

.time-options::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.time-options::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.time-options::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>