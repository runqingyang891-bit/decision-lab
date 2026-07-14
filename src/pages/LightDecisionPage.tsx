import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { HandDrawnFrame } from '../components/layout/HandDrawnFrame';
import { HandDrawnInput } from '../components/common/HandDrawnInput';
import { ArrowLeft, RotateCcw, Save, X } from 'lucide-react';

type GameType = 'coin' | 'wheel' | 'scratch' | 'throw';

const WOOD_COLOR = '#D4A574';
const WOOD_HOVER = '#C4956A';

interface GameTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function GameTab({ label, active, onClick }: GameTabProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm transition-all ${
        active
          ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
          : 'bg-white border-2 border-gray-500 shadow-[4px_4px_0px_0px_rgba(107,114,128,0.6)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(107,114,128,0.6)]'
      }`}
    >
      {label}
    </button>
  );
}

function WoodButton({ onClick, disabled, children, className = '' }: { onClick: () => void; disabled?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 text-sm text-white transition-all border-2 border-gray-500 ${className} ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:translate-x-[1px] hover:translate-y-[1px]'
      }`}
      style={{
        backgroundColor: WOOD_COLOR,
        boxShadow: disabled ? 'none' : '4px 4px 0px 0px rgba(107,114,128,0.6)'
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = WOOD_HOVER; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = WOOD_COLOR; }}
    >
      {children}
    </button>
  );
}

interface ResultModalProps {
  title: string;
  result: string;
  onClose: () => void;
}

function ResultModal({ title, result, onClose }: ResultModalProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="hand-drawn-box p-8 max-w-sm w-full text-center wood-paper-bg">
        <div className="text-xs text-gray-500 mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
          [ 实验结果 ]
        </div>
        <h3 className="text-lg text-black mb-6" style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h3>
        <div className="hand-drawn-box bg-white p-4 mb-6">
          <p className="text-lg text-black">{result}</p>
        </div>
        <button
          onClick={onClose}
          className="hand-drawn-box bg-white px-6 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
          style={{ boxShadow: '3px 3px 0px 0px rgba(107,114,128,0.6)' }}
        >
          收下结果
        </button>
      </div>
    </div>
  );
}

function CoinFlipGame({ options, onResult }: { options: string[]; onResult: (result: string) => void }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinY, setCoinY] = useState(0);
  const [coinRotation, setCoinRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFlip = () => {
    if (isFlipping || options.length < 2) return;
    
    setIsFlipping(true);
    setResult(null);
    
    let rotations = 0;
    let position = 0;
    const totalRotations = 20 + Math.floor(Math.random() * 10);
    const targetY = -150;
    
    const flipInterval = setInterval(() => {
      rotations += 36;
      position -= 8;
      
      if (position <= targetY) {
        position = targetY;
      }
      
      setCoinRotation(rotations);
      setCoinY(position);
      
      if (rotations >= totalRotations && position <= targetY) {
        clearInterval(flipInterval);
        
        setTimeout(() => {
          const fallInterval = setInterval(() => {
            position += 15;
            
            if (position >= 0) {
              position = 0;
              clearInterval(fallInterval);
              
              const randomIndex = Math.floor(Math.random() * options.length);
              const finalResult = options[randomIndex];
              setResult(finalResult);
              setIsFlipping(false);
              
              setTimeout(() => {
                setShowModal(true);
                onResult(finalResult);
              }, 1000);
            }
            
            setCoinY(position);
          }, 20);
        }, 300);
      }
    }, 20);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8" style={{ height: '150px' }}>
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-transform"
          style={{
            transform: `translate(-50%, ${coinY}px) rotateY(${coinRotation}deg)`,
            width: '80px',
            height: '80px',
            perspective: '500px'
          }}
        >
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #E8E8E8 0%, #C0C0C0 30%, #A8A8A8 50%, #C0C0C0 70%, #F0F0F0 100%)',
              border: '2px solid #888',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.2)',
              borderRadius: '50%'
            }}
          >
            {result ? (
              <span className="text-black font-bold text-lg" style={{ textShadow: '1px 1px 0 rgba(255,255,255,0.8)' }}>
                {result.charAt(0)}
              </span>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 mb-1" />
                <span className="text-black text-xs font-bold">?</span>
              </div>
            )}
          </div>
        </div>
        
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full"
          style={{ backgroundColor: '#8B4513', opacity: 0.3 }}
        />
      </div>

      <WoodButton onClick={handleFlip} disabled={isFlipping || options.length < 2}>
        开始投掷
      </WoodButton>

      {showModal && result && (
        <ResultModal 
          title="天意如此" 
          result={result} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

function EliminationWheelGame({ options, onResult }: { options: string[]; onResult: (result: string) => void }) {
  const [remainingOptions, setRemainingOptions] = useState<string[]>(options);
  const [isSpinning, setIsSpinning] = useState(false);
  const [eliminated, setEliminated] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  const handleSpin = () => {
    if (isSpinning || remainingOptions.length <= 1) return;

    setIsSpinning(true);
    setEliminated(null);

    const randomIndex = Math.floor(Math.random() * remainingOptions.length);
    const eliminatedOption = remainingOptions[randomIndex];
    const n = remainingOptions.length;

    const sliceAngle = 360 / n;
    const targetCenterAngle = randomIndex * sliceAngle + sliceAngle / 2;
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    const finalRotation = rotation + extraSpins * 360 + (360 - targetCenterAngle);

    setRotation(finalRotation);

    setTimeout(() => {
      setEliminated(eliminatedOption);

      setTimeout(() => {
        setRemainingOptions(remainingOptions.filter((_, i) => i !== randomIndex));

        if (remainingOptions.length === 2) {
          setTimeout(() => {
            setShowModal(true);
            onResult(remainingOptions.filter((_, i) => i !== randomIndex)[0]);
          }, 500);
        }

        setIsSpinning(false);
      }, 800);
    }, 2000);
  };

  if (remainingOptions.length === 1) {
    return (
      <div className="flex flex-col items-center">
        <div className="p-4 border-2 border-gray-500 rounded text-center bg-white">
          <p className="text-sm text-black">最后存活者：</p>
          <p className="text-lg text-black mt-2">{remainingOptions[0]}</p>
        </div>
        <button
          onClick={() => {
            setRemainingOptions(options);
            setRotation(0);
          }}
          className="mt-6 px-4 py-2 border-2 border-gray-500 rounded text-xs hover:bg-gray-50 transition-colors"
        >
          重新开始
        </button>
        {showModal && (
          <ResultModal 
            title="最终赢家" 
            result={remainingOptions[0]} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-72 h-72 mb-8">
        <div 
          className="absolute inset-4 rounded-full"
          style={{ backgroundColor: '#B8956A', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}
        />
        
        <div
          className="absolute inset-6 rounded-full overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {remainingOptions.map((option, index) => {
              const angle = (index / remainingOptions.length) * 360;
              const nextAngle = ((index + 1) / remainingOptions.length) * 360;
              const midAngle = (angle + nextAngle) / 2;
              const x = 100 + 70 * Math.cos((midAngle - 90) * Math.PI / 180);
              const y = 100 + 70 * Math.sin((midAngle - 90) * Math.PI / 180);
              const fontSize = Math.max(9, Math.min(14, 80 / remainingOptions.length));
              const maxLength = Math.max(3, Math.floor(120 / remainingOptions.length));
              const displayText = option.length > maxLength ? option.slice(0, maxLength) + '..' : option;
              
              return (
                <g key={index}>
                  <path
                    d={`M100,100 L100,30 A70,70 0 0,1 ${
                      100 + 70 * Math.cos((nextAngle - 90) * Math.PI / 180)
                    },${100 + 70 * Math.sin((nextAngle - 90) * Math.PI / 180)} Z`}
                    fill={colors[index % colors.length]}
                    stroke="#333"
                    strokeWidth="2"
                    className={eliminated === option ? 'opacity-30' : ''}
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    className={eliminated === option ? 'opacity-30' : ''}
                    fill="white"
                    style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {displayText}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="18" fill="#FFD700" stroke="#B8956A" strokeWidth="3" />
            <circle cx="100" cy="100" r="8" fill="#B8956A" />
          </svg>
        </div>
        
        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
          style={{
            width: '0',
            height: '0',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '25px solid #FF4A4A',
            filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))'
          }}
        />
        
        <div 
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-8 rounded"
          style={{ backgroundColor: '#B8956A', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}
        />
      </div>

      <WoodButton onClick={handleSpin} disabled={isSpinning}>
        开始排除
      </WoodButton>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {options.map((option) => (
          <span
            key={option}
            className={`px-3 py-1 border-2 border-gray-500 rounded text-xs ${
              remainingOptions.includes(option)
                ? 'bg-white text-black'
                : 'bg-white text-gray-400 line-through opacity-50'
            }`}
          >
            {option}
          </span>
        ))}
      </div>

      {showModal && (
        <ResultModal 
          title="转盘停在了" 
          result={remainingOptions[0]} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

function ScratchCardGame({ options, onResult }: { options: string[]; onResult: (result: string) => void }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleScratch = () => {
    if (revealed || options.length === 0) return;
    
    if (selectedOption === null) {
      const randomIndex = Math.floor(Math.random() * options.length);
      setSelectedOption(options[randomIndex]);
    }
    
    setScratchProgress(prev => {
      const increment = 15 + Math.floor(Math.random() * 10);
      const newProgress = Math.min(prev + increment, 100);
      
      if (newProgress >= 100) {
        setTimeout(() => {
          setRevealed(true);
          setTimeout(() => {
            setShowModal(true);
            onResult(selectedOption || '');
          }, 1000);
        }, 300);
        return 100;
      }
      return newProgress;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-56 h-36 mb-8">
        <div 
          className="absolute inset-0 border-2 border-gray-500 rounded flex items-center justify-center"
          style={{ backgroundColor: '#E8F5E9' }}
        >
          {revealed && selectedOption ? (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">答案揭晓</p>
              <p className="text-lg text-black font-bold">{selectedOption}</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">???</p>
              <p className="text-[10px] text-gray-300">点击刮开查看结果</p>
            </div>
          )}
        </div>
        
        {!revealed && (
          <>
            <div 
              className="absolute top-0 left-0 right-0 h-1/2 rounded-t transition-all duration-300"
              style={{ 
                backgroundColor: '#8B4513',
                clipPath: `polygon(0 0, 100% 0, ${100 - scratchProgress}% 100%, ${scratchProgress}% 100%)`
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-2 flex justify-center">
                <div className="flex">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 h-full mx-px" style={{ backgroundColor: '#D4A574' }} />
                  ))}
                </div>
              </div>
            </div>
            
            <div 
              className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b transition-all duration-300"
              style={{ 
                backgroundColor: '#8B4513',
                clipPath: `polygon(${scratchProgress}% 0, ${100 - scratchProgress}% 0, 100% 100%, 0 100%)`
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-2 flex justify-center">
                <div className="flex">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-1 h-full mx-px" style={{ backgroundColor: '#D4A574' }} />
                  ))}
                </div>
              </div>
            </div>
            
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
              style={{ 
                top: 'calc(50% - 12px)',
                backgroundColor: '#FFD700',
                border: '2px solid #8B4513',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transform: `translateX(calc(-50% + ${(scratchProgress - 50) * 2}px))`
              }}
            >
              <div className="w-3 h-0.5 bg-gray-500 rounded" />
            </div>
          </>
        )}
      </div>

      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">刮开进度：{scratchProgress}%</p>
      </div>

      {!revealed ? (
        <WoodButton onClick={handleScratch}>
          开始刮刮
        </WoodButton>
      ) : (
        <div className="text-center">
          <p className="text-sm text-black mb-4">薛定谔的选择：{selectedOption}</p>
          <button
            onClick={() => {
              setRevealed(false);
              setSelectedOption(null);
              setScratchProgress(0);
            }}
            className="px-4 py-2 border-2 border-gray-500 rounded text-xs hover:bg-gray-50 transition-colors"
          >
            再来一次
          </button>
        </div>
      )}

      {showModal && selectedOption && (
        <ResultModal 
          title="答案揭晓" 
          result={selectedOption} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

function SubconsciousThrowGame({ options, onResult }: { options: string[]; onResult: (result: string) => void }) {
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showGlassShatter, setShowGlassShatter] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const handleClick = () => {
    if (result) return;
    
    setClickCount(prev => prev + 1);
    
    const increment = 10 + Math.floor(Math.random() * 10);
    setProgress((prev) => {
      const newProgress = Math.min(prev + increment, 100);
      
      if (newProgress >= 100) {
        setShowGlassShatter(true);
        setTimeout(() => {
          setShowGlassShatter(false);
          setShowPrompt(true);
          const randomIndex = Math.floor(Math.random() * options.length);
          const finalResult = options[randomIndex];
          setResult(finalResult);
          
          setTimeout(() => {
            setShowPrompt(false);
            setShowModal(true);
            onResult(finalResult);
          }, 2000);
        }, 1000);
        return 100;
      }
      return newProgress;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <p className="text-sm text-black mb-2">潜意识投掷器</p>
        <p className="text-xs text-gray-500">点击按钮蓄力，蓄力满后揭晓答案</p>
      </div>

      <div className="w-56 h-20 mb-8">
        <div className="h-full border-2 border-gray-500 rounded bg-white relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full transition-all duration-200"
            style={{ width: `${progress}%`, backgroundColor: WOOD_COLOR }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-lg ${progress > 80 ? 'animate-shake text-white' : 'text-black'}`}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 text-center">
        <p className="text-xs text-gray-500">点击次数：{clickCount} 次</p>
      </div>

      <button
        onClick={handleClick}
        disabled={!!result}
        className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-base transition-all border-2 border-gray-500 ${
          result ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor: WOOD_COLOR,
          boxShadow: result ? 'none' : '4px 4px 0px 0px rgba(107,114,128,0.6)',
          transform: result ? 'scale(1)' : 'scale(1)'
        }}
        onMouseDown={(e) => {
          if (!result) e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          if (!result) e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseLeave={(e) => {
          if (!result) e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {result ? '完成' : '蓄力'}
      </button>

      {result && (
        <div className="mt-8 p-4 border-2 border-gray-500 rounded text-center bg-white">
          <p className="text-sm text-black">潜意识选择：{result}</p>
          <button
            onClick={() => {
              setProgress(0);
              setResult(null);
              setClickCount(0);
              setShowGlassShatter(false);
              setShowPrompt(false);
            }}
            className="mt-3 px-4 py-2 border-2 border-gray-500 rounded text-xs hover:bg-gray-50 transition-colors"
          >
            再来一次
          </button>
        </div>
      )}

      {showGlassShatter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative w-full h-full">
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30) * Math.PI / 180;
              const distance = 100 + Math.random() * 200;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;
              const delay = Math.random() * 0.1;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    animation: `glassShard 0.8s ease-out ${delay}s forwards`,
                    ['--shard-x' as string]: `${x}px`,
                    ['--shard-y' as string]: `${y}px`,
                  }}
                >
                  <div
                    className="border-2 border-white bg-white/30"
                    style={{
                      width: `${10 + Math.random() * 20}px`,
                      height: `${10 + Math.random() * 20}px`,
                      clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                      transform: `rotate(${i * 30}deg)`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showPrompt && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-lg text-white hand-font" style={{ animation: 'fadeInUp 0.5s ease-out' }}>
              在蓄力完成的那一刻，你最希望看到什么？
            </p>
          </div>
        </div>
      )}

      {showModal && result && (
        <ResultModal 
          title="潜意识的声音" 
          result={result} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
}

const GAME_LABELS: Record<GameType, string> = {
  coin: '概率奇点硬币',
  wheel: '反向排除转盘',
  scratch: '薛定谔刮刮乐',
  throw: '潜意识投掷器',
};

export function LightDecisionPage() {
  const navigate = useNavigate();
  const addDecision = useAppStore((state) => state.addDecision);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [activeGame, setActiveGame] = useState<GameType>('coin');
  const [savedFlash, setSavedFlash] = useState(false);

  const isCoinGame = activeGame === 'coin';

  const addOption = () => {
    if (!isCoinGame && options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (!isCoinGame && options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const isValidOptions = options.every((o) => o.trim() !== '') && options.length >= 2;

  const handleSave = () => {
    if (!isValidOptions) return;
    
    const validOptions = options.filter(o => o.trim());
    const fw = validOptions.map(o => ({ name: o, importance: 0, weightA: 0, weightB: 0 }));
    
    addDecision({
      title: `${GAME_LABELS[activeGame]}：${validOptions.join(' vs ')}`,
      type: 'short_term',
      status: 'completed',
      options: validOptions,
      factors: [],
      hiddenFactors: [],
      factorWeights: fw
    });
    
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleGameResult = (result: string) => {
    handleSave();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/hub')}
              className="p-2 border-2 border-gray-500 rounded hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl hand-font text-black">轻度纠结处理器</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={!isValidOptions}
            className={`px-4 py-2 border-2 border-gray-500 rounded text-sm flex items-center gap-2 transition-all ${
              isValidOptions
                ? 'hover:bg-gray-50 cursor-pointer bg-white'
                : 'opacity-50 cursor-not-allowed bg-gray-100'
            }`}
            style={{ boxShadow: isValidOptions ? '3px 3px 0px 0px rgba(107,114,128,0.6)' : 'none' }}
          >
            <Save className="w-4 h-4" />
            {savedFlash ? '已存档' : '存档'}
          </button>
        </div>

        <HandDrawnFrame className="mb-6">
          <div className="wood-paper-bg p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm text-black">
                输入纠结选项{isCoinGame ? '（2个）' : '（2-6个）'}
              </h2>
              {!isCoinGame && options.length < 6 && (
                <button
                  onClick={addOption}
                  className="text-xs text-gray-500 hover:text-black transition-colors"
                >
                  + 添加选项
                </button>
              )}
            </div>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-gray-500 text-white rounded flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <HandDrawnInput
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`选项 ${index + 1}`}
                  />
                  {!isCoinGame && options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="p-2 border-2 border-gray-500 rounded hover:bg-gray-50 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isCoinGame && (
              <p className="text-xs text-gray-400 mt-3">
                概率奇点硬币模式仅支持2个选项
              </p>
            )}
          </div>
        </HandDrawnFrame>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <GameTab
            label="概率奇点硬币"
            active={activeGame === 'coin'}
            onClick={() => {
              setActiveGame('coin');
              setOptions(['', '']);
            }}
          />
          <GameTab
            label="反向排除转盘"
            active={activeGame === 'wheel'}
            onClick={() => setActiveGame('wheel')}
          />
          <GameTab
            label="薛定谔刮刮乐"
            active={activeGame === 'scratch'}
            onClick={() => setActiveGame('scratch')}
          />
          <GameTab
            label="潜意识投掷器"
            active={activeGame === 'throw'}
            onClick={() => setActiveGame('throw')}
          />
        </div>

        <HandDrawnFrame className="min-h-[350px] flex items-center justify-center">
          <div className="wood-paper-bg w-full h-full p-6 rounded-lg flex items-center justify-center">
            {!isValidOptions ? (
              <div className="text-center">
                <p className="text-sm text-black mb-2">请先输入有效的选项</p>
                <p className="text-xs text-gray-400">每个选项不能为空，至少需要2个选项</p>
              </div>
            ) : (
              <>
                {activeGame === 'coin' && <CoinFlipGame key={options.join(',')} options={options} onResult={handleGameResult} />}
                {activeGame === 'wheel' && <EliminationWheelGame key={options.join(',')} options={options} onResult={handleGameResult} />}
                {activeGame === 'scratch' && <ScratchCardGame key={options.join(',')} options={options} onResult={handleGameResult} />}
                {activeGame === 'throw' && <SubconsciousThrowGame key={options.join(',')} options={options} onResult={handleGameResult} />}
              </>
            )}
          </div>
        </HandDrawnFrame>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/hub')}
            className="p-2 border-2 border-gray-500 rounded hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            返回首页
          </button>
          <button
            onClick={() => setOptions(['', ''])}
            className="px-4 py-2 border-2 border-gray-500 rounded hover:bg-gray-50 transition-colors text-sm"
          >
            重置选项
          </button>
        </div>
      </div>
    </div>
  );
}
