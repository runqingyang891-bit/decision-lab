export function adjustRegretFactor(
  regretFactors: Record<string, number>,
  highestWeightFactor: string,
  score: number
): Record<string, number> {
  const newFactors = { ...regretFactors };
  if (score <= 2) {
    const gamma = newFactors[highestWeightFactor] || 1.0;
    newFactors[highestWeightFactor] = gamma * (1 + 0.05 * (3 - score));
  }
  return newFactors;
}

export function calculateDriftRate(weights: number[]): number {
  const N = weights.length;
  if (N === 0) return 0;
  const mean = weights.reduce((a, b) => a + b, 0) / N;
  const variance = weights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / N;
  return variance;
}

export function calculateScore(
  optionFactors: Record<string, number>,
  weights: Record<string, number>,
  regretFactors: Record<string, number>
): number {
  let score = 0;
  let totalWeight = 0;
  for (const [factor, weight] of Object.entries(weights)) {
    const regret = regretFactors[factor] || 1.0;
    score += (optionFactors[factor] || 0) * weight * regret;
    totalWeight += weight * regret;
  }
  return totalWeight > 0 ? score / totalWeight : 0;
}

export function generateDecisionId(): string {
  return `dec_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;
}

export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

export function getDaysDifference(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function suggestFactors(title: string): string[] {
  const lowerTitle = title.toLowerCase();
  const suggestions: Record<string, string[]> = {
    '工作': ['薪资待遇', '团队氛围', '发展空间', '通勤时间'],
    '跳槽': ['薪资待遇', '团队氛围', '发展空间', '通勤时间'],
    '职场': ['薪资待遇', '团队氛围', '发展空间', '通勤时间'],
    '感情': ['三观契合', '经济基础', '家庭背景', '未来规划'],
    '恋爱': ['三观契合', '经济基础', '家庭背景', '未来规划'],
    '结婚': ['三观契合', '经济基础', '家庭背景', '未来规划'],
    '学习': ['学术水平', '就业前景', '学费成本', '城市环境'],
    '考研': ['学术水平', '就业前景', '学费成本', '城市环境'],
    '留学': ['学术水平', '就业前景', '学费成本', '城市环境'],
    '买房': ['价格预算', '地理位置', '周边配套', '户型朝向'],
    '租房': ['价格预算', '地理位置', '周边配套', '户型朝向'],
    '买车': ['价格预算', '油耗性能', '品牌口碑', '维护成本'],
    '旅行': ['预算成本', '风景体验', '安全程度', '交通便利'],
  };
  
  for (const [keyword, factors] of Object.entries(suggestions)) {
    if (lowerTitle.includes(keyword)) {
      return factors;
    }
  }
  
  return ['重要程度', '可行性', '风险系数', '兴趣匹配'];
}

export function analyzeUserProfile(decisions: any[], regretFactors: Record<string, number>) {
  const completedDecisions = decisions.filter(d => d.status === 'completed');
  const longTermDecisions = decisions.filter(d => d.type === 'long_term');
  
  let totalEconomicWeight = 0;
  let totalDecisionsWithEconomics = 0;
  let totalDriftRate = 0;
  let totalReflectionScore = 0;
  
  completedDecisions.forEach(decision => {
    const weights = decision.history[decision.history.length - 1]?.weights || {};
    const economicFactors = ['薪资待遇', '经济基础', '价格预算', '预算成本', '学费成本', '维护成本'];
    let econWeight = 0;
    economicFactors.forEach(factor => {
      econWeight += Number(weights[factor]) || 0;
    });
    let totalWeight = 0;
    Object.values(weights).forEach(w => {
      totalWeight += Number(w);
    });
    
    if (totalWeight > 0) {
      totalEconomicWeight += econWeight / totalWeight * 100;
      totalDecisionsWithEconomics++;
    }
    
    const factorWeights: number[] = [];
    Object.values(weights).forEach(w => factorWeights.push(Number(w)));
    totalDriftRate += calculateDriftRate(factorWeights);
    
    if (decision.reflected) {
      totalReflectionScore += Number(decision.reflection_score);
    }
  });
  
  return {
    completedCount: completedDecisions.length,
    longTermCount: longTermDecisions.length,
    economicWeight: totalDecisionsWithEconomics > 0 ? totalEconomicWeight / totalDecisionsWithEconomics : 0,
    avgDriftRate: completedDecisions.length > 0 ? totalDriftRate / completedDecisions.length : 0,
    reflectionScore: completedDecisions.filter(d => d.reflected).length > 0 
      ? totalReflectionScore / completedDecisions.filter(d => d.reflected).length 
      : 0
  };
}
