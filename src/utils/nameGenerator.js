import { auspiciousChars, calculateBaZiElements, getMissingElements, checkPhoneticMatch, checkShapeMatch } from '../data/characters.js'

export class NameGenerator {
  constructor(formData) {
    this.formData = formData
    this.lastName = formData.lastName
    this.gender = formData.gender
    this.birthDate = formData.birthDate
    this.birthTime = formData.birthTime
    this.nameLength = formData.nameLength
    this.meaning = formData.meaning
    this.avoidChars = formData.avoidChars ? formData.avoidChars.split(',').map(c => c.trim()) : []
    
    // 计算五行八字
    this.elements = calculateBaZiElements(this.birthDate, this.birthTime)
    this.missingElements = getMissingElements(this.elements)
    
    // 获取合适的字库
    this.charLibrary = auspiciousChars[this.gender] || auspiciousChars.male
  }
  
  // 生成名字
  generateNames() {
    const names = []
    const attempts = 100 // 尝试生成的次数
    
    for (let i = 0; i < attempts; i++) {
      const name = this.generateSingleName()
      if (name && !this.isDuplicateName(names, name)) {
        names.push(name)
        if (names.length >= 20) break // 生成20个名字
      }
    }
    
    // 按分数排序
    return names.sort((a, b) => b.totalScore - a.totalScore)
  }
  
  // 生成单个名字
  generateSingleName() {
    const chars = this.selectChars()
    if (!chars || chars.length < this.nameLength - 1) {
      return null
    }
    
    const name = {
      fullName: this.lastName + chars.join(''),
      chars: chars,
      scores: {},
      meanings: [],
      elements: [],
      analysis: {}
    }
    
    // 计算各项分数
    name.scores.meaningScore = this.calculateMeaningScore(chars)
    name.scores.elementScore = this.calculateElementScore(chars)
    name.scores.phoneticScore = this.calculatePhoneticScore(chars)
    name.scores.shapeScore = this.calculateShapeScore(chars)
    name.scores.totalScore = this.calculateTotalScore(name.scores)
    
    // 生成名字分析
    name.meanings = chars.map(char => {
      const charInfo = this.charLibrary.find(c => c.char === char)
      return charInfo ? charInfo.meaning : '寓意美好'
    })
    
    name.elements = chars.map(char => {
      const charInfo = this.charLibrary.find(c => c.char === char)
      return charInfo ? charInfo.element : '木'
    })
    
    name.analysis = this.generateAnalysis(name)
    
    return name
  }
  
  // 选择合适的字
  selectChars() {
    const selectedChars = []
    const availableChars = this.charLibrary.filter(char => 
      !this.avoidChars.includes(char.char)
    )
    
    // 优先选择补五行的字
    if (this.missingElements.length > 0) {
      const neededElement = this.missingElements[0].element
      const elementChars = availableChars.filter(char => char.element === neededElement)
      
      if (elementChars.length > 0) {
        const firstChar = elementChars[Math.floor(Math.random() * elementChars.length)]
        selectedChars.push(firstChar.char)
      }
    }
    
    // 选择剩余的字
    const remainingChars = availableChars.filter(char => 
      !selectedChars.includes(char.char)
    )
    
    while (selectedChars.length < this.nameLength - 1 && remainingChars.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingChars.length)
      selectedChars.push(remainingChars[randomIndex].char)
      remainingChars.splice(randomIndex, 1)
    }
    
    return selectedChars
  }
  
  // 计算寓意分数
  calculateMeaningScore(chars) {
    let totalScore = 0
    for (const char of chars) {
      const charInfo = this.charLibrary.find(c => c.char === char)
      if (charInfo) {
        totalScore += charInfo.score
      }
    }
    return Math.round(totalScore / chars.length)
  }
  
  // 计算五行分数
  calculateElementScore(chars) {
    let score = 50 // 基础分数
    
    const nameElements = chars.map(char => {
      const charInfo = this.charLibrary.find(c => c.char === char)
      return charInfo ? charInfo.element : '木'
    })
    
    // 检查是否补了缺失的五行
    for (const missing of this.missingElements) {
      if (nameElements.includes(missing.element)) {
        score += 20
      }
    }
    
    // 检查五行平衡
    const elementCount = {}
    for (const element of nameElements) {
      elementCount[element] = (elementCount[element] || 0) + 1
    }
    
    const maxCount = Math.max(...Object.values(elementCount))
    const minCount = Math.min(...Object.values(elementCount))
    
    if (maxCount - minCount <= 1) {
      score += 15 // 五行平衡加分
    }
    
    return Math.min(score, 100)
  }
  
  // 计算字音分数
  calculatePhoneticScore(chars) {
    let score = 80 // 基础分数
    
    // 检查字音搭配
    for (let i = 0; i < chars.length - 1; i++) {
      if (!checkPhoneticMatch(chars[i], chars[i + 1])) {
        score -= 20
      }
    }
    
    return Math.max(score, 0)
  }
  
  // 计算字形分数
  calculateShapeScore(chars) {
    let score = 80 // 基础分数
    
    // 检查字形搭配
    for (let i = 0; i < chars.length - 1; i++) {
      if (!checkShapeMatch(chars[i], chars[i + 1])) {
        score -= 15
      }
    }
    
    // 检查字形复杂度
    const complexChars = chars.filter(char => char.length > 20)
    if (complexChars.length > 0) {
      score -= complexChars.length * 5
    }
    
    return Math.max(score, 0)
  }
  
  // 计算总分
  calculateTotalScore(scores) {
    const weights = {
      meaningScore: 0.4,
      elementScore: 0.3,
      phoneticScore: 0.2,
      shapeScore: 0.1
    }
    
    const total = 
      scores.meaningScore * weights.meaningScore +
      scores.elementScore * weights.elementScore +
      scores.phoneticScore * weights.phoneticScore +
      scores.shapeScore * weights.shapeScore
    
    return Math.round(total)
  }
  
  // 生成名字分析
  generateAnalysis(name) {
    const analysis = {
      overall: '',
      fiveElements: '',
      suggestions: []
    }
    
    // 总体评价
    if (name.scores.totalScore >= 90) {
      analysis.overall = '这是一个非常优秀的名字，寓意美好，五行协调'
    } else if (name.scores.totalScore >= 80) {
      analysis.overall = '这是一个很好的名字，寓意较好，五行较为协调'
    } else if (name.scores.totalScore >= 70) {
      analysis.overall = '这是一个不错的名字，寓意尚可，五行基本协调'
    } else {
      analysis.overall = '这个名字基本可用，建议考虑其他更好的选择'
    }
    
    // 五行分析
    const elementCount = {}
    for (const element of name.elements) {
      elementCount[element] = (elementCount[element] || 0) + 1
    }
    
    analysis.fiveElements = `名字五行构成：${Object.entries(elementCount).map(([e, c]) => `${e}${c}个`).join('，')}`
    
    // 补充建议
    if (this.missingElements.length > 0) {
      analysis.suggestions.push(`名字补齐了缺失的${this.missingElements[0].element}五行`)
    }
    
    if (name.scores.phoneticScore < 70) {
      analysis.suggestions.push('注意字音搭配，建议读出来试试')
    }
    
    if (name.scores.shapeScore < 70) {
      analysis.suggestions.push('注意字形搭配，避免过于复杂')
    }
    
    return analysis
  }
  
  // 检查是否重复名字
  isDuplicateName(names, name) {
    return names.some(existingName => existingName.fullName === name.fullName)
  }
}