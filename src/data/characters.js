// 吉祥寓意用字库
export const auspiciousChars = {
  // 男孩用字
  male: [
    // 智慧类
    { char: '睿', meaning: '睿智，聪明', element: '金', score: 95 },
    { char: '智', meaning: '智慧，聪明', element: '火', score: 90 },
    { char: '哲', meaning: '哲学，智慧', element: '火', score: 88 },
    { char: '慧', meaning: '智慧，聪明', element: '水', score: 85 },
    { char: '博', meaning: '博学，广博', element: '水', score: 82 },
    
    // 品德类
    { char: '德', meaning: '道德，品德', element: '火', score: 92 },
    { char: '仁', meaning: '仁爱，仁慈', element: '金', score: 90 },
    { char: '义', meaning: '正义，义气', element: '木', score: 88 },
    { char: '信', meaning: '诚信，信誉', element: '金', score: 86 },
    { char: '孝', meaning: '孝顺，孝敬', element: '水', score: 84 },
    
    // 成功类
    { char: '杰', meaning: '杰出，卓越', element: '木', score: 94 },
    { char: '胜', meaning: '胜利，成功', element: '金', score: 91 },
    { char: '成', meaning: '成功，成就', element: '金', score: 89 },
    { char: '达', meaning: '发达，达观', element: '火', score: 87 },
    { char: '志', meaning: '志向，意志', element: '火', score: 85 },
    
    // 健康类
    { char: '健', meaning: '健康，强壮', element: '木', score: 90 },
    { char: '康', meaning: '健康，安康', element: '木', score: 88 },
    { char: '强', meaning: '强壮，坚强', element: '木', score: 86 },
    { char: '毅', meaning: '坚毅，毅力', element: '木', score: 84 },
    { char: '勇', meaning: '勇敢，勇猛', element: '土', score: 82 },
    
    // 财富类
    { char: '财', meaning: '财富，财宝', element: '金', score: 88 },
    { char: '富', meaning: '富有，富裕', element: '水', score: 86 },
    { char: '贵', meaning: '高贵，珍贵', element: '木', score: 84 },
    { char: '宝', meaning: '宝贝，宝物', element: '火', score: 82 },
    { char: '鑫', meaning: '财富兴盛', element: '金', score: 80 }
  ],
  
  // 女孩用字
  female: [
    // 美丽类
    { char: '美', meaning: '美丽，美好', element: '水', score: 92 },
    { char: '丽', meaning: '美丽，秀丽', element: '火', score: 90 },
    { char: '雅', meaning: '优雅，高雅', element: '木', score: 88 },
    { char: '妍', meaning: '美丽，妍丽', element: '水', score: 86 },
    { char: '婷', meaning: '婷婷玉立', element: '火', score: 84 },
    
    // 品德类
    { char: '淑', meaning: '淑女，贤淑', element: '水', score: 90 },
    { char: '慧', meaning: '智慧，聪明', element: '水', score: 88 },
    { char: '贤', meaning: '贤惠，贤良', element: '木', score: 86 },
    { char: '静', meaning: '安静，文静', element: '金', score: 84 },
    { char: '柔', meaning: '温柔，柔和', element: '木', score: 82 },
    
    // 花草类
    { char: '花', meaning: '花朵，美丽', element: '木', score: 86 },
    { char: '兰', meaning: '兰花，高雅', element: '木', score: 84 },
    { char: '梅', meaning: '梅花，坚强', element: '木', score: 82 },
    { char: '菊', meaning: '菊花，高洁', element: '木', score: 80 },
    { char: '莲', meaning: '莲花，纯洁', element: '木', score: 78 },
    
    // 珍宝类
    { char: '珍', meaning: '珍贵，珍爱', element: '火', score: 88 },
    { char: '珠', meaning: '珍珠，珍贵', element: '水', score: 86 },
    { char: '玉', meaning: '玉石，珍贵', element: '金', score: 84 },
    { char: '琳', meaning: '美玉，珍贵', element: '木', score: 82 },
    { char: '珊', meaning: '珊瑚，美丽', element: '金', score: 80 },
    
    // 快乐类
    { char: '乐', meaning: '快乐，欢乐', element: '火', score: 90 },
    { char: '欢', meaning: '欢乐，欢喜', element: '水', score: 88 },
    { char: '欣', meaning: '欣喜，欢欣', element: '木', score: 86 },
    { char: '悦', meaning: '喜悦，愉悦', element: '金', score: 84 },
    { char: '怡', meaning: '怡然，愉悦', element: '土', score: 82 }
  ]
}

// 五行相生相克关系
export const fiveElementsRelations = {
  相生: {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  },
  相克: {
    '木': '土',
    '土': '水',
    '水': '火',
    '火': '金',
    '金': '木'
  }
}

// 八字五行计算（简化版）
export function calculateBaZiElements(birthDate, birthTime) {
  // 这里实现一个简化的八字五行计算
  // 实际应用中需要更复杂的算法
  const elements = {
    '木': 2,
    '火': 1,
    '土': 2,
    '金': 1,
    '水': 2
  }
  
  // 根据出生时间微调五行
  const hour = parseInt(birthTime.split(':')[0])
  const month = parseInt(birthDate.split('-')[1])
  
  // 简单的季节五行调整
  if (month >= 2 && month <= 4) {
    elements['木'] += 1
    elements['火'] += 0.5
  } else if (month >= 5 && month <= 7) {
    elements['火'] += 1
    elements['土'] += 0.5
  } else if (month >= 8 && month <= 10) {
    elements['金'] += 1
    elements['水'] += 0.5
  } else {
    elements['水'] += 1
    elements['木'] += 0.5
  }
  
  return elements
}

// 获取缺失的五行
export function getMissingElements(elements) {
  const total = Object.values(elements).reduce((sum, val) => sum + val, 0)
  const average = total / 5
  const missing = []
  
  for (const [element, count] of Object.entries(elements)) {
    if (count < average) {
      missing.push({
        element,
        count: Math.round((average - count) * 10) / 10
      })
    }
  }
  
  return missing.sort((a, b) => b.count - a.count)
}

// 检查字音搭配
export function checkPhoneticMatch(firstChar, secondChar) {
  const badPhonetics = [
    // 避免谐音不好的组合
    ['死', '去'],
    ['四', '死'],
    ['病', '痛'],
    ['穷', '苦']
  ]
  
  for (const badPair of badPhonetics) {
    if ((firstChar === badPair[0] && secondChar === badPair[1]) ||
        (firstChar === badPair[1] && secondChar === badPair[0])) {
      return false
    }
  }
  
  return true
}

// 检查字形搭配
export function checkShapeMatch(firstChar, secondChar) {
  // 避免字形过于相似或复杂的组合
  const complicatedChars = ['龘', '鬱', '驫', '鱻']
  
  if (complicatedChars.includes(firstChar) && complicatedChars.includes(secondChar)) {
    return false
  }
  
  return true
}