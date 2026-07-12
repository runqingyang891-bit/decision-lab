## 1. Architecture Design

```mermaid
flowchart LR
    subgraph Frontend (React + TypeScript)
        A[协议准入页] --> B[Hub首页]
        B --> C[轻度纠结处理器]
        B --> D[人生变量处理器]
        B --> E[选择考古档案馆]
        D --> F[动态因素漂移页]
    end
    
    subgraph Data Layer
        G[LocalStorage]
    end
    
    A --> G
    C --> G
    D --> G
    E --> G
    F --> G
```

## 2. Technology Description

- **Frontend**: React@19 + TypeScript + Vite@6 + Tailwind CSS@3
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **State Management**: Zustand
- **Data Persistence**: Browser LocalStorage
- **Initialization Tool**: vite-init (react-ts template)

## 3. Route Definitions

| Route | Purpose | Component |
|-------|---------|-----------|
| / | 协议准入页 | WelcomePage |
| /hub | Hub首页 | HubPage |
| /light-decision | 轻度纠结处理器 | LightDecisionPage |
| /deep-decision | 人生变量处理器 | DeepDecisionPage |
| /drift-analysis | 动态因素漂移页 | DriftAnalysisPage |
| /archive | 选择考古档案馆 | ArchivePage |

## 4. Data Model

### 4.1 JSON Schema

```typescript
interface UserProfile {
  name: string;
  zodiac: string;
  mbti: string;
  reg_date: string;
}

interface DecisionHistory {
  timestamp: string;
  day_of_week: number;
  weights: Record<string, number>;
}

interface Decision {
  id: string;
  title: string;
  type: 'short_term' | 'long_term';
  status: 'in_progress' | 'completed';
  reflected: boolean;
  reflection_score: number;
  created_at: string;
  history: DecisionHistory[];
}

interface LearningParameters {
  regret_factors: Record<string, number>;
}

interface AppState {
  user_profile: UserProfile | null;
  decisions: Decision[];
  learning_parameters: LearningParameters;
}
```

### 4.2 LocalStorage Structure

```json
{
  "acme_lab": {
    "user_profile": {
      "name": "张三",
      "zodiac": "天蝎座",
      "mbti": "INTJ",
      "reg_date": "2026-07-12"
    },
    "decisions": [],
    "learning_parameters": {
      "regret_factors": {}
    }
  }
}
```

## 5. Component Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── GridBackground.tsx      # 网格纸背景
│   │   └── HandDrawnFrame.tsx      # 手绘边框组件
│   ├── common/
│   │   ├── MagicButton.tsx         # 红色魔力按钮
│   │   ├── HandDrawnInput.tsx      # 手绘输入框
│   │   └── HandDrawnCheckbox.tsx   # 手绘复选框
│   ├── light/
│   │   ├── CoinFlip.tsx            # 概率奇点硬币
│   │   ├── EliminationWheel.tsx    # 反向排除转盘
│   │   ├── ScratchCard.tsx         # 薛定谔刮刮乐
│   │   └── SubconsciousThrow.tsx   # 潜意识投掷器
│   ├── deep/
│   │   ├── FactorBlindBox.tsx      # AI因子盲盒
│   │   ├── BalanceCanvas.tsx       # 天平画布
│   │   └── VerdictModal.tsx        # 宣判弹窗
│   └── archive/
│       ├── PersonalityReport.tsx   # 人格锚定报告
│       └── DecisionLog.tsx         # 人生实验日志
├── pages/
│   ├── WelcomePage.tsx             # 协议准入页
│   ├── HubPage.tsx                 # Hub首页
│   ├── LightDecisionPage.tsx       # 轻度纠结处理器
│   ├── DeepDecisionPage.tsx        # 人生变量处理器
│   ├── DriftAnalysisPage.tsx       # 动态因素漂移页
│   └── ArchivePage.tsx             # 选择考古档案馆
├── hooks/
│   ├── useLocalStorage.ts          # LocalStorage操作Hook
│   └── useDecisionLogic.ts         # 决策逻辑Hook
├── stores/
│   └── appStore.ts                 # Zustand状态管理
├── utils/
│   ├── constants.ts                # 常量定义
│   ├── decisionAlgorithms.ts       # 决策算法
│   └── mockData.ts                 # 内置案例数据
├── types/
│   └── index.ts                    # TypeScript类型定义
└── App.tsx
```

## 6. Core Algorithms

### 6.1 后悔修正因子算法

```typescript
// 用户评分R(1-5)后，调整权重最高因子的后悔修正因子γi
// 若R≤2（后悔），找出权重最高的因素i
// γi = γi × (1 + 0.05 × (3 - R))
function adjustRegretFactor(
  regretFactors: Record<string, number>,
  highestWeightFactor: string,
  score: number
): Record<string, number> {
  if (score <= 2) {
    const gamma = regretFactors[highestWeightFactor] || 1.0;
    regretFactors[highestWeightFactor] = gamma * (1 + 0.05 * (3 - score));
  }
  return regretFactors;
}
```

### 6.2 权重漂移率算法

```typescript
// 计算滑动窗口内因子的标准差（漂移率DR）
// DR = (1/N) × Σ(ωt - ω̄)²
function calculateDriftRate(weights: number[]): number {
  const N = weights.length;
  if (N === 0) return 0;
  const mean = weights.reduce((a, b) => a + b, 0) / N;
  const variance = weights.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / N;
  return variance;
}
```

### 6.3 AHP简化得分计算

```typescript
// 根据因子权重计算选项得分
function calculateScore(
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
```

## 7. Key Features Implementation Notes

### 7.1 全局拦截器
- 在HubPage组件挂载时检查LocalStorage
- 扫描completed且reflected=false的决策
- 计算当前时间与决策完成时间差≥7天
- 使用framer-motion实现毛玻璃手绘弹窗动画

### 7.2 轻度纠结处理器
- 4个Tab卡片切换
- 硬币：CSS 3D transform实现翻转动画
- 转盘：Canvas绘制多边形，随机指针位置
- 刮刮乐：Canvas实现涂抹效果，带声音提示
- 投掷器：进度条抖动动画，99%时强制黑屏

### 7.3 人生变量处理器
- Stepper卡片翻书效果（framer-motion）
- 因子盲盒：内置场景关键词知识库（工作、感情、生活等）
- 天平画布：SVG绘制，根据分值实时倾斜
- 拖拽砝码：react-beautiful-dnd或原生拖拽API

### 7.4 动态因素漂移页
- Recharts AreaChart，设置strokeDasharray手绘风格
- 计算各因子在不同日期的权重漂移
- 监测情绪周期（周五vs周一差异）
- 触发变量撕扯警告

### 7.5 选择考古档案馆
- 人格标签动态计算
- 海报生成：html2canvas
- 云裁判：随机抽取内置案例库
