import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { HandDrawnFrame } from '../components/layout/HandDrawnFrame';
import { ArrowLeft, FileText, BookOpen, Download, Star, Mail, Gavel, Lightbulb } from 'lucide-react';
import { analyzeUserProfile } from '../utils/decisionAlgorithms';
import { MOCK_CASES, PERSONALITY_TAGS } from '../utils/constants';
import html2canvas from 'html2canvas';

type TabType = 'personality' | 'history';

interface CloudJudgeProps {
  onClose: () => void;
}

function CloudJudge({ onClose }: CloudJudgeProps) {
  const addJudgeRecord = useAppStore((state) => state.addJudgeRecord);
  const [selectedCase, setSelectedCase] = useState(MOCK_CASES[0]);
  const [rating, setRating] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * MOCK_CASES.length);
    setSelectedCase(MOCK_CASES[randomIndex]);
  }, []);

  const handleRating = (score: number) => {
    setRating(score);
    setShowResult(true);
    addJudgeRecord({
      caseMbti: selectedCase.mbti,
      caseZodiac: selectedCase.zodiac,
      caseDecision: selectedCase.decision,
      score
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="hand-drawn-box bg-white p-8 max-w-lg w-full text-center">
        <Mail className="w-10 h-10 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl hand-font text-black mb-4">高维裁判邀请函</h3>
        
        {!showResult ? (
          <>
            <p className="text-sm text-gray-700 mb-6">
              鉴于你当前暂无烦恼，你已被系统随机选中为宇宙第三方决策裁判：
            </p>
            
            <div className="wood-paper-bg hand-drawn-box p-4 mb-6 text-left">
              <p className="text-sm text-black mb-3">
                {selectedCase.story}
              </p>
              <p className="text-xs text-gray-500 text-center">
                一位【{selectedCase.mbti}·{selectedCase.zodiac}】的路人选择了「{selectedCase.decision}」
              </p>
            </div>
            
            <p className="text-sm text-black mb-4">
              请你作为高维裁判，给这个决定的后续幸福度打个分。
            </p>
            
            <div className="flex justify-center gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  onClick={() => handleRating(score)}
                  className={`text-4xl transition-all ${
                    rating >= score
                      ? 'scale-110'
                      : 'hover:scale-105 opacity-60 hover:opacity-100'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="hand-drawn-box bg-white p-4 mb-4">
              <p className="text-sm text-black text-center">
                审判已记录！你给出了 {rating} 星评分
              </p>
            </div>
            <p className="text-xs text-gray-500 text-center italic mb-6">
              "对比路人的大坑，你自己的小纠结是不是瞬间不值一提了？"
            </p>
          </>
        )}
        
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="hand-drawn-box bg-white px-6 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
            style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
          >
            {showResult ? '返回' : '关闭'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ArchivePage() {
  const navigate = useNavigate();
  const { user_profile, decisions, judge_records } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('personality');
  const [showCloudJudge, setShowCloudJudge] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnvelope(true);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const profileData = analyzeUserProfile(decisions, {});
  const matchedTags = PERSONALITY_TAGS.filter(tag => tag.condition(profileData));

  const completedDecisions = decisions.filter(d => d.status === 'completed');
  const inProgressDecisions = decisions.filter(d => d.status === 'in_progress');
  const reflectedDecisions = decisions.filter(d => d.reflected);

  const handleDownloadReport = async () => {
    if (reportRef.current) {
      const canvas = await html2canvas(reportRef.current, {
        background: '#FDFBF7'
      });
      const link = document.createElement('a');
      link.download = 'personality-report.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/hub')}
            className="text-sm text-black hover:text-gray-600 transition-colors"
          >
            ← 返回 Hub
          </button>
          <h1 className="text-2xl hand-font text-black flex-1 text-center -ml-16">
            云法庭与博物馆
          </h1>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab('personality')}
            className={`hand-drawn-box px-6 py-3 text-sm flex items-center gap-2 transition-all ${
              activeTab === 'personality'
                ? 'bg-white text-black'
                : 'bg-gray-100 text-black hover:bg-gray-50'
            }`}
            style={{ boxShadow: activeTab === 'personality' ? '3px 3px 0px 0px rgba(0,0,0,1)' : '2px 2px 0px 0px rgba(0,0,0,0.3)' }}
          >
            <FileText className="w-4 h-4" />
            决策人格锚定
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`hand-drawn-box px-6 py-3 text-sm flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-white text-black'
                : 'bg-gray-100 text-black hover:bg-gray-50'
            }`}
            style={{ boxShadow: activeTab === 'history' ? '3px 3px 0px 0px rgba(0,0,0,1)' : '2px 2px 0px 0px rgba(0,0,0,0.3)' }}
          >
            <BookOpen className="w-4 h-4" />
            人生实验日志
          </button>
        </div>

        {activeTab === 'personality' && (
          <div ref={reportRef} className="wood-paper-bg hand-drawn-box p-8 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <div
                className="px-4 py-2 border-2 border-dashed border-black text-xs text-gray-700"
                style={{
                  transform: 'rotate(-2deg)',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic'
                }}
              >
                纠结症自救实验室 绝密档案
              </div>
            </div>
            
            <div className="text-center pt-12 mb-8">
              <h2 className="text-xl hand-font text-black mb-2">决策人格报告</h2>
              <p className="text-xs text-gray-500">生成日期：{today}</p>
            </div>

            <div className="wood-paper-bg hand-drawn-box p-4 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-base text-black mb-1">
                    {matchedTags.length > 0 ? matchedTags[0].tag : '神秘未知生物'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {matchedTags.length > 0 ? matchedTags[0].description : '你的决策模式过于独特，系统无法识别。也许你就是传说中的纠结之神。'}
                  </p>
                </div>
                <button
                  onClick={() => setShowDevModal(true)}
                  className="hand-drawn-box bg-white px-3 py-1.5 text-xs text-black hover:bg-gray-50 transition-colors flex-shrink-0"
                  style={{ boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)' }}
                >
                  报告打分
                </button>
              </div>
            </div>

            <div className="border-t-2 border-dashed border-gray-300 my-6" />

            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <div className="text-2xl text-black mb-1">{decisions.length}</div>
                <p className="text-xs text-gray-500">总决策数</p>
              </div>
              <div className="text-center">
                <div className="text-2xl text-black mb-1">{reflectedDecisions.length}</div>
                <p className="text-xs text-gray-500">已回溯反思</p>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div
                className="px-4 py-1 border-2 border-dashed border-black text-xs text-gray-600"
                style={{
                  transform: 'rotate(1deg)',
                  fontFamily: 'Georgia, serif'
                }}
              >
                机密
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {inProgressDecisions.length > 0 && (
              <div>
                <h3 className="text-sm text-black mb-3">进行中</h3>
                <div className="space-y-3">
                  {inProgressDecisions.map((decision) => (
                    <HandDrawnFrame key={decision.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-black">{decision.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            创建于 {new Date(decision.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">进行中</span>
                      </div>
                    </HandDrawnFrame>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowDevModal(true)}
                className="hand-drawn-box bg-white px-6 py-3 text-sm text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
                style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
              >
                <Lightbulb className="w-4 h-4" />
                调取你的自救建议
              </button>
            </div>

            {completedDecisions.length > 0 && (
              <div>
                <h3 className="text-sm text-black mb-3">已尘埃落定</h3>
                <div className="space-y-3">
                  {completedDecisions.map((decision) => (
                    <HandDrawnFrame key={decision.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-black">{decision.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {decision.type === 'long_term' && '长期追踪 · '}
                            {new Date(decision.created_at).toLocaleDateString()}
                          </p>
                          {decision.reflected && (
                            <div className="flex items-center gap-1 mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < decision.reflection_score ? 'text-black fill-black' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          {decision.self_analysis && (
                            <p className="text-xs text-gray-500 mt-2 italic">
                              自我剖析：{decision.self_analysis}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {decision.reflected ? '已反思' : '待反思'}
                        </span>
                      </div>
                    </HandDrawnFrame>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm text-black mb-3 flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                裁判记录
              </h3>
              {judge_records.length > 0 ? (
                <div className="space-y-3">
                  {judge_records.map((record) => (
                    <HandDrawnFrame key={record.id}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-black">{record.caseDecision}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {record.caseMbti} · {record.caseZodiac} · {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < record.score ? 'text-black fill-black' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </HandDrawnFrame>
                  ))}
                </div>
              ) : (
                <div className="p-4 border-2 border-black rounded text-center bg-white">
                  <p className="text-sm text-gray-400">暂无裁判记录</p>
                </div>
              )}
            </div>

            {decisions.length === 0 && judge_records.length === 0 && !showCloudJudge && (
              <HandDrawnFrame className="text-center py-12">
                <p className="text-sm text-black mb-2">暂无决策记录</p>
                <p className="text-xs text-gray-400 mb-4">
                  你还没有使用过决策工具。快去做一个决定吧！
                </p>
                <button
                  onClick={() => navigate('/light-decision')}
                  className="px-4 py-2 border-2 border-black rounded text-sm hover:bg-gray-50 transition-colors"
                >
                  开始第一次决策
                </button>
              </HandDrawnFrame>
            )}

          </div>
        )}

        {activeTab === 'personality' && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleDownloadReport}
              className="hand-drawn-box bg-white px-6 py-3 text-sm text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
              style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
            >
              <Download className="w-4 h-4" />
              克隆我的纠结基因（生成海报）
            </button>
          </div>
        )}

      </div>

      {showCloudJudge && <CloudJudge onClose={() => setShowCloudJudge(false)} />}

      {showEnvelope && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="wood-paper-bg hand-drawn-box p-6 max-w-xs w-full text-center animate-float">
            <div className="relative mb-4">
              <Mail className="w-12 h-12 mx-auto" />
              <div
                className="absolute -top-2 -right-2 px-2 py-0.5 border-2 border-dashed border-black text-xs text-gray-600"
                style={{
                  transform: 'rotate(15deg)',
                  fontFamily: 'Georgia, serif',
                  fontSize: '10px'
                }}
              >
                高维邮戳
              </div>
            </div>
            <p className="text-base text-black mb-2">一封神秘来信</p>
            <p className="text-xs text-gray-500 mb-4">点击拆开...</p>
            <button
              onClick={() => {
                setShowEnvelope(false);
                setShowCloudJudge(true);
              }}
              className="text-sm text-black underline underline-offset-2 hover:text-gray-600 transition-colors"
            >
              拆开
            </button>
          </div>
        </div>
      )}

      {showDevModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="hand-drawn-box bg-white p-8 max-w-sm w-full text-center">
            <Lightbulb className="w-10 h-10 mx-auto mb-4 text-gray-400" />
            <p className="text-base text-black mb-2">功能待开发</p>
            <p className="text-xs text-gray-400 mb-6">
              自救建议功能正在实验室中酝酿，敬请期待。
            </p>
            <button
              onClick={() => setShowDevModal(false)}
              className="hand-drawn-box bg-white px-6 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
              style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
            >
              返回
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
