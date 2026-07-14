import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { HandDrawnFrame } from '../components/layout/HandDrawnFrame';
import { MagicButton } from '../components/common/MagicButton';
import { getDaysDifference, adjustRegretFactor } from '../utils/decisionAlgorithms';
import { Coins, Scale, Archive, AlertTriangle, ChevronRight, Gavel, Sparkles } from 'lucide-react';
import { Decision } from '../types';

interface ReflectionModalProps {
  decision: Decision;
  days: number;
  onClose: (score: number) => void;
}

function ReflectionModal({ decision, days, onClose }: ReflectionModalProps) {
  const [selectedScore, setSelectedScore] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const handleScoreClick = (score: number) => {
    setSelectedScore(score);
    setIsClosing(true);
    setTimeout(() => {
      onClose(score);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`hand-drawn-box bg-white p-6 max-w-md w-full ${isClosing ? 'ink-spread' : ''}`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-magic-red" />
          <h3 className="text-lg hand-font text-black">高维回溯提醒</h3>
        </div>
        
        <p className="text-gray-700 text-sm mb-6">
          {days}天前，你通过本实验室选择了「{decision.title}」。
          现在回看，给这个决定的后续满意度打个分吧。
        </p>

        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => handleScoreClick(score)}
              disabled={isClosing}
              className={`text-3xl transition-all ${
                selectedScore >= score
                  ? 'scale-110'
                  : 'hover:scale-105 opacity-60 hover:opacity-100'
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400">
          1星 = 非常后悔 | 5星 = 非常满意
        </p>
      </div>
    </div>
  );
}

export function HubPage() {
  const navigate = useNavigate();
  const { user_profile, decisions, judge_records, markAsReflected, updateRegretFactors, learning_parameters } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);
  const [pendingDays, setPendingDays] = useState(0);

  useEffect(() => {
    const eligibleDecisions = decisions.filter(
      (d) => d.status === 'completed' && !d.reflected
    );

    for (const decision of eligibleDecisions) {
      const lastHistory = decision.history[decision.history.length - 1];
      if (lastHistory) {
        const days = getDaysDifference(lastHistory.timestamp);
        if (days >= 7) {
          setPendingDecision(decision);
          setPendingDays(days);
          setShowModal(true);
          break;
        }
      }
    }
  }, [decisions]);

  const handleCloseModal = (score: number) => {
    if (pendingDecision) {
      markAsReflected(pendingDecision.id, score);

      const lastWeights = pendingDecision.history[pendingDecision.history.length - 1]?.weights || {};
      let highestFactor = '';
      let highestWeight = 0;
      for (const [factor, weight] of Object.entries(lastWeights)) {
        const weightNum = Number(weight);
        if (weightNum > highestWeight) {
          highestWeight = weightNum;
          highestFactor = factor;
        }
      }

      if (highestFactor) {
        const newFactors = adjustRegretFactor(
          learning_parameters.regret_factors,
          highestFactor,
          score
        );
        updateRegretFactors(newFactors);
      }
    }

    setShowModal(false);
    setPendingDecision(null);
    setPendingDays(0);
  };

  const completedCount = decisions.filter(d => d.status === 'completed').length;
  const inProgressCount = decisions.filter(d => d.status === 'in_progress').length;

  const modules = [
    {
      id: 'light',
      title: '轻度纠结处理器',
      description: '抛、转、刮、投！四种无痛决策工具，三秒掀翻困难选择，交给天意来速通',
      buttonText: '开始纠结',
      icon: <Coins className="w-8 h-8" />,
      path: '/light-decision',
      bgColor: 'bg-white'
    },
    {
      id: 'deep',
      title: '人生变量处理器',
      description: '打开AI因子盲盒，注入私密变量，加满纠结砝码。这一波，用数据帮你找到终极答案',
      buttonText: '深度分析',
      icon: <Scale className="w-8 h-8" />,
      path: '/deep-decision',
      bgColor: 'bg-white'
    },
    {
      id: 'archive',
      title: '云法庭与博物馆',
      description: '复盘决策轨迹，确诊人格报告，再去云裁判围观，当一回互联网判官',
      buttonText: '开始考古',
      icon: <Archive className="w-8 h-8" />,
      path: '/archive',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl hand-font text-black mb-1">
              纠结症自救实验室
            </h1>
            <p className="text-xs text-gray-500">
              Welcome back, {user_profile?.name || ''}。
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xs text-black">{completedCount}</div>
                <div className="text-[10px] text-gray-500">已完成决策</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-black">{inProgressCount}</div>
                <div className="text-[10px] text-gray-500">进行中</div>
              </div>
            </div>
            <button onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full bg-magic-red border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <span className="text-lg">ME</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`hand-drawn-box ${module.bgColor} p-4 flex flex-col`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 flex items-center justify-center">
                  {module.icon}
                </div>
                <h2 className="text-sm text-black font-medium">{module.title}</h2>
              </div>
              <p className="text-[10px] text-gray-600 mb-4 flex-1">
                {module.description}
              </p>
              <button
                onClick={() => navigate(module.path)}
                className="hand-drawn-box bg-white px-3 py-1.5 text-[10px] text-black hover:bg-gray-50 transition-colors self-start"
                style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
              >
                {module.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="hand-drawn-box bg-white p-4 mb-10">
          <h2 className="text-sm text-black mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            最近决策
          </h2>
          {decisions.length > 0 || judge_records.length > 0 ? (
            <div className="space-y-2">
              {[...decisions].slice(-5).reverse().map((decision) => (
                <div key={decision.id} className="flex items-center gap-2 p-2 border-2 border-black rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-black truncate">{decision.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {decision.type === 'long_term' ? '长期决策' : '短期决策'} · {decision.status === 'completed' ? '已完成' : '进行中'}
                    </p>
                    {decision.self_analysis && (
                      <p className="text-[10px] text-gray-400 mt-0.5 truncate italic">
                        自我剖析：{decision.self_analysis}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => navigate('/archive')}
                    className="flex-shrink-0 px-2 py-1 border-2 border-black rounded text-[10px] text-black hover:bg-gray-50 transition-colors"
                  >
                    查看选择
                  </button>
                </div>
              ))}
              {[...judge_records].slice(-3).reverse().map((record) => (
                <div key={record.id} className="flex items-center gap-2 p-2 border-2 border-black rounded">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-black truncate">{record.caseDecision}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      <Gavel className="w-2.5 h-2.5 inline mr-1" />
                      裁判记录 · {record.caseMbti} · {record.score}星
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/archive')}
                    className="flex-shrink-0 px-2 py-1 border-2 border-black rounded text-[10px] text-black hover:bg-gray-50 transition-colors"
                  >
                    查看选择
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-xs text-black mb-2">还没有任何决策记录。</p>
              <p className="text-[10px] text-gray-600">是时候开始你的第一次选择了！</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center mt-8">
          <div
            className="px-6 py-3 border-2 border-dashed border-gray-500 text-sm text-gray-600"
            style={{
              transform: 'rotate(-3deg)',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic'
            }}
          >
            纠结症绝密档案
          </div>
        </div>
      </div>

      {showModal && pendingDecision && (
        <ReflectionModal
          decision={pendingDecision}
          days={pendingDays}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
