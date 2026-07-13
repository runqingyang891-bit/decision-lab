import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { HandDrawnFrame } from '../components/layout/HandDrawnFrame';
import { MagicButton } from '../components/common/MagicButton';
import { getDaysDifference, adjustRegretFactor } from '../utils/decisionAlgorithms';
import { Coins, Scale, Archive, AlertTriangle, ChevronRight, Gavel, RotateCcw, Sparkles } from 'lucide-react';
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
  const { user_profile, decisions, judge_records, markAsReflected, updateRegretFactors, learning_parameters, resetAll } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<Decision | null>(null);
  const [pendingDays, setPendingDays] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAll();
    navigate('/');
  };

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
      description: '硬币、转盘、刮刮乐、投掷器，四种方式帮你快速决定',
      buttonText: '开始纠结',
      icon: <Coins className="w-8 h-8" />,
      path: '/light-decision',
      bgColor: 'bg-white'
    },
    {
      id: 'deep',
      title: '人生变量处理器',
      description: 'AHP层次分析法，深度拆解你的决策因子',
      buttonText: '深度分析',
      icon: <Scale className="w-8 h-8" />,
      path: '/deep-decision',
      bgColor: 'bg-white'
    },
    {
      id: 'archive',
      title: '选择考古档案馆',
      description: '回溯历史决策，生成人格报告，参与云裁判',
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
            <button className="w-12 h-12 rounded-full bg-magic-red border-2 border-black flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <span className="text-lg">!</span>
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

        <div className="flex items-center justify-center gap-6">
          <div className="relative">
            <div
              className="px-4 py-2 border-2 border-dashed border-black text-xs text-gray-600"
              style={{
                transform: 'rotate(-3deg)',
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic'
              }}
            >
              纠结症绝密档案
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="hand-drawn-box bg-white px-5 py-2 text-sm text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            重建纠结症档案
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="hand-drawn-box bg-white p-6 max-w-sm w-full text-center">
            <p className="text-sm text-black mb-2">确认重建档案？</p>
            <p className="text-xs text-gray-400 mb-6">
              所有决策记录、裁判记录和人格分析将被清零，此操作不可撤销。
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 border-2 border-black rounded text-sm hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleReset}
                className="magic-button px-4 py-2 text-sm"
              >
                确认清零
              </button>
            </div>
          </div>
        </div>
      )}

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
