import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { HandDrawnFrame } from '../components/layout/HandDrawnFrame';
import { MagicButton } from '../components/common/MagicButton';
import { HandDrawnInput } from '../components/common/HandDrawnInput';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { generateDecisionId } from '../utils/decisionAlgorithms';
import { FactorWeight } from '../types';

type StepType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

function EngineInitPage({ onComplete }: { onComplete: () => void }) {
  const [logText, setLogText] = useState('');
  const fullLog = '> 初始化决策引擎...\n> 加载因子矩阵...\n> 校准权重参数...\n> 引擎就绪';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullLog.length) {
        setLogText(fullLog.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 60);

    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="engine-spinning absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="20" y="20" width="60" height="60" fill="none" stroke="#7EC850" strokeWidth="3" />
              <rect x="30" y="30" width="40" height="40" fill="none" stroke="#7EC850" strokeWidth="2" opacity="0.6" />
              <rect x="40" y="40" width="20" height="20" fill="#7EC850" opacity="0.4" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="#7EC850" strokeWidth="1" opacity="0.3" />
              <line x1="50" y1="10" x2="50" y2="90" stroke="#7EC850" strokeWidth="1" opacity="0.3" />
            </svg>
          </div>
        </div>
        <pre className="text-xs text-gray-600 text-left inline-block min-h-[80px] whitespace-pre-wrap">
          {logText}
          <span className="cursor-blink">|</span>
        </pre>
      </div>
    </div>
  );
}

function RunningSimulationPage({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [statusText, setStatusText] = useState('正在拆解...');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; curveOffset: number }> = [];
    const colors = ['#7EC850', '#7EC850', '#7EC850', '#555555', '#7EC850', '#444444'];
    
    for (let i = 0; i < 800; i++) {
      particles.push({
        x: Math.random() * canvas.width - canvas.width,
        y: Math.random() * canvas.height,
        vx: 2 + Math.random() * 4,
        vy: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 2,
        curveOffset: Math.random() * Math.PI * 2
      });
    }

    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(253, 251, 247, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame += 0.02;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.vy = Math.sin(frame + p.curveOffset) * 1.5;
        p.y += p.vy;

        if (p.x > canvas.width) {
          p.x = -10;
          p.y = Math.random() * canvas.height;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (i % 5 === 0) {
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 30, p.y - Math.sin(frame + p.curveOffset) * 8);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const textInterval = setInterval(() => {
      setStatusText(prev => prev === '正在拆解...' ? '正在计算...' : '正在拆解...');
    }, 800);

    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(textInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 text-center">
        <p className="text-sm text-gray-700 animate-pulse">{statusText}</p>
      </div>
    </div>
  );
}

function suggestFactorsDynamic(title: string): string[] {
  const lowerTitle = title.toLowerCase();

  const pools: Record<string, string[][]> = {
    'offer': [
      ['薪资对比', '长期发展', '通勤距离', '平台规模'],
      ['薪资待遇', '团队氛围', '发展空间', '通勤时间'],
      ['薪资涨幅', '技术成长', '平台大小', '业务方向'],
    ],
    '工作': [
      ['薪资待遇', '通勤距离', '发展空间', '团队氛围'],
      ['晋升机会', '工作内容', '公司前景', '福利待遇'],
      ['加班强度', '老板风格', '团队水平', '工作环境'],
    ],
    '跳槽': [
      ['薪资涨幅', '平台发展', '通勤距离', '团队氛围'],
      ['技术成长', '业务方向', '期权股票', '公司前景'],
      ['晋升空间', '团队水平', '平台大小', '工作强度'],
    ],
    '辞职': [
      ['经济储备', '下一步规划', '心理健康', '市场行情'],
      ['职业发展', '离职成本', '行业趋势', '备选方案'],
    ],
    '职场': [
      ['人际关系', '晋升机会', '工作内容', '薪资水平'],
      ['直属领导', '团队规模', '公司文化', '加班情况'],
    ],
    '公司': [
      ['薪资待遇', '通勤距离', '发展空间', '团队氛围'],
      ['公司前景', '福利待遇', '工作环境', '企业文化'],
    ],
    '感情': [
      ['三观契合', '经济基础', '未来规划', '性格匹配'],
      ['沟通方式', '生活习惯', '信任程度', '共同兴趣'],
    ],
    '恋爱': [
      ['感情基础', '性格匹配', '未来规划', '经济状况'],
      ['家庭态度', '沟通方式', '信任程度', '共同兴趣'],
    ],
    '结婚': [
      ['经济基础', '三观契合', '家庭背景', '未来规划'],
      ['生育观念', '生活习惯', '双方父母', '居住安排'],
    ],
    '分手': [
      ['感情残存', '未来发展', '社交圈子', '心理准备'],
      ['经济纠葛', '外界压力', '自尊心', '孤独承受'],
    ],
    '复合': [
      ['问题是否解决', '信任重建', '双方改变', '感情基础'],
      ['外界看法', '心理预期', '时间成本', '分手原因'],
    ],
    '学习': [
      ['学术水平', '就业前景', '学费成本', '城市环境'],
      ['师资力量', '课程设置', '校友资源', '学习氛围'],
    ],
    '考研': [
      ['专业排名', '导师水平', '就业前景', '考试难度'],
      ['学费成本', '城市选择', '科研方向', '学校名气'],
    ],
    '留学': [
      ['学校排名', '专业匹配', '学费成本', '就业前景'],
      ['语言环境', '文化适应', '安全程度', '签证难度'],
    ],
    '买房': [
      ['价格预算', '地理位置', '周边配套', '升值空间'],
      ['户型朝向', '学区资源', '交通便利', '小区环境'],
    ],
    '租房': [
      ['租金成本', '地理位置', '交通便利', '房屋状况'],
      ['周边配套', '户型朝向', '租期灵活', '房东态度'],
    ],
    '搬家': [
      ['居住成本', '通勤距离', '周边配套', '生活便利'],
      ['居住环境', '社区安全', '房屋面积', '邻里关系'],
    ],
    '买车': [
      ['价格预算', '油耗性能', '品牌口碑', '维护成本'],
      ['空间大小', '安全配置', '外观设计', '保值率'],
    ],
    '旅行': [
      ['预算成本', '风景体验', '安全程度', '交通便利'],
      ['文化体验', '美食特色', '天气气候', '人流量'],
    ],
    '创业': [
      ['资金储备', '市场需求', '团队伙伴', '风险评估'],
      ['产品方向', '竞争格局', '盈利模式', '行业趋势'],
    ],
    '投资': [
      ['预期收益', '风险等级', '资金流动性', '市场趋势'],
      ['投资周期', '政策风险', '行业前景', '分散程度'],
    ],
  };

  for (const [keyword, factorSets] of Object.entries(pools)) {
    if (lowerTitle.includes(keyword)) {
      const randomSet = factorSets[Math.floor(Math.random() * factorSets.length)];
      return [...randomSet];
    }
  }

  const defaultSets = [
    ['重要程度', '可行性', '风险系数', '经济影响'],
    ['短期收益', '长期价值', '机会成本', '风险评估'],
    ['内心渴望', '理性分析', '短期影响', '长期发展'],
    ['时间成本', '精力投入', '收益预期', '不确定性'],
  ];
  return [...defaultSets[Math.floor(Math.random() * defaultSets.length)]];
}

function getHiddenFactorSuggestions(title: string): string[] {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('工作') || lowerTitle.includes('跳槽') || lowerTitle.includes('公司') || lowerTitle.includes('职场')) {
    return ['老板太画饼', '前台长得好看', '同事总带零食', '工位靠窗', '公司有猫', '食堂好吃'];
  }
  if (lowerTitle.includes('感情') || lowerTitle.includes('恋爱') || lowerTitle.includes('复合')) {
    return ['对方做饭好吃', '聊天秒回', '记得我生日', '会修电脑', '声音好听', '手好看'];
  }
  if (lowerTitle.includes('学习') || lowerTitle.includes('考研') || lowerTitle.includes('留学')) {
    return ['食堂好吃', '宿舍有空调', '离奶茶店近', '校猫可爱', '图书馆舒服', 'WiFi快'];
  }
  if (lowerTitle.includes('买房') || lowerTitle.includes('租房') || lowerTitle.includes('搬家')) {
    return ['邻居养猫', '楼下有早餐店', '快递柜很大', '阳台朝南', '隔音好', '有电梯'];
  }
  return ['说不上来的感觉', '就是觉得不对劲', '直觉告诉我', '第六感', '梦里出现过', '算命说的'];
}

export function DeepDecisionPage() {
  const navigate = useNavigate();
  const addDecision = useAppStore((state) => state.addDecision);
  const completeDecision = useAppStore((state) => state.completeDecision);
  const user_profile = useAppStore((state) => state.user_profile);
  
  const [currentStep, setCurrentStep] = useState<StepType>(1);
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [suggestedFactors, setSuggestedFactors] = useState<string[]>([]);
  const [keptFactors, setKeptFactors] = useState<Set<string>>(new Set());
  const [hiddenFactorSuggestions, setHiddenFactorSuggestions] = useState<string[]>([]);
  const [hiddenFactors, setHiddenFactors] = useState(['', '']);
  const [factorWeights, setFactorWeights] = useState<Record<string, number>>({});
  const [showOverflowWarning, setShowOverflowWarning] = useState(false);
  const [weightA, setWeightA] = useState<Record<string, number>>({});
  const [showDebunkModal, setShowDebunkModal] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [showOverflowModal, setShowOverflowModal] = useState(false);

  useEffect(() => {
    if (title.trim()) {
      const factors = suggestFactorsDynamic(title);
      setSuggestedFactors(factors);
      setKeptFactors(new Set(factors));
      
      const hiddenSuggestions = getHiddenFactorSuggestions(title);
      setHiddenFactorSuggestions(hiddenSuggestions);
    }
  }, [title]);

  const allActiveFactors = [...Array.from(keptFactors), ...hiddenFactors.filter(f => f.trim())];

  const totalImportance = allActiveFactors.reduce((sum, f) => sum + (factorWeights[f] || 0), 0);

  const toggleFactor = (factor: string) => {
    const newKept = new Set(keptFactors);
    if (newKept.has(factor)) {
      newKept.delete(factor);
    } else {
      newKept.add(factor);
    }
    setKeptFactors(newKept);
  };

  const updateImportance = (factor: string, value: number) => {
    setFactorWeights({ ...factorWeights, [factor]: value });
  };

  const updateWeightA = (factor: string, value: number) => {
    setWeightA({ ...weightA, [factor]: Math.min(100, Math.max(0, value)) });
  };

  const calculateResult = () => {
    // 数学模型：每个因素有100砝码在A/B间分配
    // weightA + weightB = 100，weightB = 100 - weightA
    // 得分 = sum(纠结比重_i × 砝码占比_i)
    let scoreA = 0;
    let scoreB = 0;
    let totalImportanceSum = 0;

    allActiveFactors.forEach(factor => {
      const importance = factorWeights[factor] || 0;
      const wA = weightA[factor] || 50;
      const wB = 100 - wA;

      scoreA += importance * wA;
      scoreB += importance * wB;
      totalImportanceSum += importance;
    });

    if (totalImportanceSum > 0) {
      scoreA = scoreA / totalImportanceSum;
      scoreB = scoreB / totalImportanceSum;
    }

    setWinner(scoreA >= scoreB ? 0 : 1);
    setCurrentStep(6); // 引擎初始化
  };

  const handleEngineComplete = () => {
    setCurrentStep(7); // 模拟运行
  };

  const handleSimulationComplete = () => {
    setCurrentStep(5); // 宣判与掀桌
  };

  const buildFactorWeights = (): FactorWeight[] => {
    return allActiveFactors.map(factor => {
      const wA = weightA[factor] || 50;
      return {
        name: factor,
        importance: factorWeights[factor] || 0,
        weightA: wA,
        weightB: 100 - wA
      };
    });
  };

  const handleAccept = () => {
    const decisionId = generateDecisionId();
    const fw = buildFactorWeights();
    addDecision({
      title,
      type: 'short_term',
      status: 'in_progress',
      options,
      factors: Array.from(keptFactors),
      hiddenFactors: hiddenFactors.filter(f => f.trim()),
      factorWeights: fw
    });
    
    completeDecision(decisionId, fw);
    navigate('/hub');
  };

  const handleDebunk = () => {
    setShowDebunkModal(true);
  };

  const handleDebunkConfirm = () => {
    const decisionId = generateDecisionId();
    const fw = buildFactorWeights();
    addDecision({
      title,
      type: 'long_term',
      status: 'completed',
      options,
      factors: Array.from(keptFactors),
      hiddenFactors: hiddenFactors.filter(f => f.trim()),
      factorWeights: fw
    });
    
    completeDecision(decisionId, fw);
    navigate('/hub');
  };

  const stepTitles: Record<number, string> = {
    1: '烦恼备忘录',
    2: 'AI因子盲盒',
    3: '私密变量补全',
    4: '砝码大画布',
    5: '宣判与掀桌',
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-black text-sm mb-2">
                核心问题<span className="text-magic-red">*</span>
              </label>
              <HandDrawnInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：要不要跳槽去A公司"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-black text-sm mb-2">
                选项A<span className="text-magic-red">*</span>
              </label>
              <HandDrawnInput
                value={options[0]}
                onChange={(e) => setOptions([e.target.value, options[1]])}
                placeholder="例如：跳槽去A公司"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-black text-sm mb-2">
                选项B<span className="text-magic-red">*</span>
              </label>
              <HandDrawnInput
                value={options[1]}
                onChange={(e) => setOptions([options[0], e.target.value])}
                placeholder="例如：留在现在的公司"
                className="w-full"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              系统识别到你的问题，生成了以下核心因子。
            </p>
            <p className="text-sm text-gray-600">
              点击「划掉」剔除不相关因素，调整「纠结比重」。
            </p>
            <div className="space-y-4 pt-2">
              {suggestedFactors.map((factor) => (
                <div
                  key={factor}
                  className={`hand-drawn-box p-4 transition-all wood-paper-bg ${
                    keptFactors.has(factor) ? '' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-base ${keptFactors.has(factor) ? 'text-black' : 'text-gray-400 line-through'}`}>
                      {factor}
                    </span>
                    {keptFactors.has(factor) ? (
                      <button
                        onClick={() => toggleFactor(factor)}
                        className="px-4 py-1 text-sm text-black hover:bg-gray-200 transition-colors border-2 border-gray-500 rounded"
                        style={{ boxShadow: '2px 2px 0px 0px rgba(107,114,128,0.6)' }}
                      >
                        划掉
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleFactor(factor)}
                        className="px-4 py-1 text-sm text-black hover:bg-gray-200 transition-colors border-2 border-gray-500 rounded"
                        style={{ boxShadow: '2px 2px 0px 0px rgba(107,114,128,0.6)' }}
                      >
                        留着
                      </button>
                    )}
                  </div>
                  {keptFactors.has(factor) && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 flex-shrink-0">纠结比重:</span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={factorWeights[factor] || 0}
                          onChange={(e) => updateImportance(factor, Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${factorWeights[factor] || 0}%, #E5E7EB ${factorWeights[factor] || 0}%, #E5E7EB 100%)`
                          }}
                        />
                      </div>
                      <span className="text-sm text-black w-12 text-right">{factorWeights[factor] || 0}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500">
                总纠结比重：{totalImportance} / 100
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <p className="text-sm text-gray-500">
              根据你的选择，系统智能匹配了以下隐秘因素。你也可以自行输入：
            </p>
            <div className="space-y-4">
              {[0, 1].map((idx) => (
                <div key={idx}>
                  <label className="block text-black text-sm mb-2">隐秘因素 {idx + 1}（可选）</label>
                  <div className="flex items-center gap-2">
                    <HandDrawnInput
                      value={hiddenFactors[idx]}
                      onChange={(e) => {
                        const newFactors = [...hiddenFactors];
                        newFactors[idx] = e.target.value;
                        setHiddenFactors(newFactors);
                      }}
                      placeholder={`如：${hiddenFactorSuggestions[idx] || '只有你知道的秘密'}`}
                      className="flex-1"
                    />
                    {hiddenFactors[idx].trim() && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={factorWeights[hiddenFactors[idx]] || 0}
                          onChange={(e) => updateImportance(hiddenFactors[idx], Number(e.target.value))}
                          className="w-20 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                        />
                        <span className="text-xs text-gray-600 w-8">{factorWeights[hiddenFactors[idx]] || 0}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hiddenFactorSuggestions.slice(idx * 3, idx * 3 + 3).map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => {
                          const newFactors = [...hiddenFactors];
                          newFactors[idx] = suggestion;
                          setHiddenFactors(newFactors);
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-500 hover:border-black hover:text-black transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {showOverflowWarning && (
              <div className="p-3 border-2 border-black rounded bg-white">
                <p className="text-xs text-magic-red">
                  所有因素的纠结比重总和已超过100%（当前: {totalImportance}%），请注意合理分配。
                </p>
              </div>
            )}
            {totalImportance > 0 && (
              <p className="text-xs text-gray-500">
                当前纠结比重总和: {totalImportance}% {totalImportance > 100 && '（已超出）'}
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-500">每个因素共有100砝码，在选项A和选项B之间分配</p>
            </div>

            <div className="relative w-full h-32 mb-4">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <rect x="180" y="180" width="40" height="10" fill="black" rx="2" />
                <line x1="200" y1="180" x2="200" y2="80" stroke="black" strokeWidth="3" />

                <line
                  x1="50"
                  y1="80"
                  x2="350"
                  y2="80"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <line x1="100" y1="80" x2="100" y2="120" stroke="black" strokeWidth="2" />
                <rect x="60" y="120" width="80" height="15" fill="#D4A574" stroke="black" strokeWidth="2" rx="2" />
                <text x="100" y="131" textAnchor="middle" fontSize="11" fill="white">
                  {options[0] || '选项A'}
                </text>

                <line x1="300" y1="80" x2="300" y2="120" stroke="black" strokeWidth="2" />
                <rect x="260" y="120" width="80" height="15" fill="#333333" stroke="black" strokeWidth="2" rx="2" />
                <text x="300" y="131" textAnchor="middle" fontSize="11" fill="white">
                  {options[1] || '选项B'}
                </text>

                <circle cx="200" cy="80" r="8" fill="black" />
              </svg>
            </div>

            <div className="space-y-4">
              {allActiveFactors.map((factor) => {
                const wA = weightA[factor] || 50;
                const wB = 100 - wA;
                return (
                  <div key={factor} className="p-4 border-2 border-gray-500 rounded wood-paper-bg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-black">{factor}</span>
                      <span className="text-xs text-gray-400">纠结比重: {factorWeights[factor] || 0}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-black w-20 text-right">{options[0] || 'A'}: {wA}</span>
                      <div className="flex-1 relative">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={wA}
                          onChange={(e) => updateWeightA(factor, Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${wA}%, #333333 ${wA}%, #333333 100%)`
                          }}
                        />
                      </div>
                      <span className="text-xs text-black w-20">{options[1] || 'B'}: {wB}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="p-5 border-2 border-gray-500 rounded wood-paper-bg">
              <p className="text-sm text-gray-500">经过深度分析，系统判定：</p>
              <p className="text-xl text-black mt-3">{options[winner || 0]}</p>
              <p className="text-xs text-gray-400 mt-2">是更优的选择</p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <MagicButton onClick={handleAccept} className="text-sm px-5 py-2">
                就这么办！
              </MagicButton>
              <button
                onClick={handleDebunk}
                className="px-5 py-2 border-2 border-gray-500 rounded text-sm hover:bg-gray-50 transition-colors"
                style={{ boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
              >
                可是我不甘心
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return title.trim() !== '' && options[0].trim() !== '' && options[1].trim() !== '';
      case 2:
        return keptFactors.size > 0;
      case 3:
        return true;
      case 4:
        return allActiveFactors.length > 0;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if ((currentStep === 2 || currentStep === 3) && totalImportance > 100) {
      setShowOverflowModal(true);
      return;
    }
    setCurrentStep(Math.min(5, currentStep + 1) as StepType);
  };

  if (currentStep === 6) {
    return <EngineInitPage onComplete={handleEngineComplete} />;
  }

  if (currentStep === 7) {
    return <RunningSimulationPage onComplete={handleSimulationComplete} />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <div className="relative mb-6">
          <button
            onClick={() => navigate('/hub')}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-sm text-black hover:text-gray-600 transition-colors"
          >
            ← 返回 Hub
          </button>
          <h1 className="text-2xl hand-font text-black text-center">
            人生变量处理器
          </h1>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 border-2 border-gray-500 flex items-center justify-center text-sm transition-all ${
                currentStep === step
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-black'
              }`}
              style={{ boxShadow: currentStep === step ? '2px 2px 0px 0px rgba(107,114,128,0.6)' : 'none' }}
            >
              {step}
            </div>
          ))}
        </div>

        <div className="hand-drawn-box p-6 mb-6 min-h-[350px] wood-paper-bg">
          <h2 className="text-lg text-black mb-4">
            {stepTitles[currentStep]}
          </h2>
          {getStepContent()}
        </div>

        <div className="flex justify-center gap-4">
          {currentStep > 1 && currentStep < 5 && (
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1) as StepType)}
              className="hand-drawn-box px-6 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
              style={{ backgroundColor: '#E6D4B8', boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
            >
              上一步
            </button>
          )}

          {currentStep < 4 && (
            <button
              onClick={handleNextStep}
              disabled={!isStepValid()}
              className={`hand-drawn-box px-6 py-2 text-sm text-black transition-all ${
                isStepValid() ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: isStepValid() ? '#E6D4B8' : '#E5E5E5',
                boxShadow: isStepValid() ? '3px 3px 0px 0px rgba(107,114,128,0.6)' : 'none' 
              }}
            >
              下一步
            </button>
          )}
          {currentStep === 4 && (
            <button
              onClick={calculateResult}
              disabled={!isStepValid()}
              className={`hand-drawn-box px-6 py-2 text-sm text-black transition-all ${
                isStepValid() ? 'hover:bg-gray-50' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ 
                backgroundColor: isStepValid() ? '#E6D4B8' : '#E5E5E5',
                boxShadow: isStepValid() ? '3px 3px 0px 0px rgba(107,114,128,0.6)' : 'none' 
              }}
            >
              开始计算
            </button>
          )}
        </div>
      </div>

      {showDebunkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="hand-drawn-box p-6 max-w-lg w-full wood-paper-bg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-magic-red" />
              <h3 className="text-lg hand-font text-black">实验室逆向拆穿报告</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-xs text-gray-500">
                姓名：{user_profile?.name || '未知'} | MBTI：{user_profile?.mbti || '未测'}
              </p>
              <p className="text-sm text-black">
                理性告诉你【{options[winner || 0]}】得分最高，但你的手指死死停在【{options[1 - (winner || 0)]}】上。
              </p>
              <p className="text-sm text-gray-600">
                根据你刚才手动补充的私密因素【{hiddenFactors.filter(f => f.trim()).join('、') || '未补充'}】的打分轨迹，
                你的潜意识已经偷偷把它的重要性拔高了。你不是在寻找最优解，你只是在寻找一个"支持你犯傻"的借口。
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDebunkModal(false)}
                className="px-4 py-2 border-2 border-gray-500 rounded text-sm hover:bg-gray-50"
                style={{ boxShadow: '2px 2px 0px 0px rgba(107,114,128,0.6)' }}
              >
                再想想
              </button>
              <MagicButton onClick={handleDebunkConfirm} className="text-sm px-4 py-2">
                接受现实
              </MagicButton>
            </div>
          </div>
        </div>
      )}

      {showOverflowModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="hand-drawn-box p-6 max-w-sm w-full text-center wood-paper-bg">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-magic-red" />
            <p className="text-sm text-black mb-2">纠结比重总和已超过100%</p>
            <p className="text-xs text-gray-400 mb-6">
              当前总和：{totalImportance}%，请调整各因素的纠结比重使其不超过100%后再继续。
            </p>
            <button
              onClick={() => setShowOverflowModal(false)}
              className="hand-drawn-box px-6 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
              style={{ backgroundColor: '#E6D4B8', boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
            >
              返回修改
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
