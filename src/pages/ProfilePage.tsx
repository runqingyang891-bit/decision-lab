import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { ArrowLeft, RotateCcw, Copy, Share2, Link as LinkIcon, X, Star } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user_profile, decisions, resetAll } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showShareImage, setShowShareImage] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [copied, setCopied] = useState(false);

  // 实验室建议簿状态
  const [labRating, setLabRating] = useState(0);
  const [labSuggestion, setLabSuggestion] = useState('');
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  const buddyCode = 'JJ-' + (user_profile?.name || 'USER').slice(0, 3).toUpperCase().padEnd(3, 'X') + '-' + (user_profile?.reg_date || '2024').slice(-2);
  const shareUrl = `${window.location.origin}/?ref=${buddyCode}`;

  const handleReset = () => {
    resetAll();
    navigate('/');
  };

  const handleSubmitSuggestion = () => {
    setSuggestionSubmitted(true);
    setTimeout(() => {
      setSuggestionSubmitted(false);
      setLabRating(0);
      setLabSuggestion('');
    }, 3000);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/hub')}
            className="p-2 border-2 border-gray-500 rounded hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl hand-font text-black">
            个人档案管理
          </h1>
        </div>

        {/* 上半部分：纠结搭子 */}
        <div className="hand-drawn-box wood-paper-bg p-6 mb-8">
          <h2 className="text-sm text-black mb-4 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            纠结搭子
          </h2>

          {/* 我的纠结码 */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="border-2 border-dashed border-gray-500 px-4 py-2 bg-white">
              <span className="text-xs text-gray-500">我的纠结码</span>
              <span className="text-sm text-black ml-2 font-mono">{buddyCode}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(buddyCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 border-2 border-gray-500 rounded hover:bg-gray-50 transition-colors"
              style={{ boxShadow: '2px 2px 0px 0px rgba(107,114,128,0.6)' }}
            >
              {copied ? <span className="text-xs text-green-600">已复制</span> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* 分享按钮 */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowShareImage(true)}
              className="hand-drawn-box bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
              style={{ boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
            >
              <Share2 className="w-4 h-4" />
              生成分享图片
            </button>
            <button
              onClick={() => setShowShareLink(true)}
              className="hand-drawn-box bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
              style={{ boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
            >
              <LinkIcon className="w-4 h-4" />
              生成分享链接
            </button>
          </div>
        </div>

        {/* 下半部分：重建纠结症档案 */}
        <div className="flex items-center justify-center gap-6 mt-8 mb-8">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="hand-drawn-box bg-white px-5 py-2 text-sm text-black hover:bg-gray-50 transition-colors flex items-center gap-2"
            style={{ boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
          >
            <RotateCcw className="w-4 h-4" />
            重建纠结症档案
          </button>
        </div>

        {/* 实验室建议簿 */}
        <div className="hand-drawn-box wood-paper-bg p-6 mb-8">
          <h2 className="text-sm text-black mb-4 text-center" style={{ fontFamily: 'Georgia, serif' }}>
            实验室建议簿
          </h2>

          {suggestionSubmitted ? (
            <div className="text-center py-6">
              <p className="text-sm text-black mb-2">感谢你的反馈！</p>
              <p className="text-xs text-gray-500">你的建议已记录，实验室会持续改进～</p>
            </div>
          ) : (
            <>
              {/* 五星评分 */}
              <div className="flex flex-col items-center mb-4">
                <p className="text-xs text-gray-600 mb-2">为实验室打分</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => setLabRating(score)}
                      className="transition-all hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          score <= labRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {labRating > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{labRating} 星</p>
                )}
              </div>

              {/* 建议文本框 */}
              <div className="mb-4">
                <textarea
                  value={labSuggestion}
                  onChange={(e) => setLabSuggestion(e.target.value)}
                  placeholder="写下你对实验室的建议（选填）"
                  className="w-full p-3 border-2 border-gray-500 rounded text-sm bg-white resize-none"
                  rows={3}
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmitSuggestion}
                  disabled={labRating === 0}
                  className={`hand-drawn-box px-6 py-2 text-sm transition-all ${
                    labRating > 0
                      ? 'bg-white text-black hover:bg-gray-50 cursor-pointer'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ boxShadow: labRating > 0 ? '3px 3px 0px 0px rgba(107,114,128,0.6)' : 'none' }}
                >
                  提交建议
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 重建确认弹窗 */}
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
                className="px-4 py-2 border-2 border-gray-500 rounded text-sm hover:bg-gray-50 transition-colors"
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

      {/* 分享图片弹窗（含二维码） */}
      {showShareImage && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="hand-drawn-box wood-paper-bg p-8 max-w-sm w-full text-center relative">
            <button
              onClick={() => setShowShareImage(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="border-2 border-dashed border-gray-500 p-6 mb-4 bg-white">
              <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>纠结症自救实验室</p>
              <p className="text-lg text-black mb-4">{user_profile?.name || '匿名纠结者'}的纠结档案</p>
              <div className="text-left space-y-1 mb-4">
                <p className="text-xs text-gray-600">已完成决策：{decisions.filter(d => d.status === 'completed').length} 个</p>
                <p className="text-xs text-gray-600">纠结码：{buddyCode}</p>
                <p className="text-xs text-gray-600">MBTI：{user_profile?.mbti || '未测'}</p>
              </div>

              {/* 二维码 */}
              <div className="flex flex-col items-center mt-4">
                <div className="p-2 border-2 border-gray-400 bg-white inline-block">
                  <QRCodeSVG
                    value={shareUrl}
                    size={100}
                    level="M"
                    fgColor="#333333"
                    bgColor="#ffffff"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">扫码来一起纠结</p>
              </div>

              <p className="text-xs text-gray-400 mt-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                来一起纠结吧！
              </p>
            </div>
            <p className="text-xs text-gray-500">长按或截图保存图片</p>
          </div>
        </div>
      )}

      {/* 分享链接弹窗 */}
      {showShareLink && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="hand-drawn-box wood-paper-bg p-8 max-w-sm w-full text-center relative">
            <button
              onClick={() => setShowShareLink(false)}
              className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm text-black mb-4" style={{ fontFamily: 'Georgia, serif' }}>分享链接</h3>
            <div className="border-2 border-gray-500 p-3 bg-white mb-4">
              <p className="text-xs text-gray-600 font-mono break-all">
                {shareUrl}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="hand-drawn-box bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
              style={{ boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
            >
              {copied ? '已复制链接' : '复制链接'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
