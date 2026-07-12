import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { HandDrawnFrame } from '../components/layout/HandDrawnFrame';
import { HandDrawnInput } from '../components/common/HandDrawnInput';
import { ArrowLeft, RotateCcw, Save } from 'lucide-react';

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
          : 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
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
      className={`px-5 py-2 text-sm text-white transition-all border-2 border-black ${className} ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:translate-x-[1px] hover:translate-y-[1px]'
      }`}
      style={{
        backgroundColor: WOOD_COLOR,
        boxShadow: disabled ? 'none' : '4px 4px 0px 0px rgba(0,0,0,1)'
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = WOOD_HOVER; }}
      onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = WOOD_COLOR; }}
    >
      {children}
    </button>
  );
}

function CoinFlipGame({ options }: { options: string[] }) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showBubble, setShowBubble] = useState(false);

  const handleFlip = () => {
    if (isFlipping || options.length < 2) return;
    
    setIsFlipping(true);
    setResult(null);
    setShowBubble(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setResult(options[randomIndex]);
      setIsFlipping(false);
      
      setTimeout(() => {
        setShowBubble(false);
      }, 2000);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center">
      {showBubble && (
        <div className="mb-8 p-3 border-2 border-black rounded text-center max-w-xs animate-float bg-white">
          <p className="text-xs italic text-gray-700">
            "在硬币落地的这一刻，你其实已经知道自己更希望是哪一面了。"
          </p>
        </div>
      )}

      <div className="relative mb-8">
        <div
          className={`w-32 h-32 rounded-full border-4 border-black flex items-center justify-center text-2xl transition-transform ${
            isFlipping ? 'animate-spin-slow' : ''
          }`}
          style={{
            background: '#FDFBF7',
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)'
          }}
        >
          {isFlipping ? (
            <span className="text-black">?</span>
          ) : result ? (
            <span className="text-black text-sm">{result.charAt(0)}</span>
          ) : (
            <span className="text-black">?</span>
          )}
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
          {isFlipping ? '旋转中...' : result ? `结果: ${result}` : '点击开始'}
        </div>
      </div>

      <WoodButton onClick={handleFlip} disabled={isFlipping || options.length < 2}>
        开始投掷
      </WoodButton>

      {result && (
        <div className="mt-8 p-3 border-2 border-black rounded text-center bg-white">
          <p className="text-sm text-black">天意如此：{result}</p>
        </div>
      )}
    </div>
  );
}

function EliminationWheelGame({ options }: { options: string[] }) {
  const [remainingOptions, setRemainingOptions] = useState<string[]>(options);
  const [isSpinning, setIsSpinning] = useState(false);
  const [eliminated, setEliminated] = useState<string | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSpin = () => {
    if (isSpinning || remainingOptions.length <= 1) return;
    
    setIsSpinning(true);
    setEliminated(null);
    setShowComment(false);
    
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
      setIsSpinning(false);
      setShowComment(true);
      
      setTimeout(() => {
        setRemainingOptions(remainingOptions.filter((_, i) => i !== randomIndex));
        setShowComment(false);
      }, 2000);
    }, 3000);
  };

  if (remainingOptions.length === 1) {
    return (
      <div className="flex flex-col items-center">
        <div className="p-4 border-2 border-black rounded text-center bg-white">
          <p className="text-sm text-black">最后存活者：</p>
          <p className="text-lg text-black mt-2">{remainingOptions[0]}</p>
        </div>
        <button
          onClick={() => {
            setRemainingOptions(options);
            setRotation(0);
          }}
          className="mt-6 px-4 py-2 border-2 border-black rounded text-xs hover:bg-gray-50 transition-colors"
        >
          重新开始
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {showComment && eliminated && (
        <div className="mb-6 p-3 border-2 border-black rounded text-center bg-white">
          <p className="text-xs italic text-gray-700">
            "看着「{eliminated}」被永久剔除，你心里是不是咯噔了一下？"
          </p>
        </div>
      )}

      <div className="relative w-56 h-56 mb-8">
        <div
          className="w-full h-full"
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
              const x = 100 + 80 * Math.cos((midAngle - 90) * Math.PI / 180);
              const y = 100 + 80 * Math.sin((midAngle - 90) * Math.PI / 180);
              
              return (
                <g key={index}>
                  <path
                    d={`M100,100 L100,20 A80,80 0 0,1 ${
                      100 + 80 * Math.cos((nextAngle - 90) * Math.PI / 180)
                    },${100 + 80 * Math.sin((nextAngle - 90) * Math.PI / 180)} Z`}
                    fill="#FDFBF7"
                    stroke="black"
                    strokeWidth="2"
                    className={eliminated === option ? 'opacity-20' : ''}
                  />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    className={eliminated === option ? 'opacity-20' : ''}
                    fill="black"
                  >
                    {option.length > 6 ? option.slice(0, 6) + '...' : option}
                  </text>
                </g>
              );
            })}
            <circle cx="100" cy="100" r="15" fill={WOOD_COLOR} stroke="black" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-black" />
      </div>

      <WoodButton onClick={handleSpin} disabled={isSpinning}>
        开始排除
      </WoodButton>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {options.map((option) => (
          <span
            key={option}
            className={`px-3 py-1 border-2 border-black rounded text-xs ${
              remainingOptions.includes(option)
                ? 'bg-white text-black'
                : 'bg-white text-gray-400 line-through opacity-50'
            }`}
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

function ScratchCardGame({ options }: { options: string[] }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  const handleScratch = () => {
    if (revealed || options.length === 0) return;
    
    setShowWarning(true);
    
    setTimeout(() => {
      setShowWarning(false);
      const randomIndex = Math.floor(Math.random() * options.length);
      setSelectedOption(options[randomIndex]);
      setRevealed(true);
    }, 1500);
  };

  const handleProgress = () => {
    if (scratchProgress >= 90) {
      handleScratch();
    } else {
      setScratchProgress(Math.min(scratchProgress + 20, 90));
    }
  };

  return (
    <div className="flex flex-col items-center">
      {showWarning && (
        <div className="mb-6 p-3 border-2 border-black rounded text-center bg-white">
          <p className="text-xs italic text-gray-700">
            "如果现在拉开，你最害怕看到哪一个选项？"
          </p>
        </div>
      )}

      <div className="relative w-56 h-32 mb-8 cursor-pointer" onClick={handleProgress}>
        <div className="absolute inset-0 bg-white border-2 border-black rounded flex items-center justify-center">
          {revealed && selectedOption ? (
            <p className="text-sm text-black">{selectedOption}</p>
          ) : (
            <p className="text-gray-400 text-sm">选项内容</p>
          )}
        </div>
        
        {!revealed && (
          <div 
            className="absolute inset-0 rounded flex items-center justify-center transition-opacity"
            style={{ 
              opacity: 1 - scratchProgress / 100,
              backgroundColor: WOOD_COLOR
            }}
          >
            <div className="text-white text-xs text-center">
              <p>点击刮开涂层</p>
              <p className="text-xs mt-2">进度: {scratchProgress}%</p>
            </div>
          </div>
        )}
      </div>

      {!revealed ? (
        <WoodButton onClick={handleProgress}>
          刮开涂层
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
            className="px-4 py-2 border-2 border-black rounded text-xs hover:bg-gray-50 transition-colors"
          >
            再来一次
          </button>
        </div>
      )}
    </div>
  );
}

function SubconsciousThrowGame({ options }: { options: string[] }) {
  const [progress, setProgress] = useState(0);
  const [isCharging, setIsCharging] = useState(false);
  const [isOverloaded, setIsOverloaded] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleCharge = () => {
    if (isOverloaded || result) return;
    
    setIsCharging(true);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 99) {
          clearInterval(interval);
          setIsOverloaded(true);
          
          setTimeout(() => {
            setIsOverloaded(false);
            const randomIndex = Math.floor(Math.random() * options.length);
            setResult(options[randomIndex]);
            setIsCharging(false);
          }, 1500);
          
          return 100;
        }
        return Math.min(prev + 5 + Math.random() * 5, 99);
      });
    }, 100);
  };

  const handleRelease = () => {
    setIsCharging(false);
  };

  if (isOverloaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center animate-pulse">
          <p className="text-2xl mb-4">能量超载！</p>
          <p className="text-base">
            如果系统现在替你随机消灭一个选项，你最不想谁死掉？
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8 text-center">
        <p className="text-sm text-black mb-2">潜意识投掷器</p>
        <p className="text-xs text-gray-500">按住按钮蓄力，释放后揭晓答案</p>
      </div>

      <div className="w-56 h-20 mb-8">
        <div className="h-full border-2 border-black rounded bg-white relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full transition-all duration-75"
            style={{ width: `${progress}%`, backgroundColor: WOOD_COLOR }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-lg ${progress > 80 ? 'animate-shake text-white' : 'text-black'}`}>
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </div>

      <button
        onMouseDown={handleCharge}
        onMouseUp={handleRelease}
        onMouseLeave={handleRelease}
        onTouchStart={handleCharge}
        onTouchEnd={handleRelease}
        disabled={isOverloaded || !!result}
        className={`w-28 h-28 rounded-full flex items-center justify-center text-white text-base transition-all border-2 border-black ${
          result ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor: isCharging ? WOOD_HOVER : WOOD_COLOR,
          boxShadow: isCharging || result ? 'none' : '4px 4px 0px 0px rgba(0,0,0,1)',
          transform: isCharging ? 'scale(0.95)' : 'scale(1)'
        }}
      >
        {result ? '完成' : '蓄力'}
      </button>

      {result && (
        <div className="mt-8 p-4 border-2 border-black rounded text-center bg-white">
          <p className="text-sm text-black">潜意识选择：{result}</p>
          <button
            onClick={() => {
              setProgress(0);
              setResult(null);
            }}
            className="mt-3 px-4 py-2 border-2 border-black rounded text-xs hover:bg-gray-50 transition-colors"
          >
            再来一次
          </button>
        </div>
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/hub')}
              className="p-2 border-2 border-black rounded hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl hand-font text-black">轻度纠结处理器</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={!isValidOptions}
            className={`px-4 py-2 border-2 border-black rounded text-sm flex items-center gap-2 transition-all ${
              isValidOptions
                ? 'hover:bg-gray-50 cursor-pointer bg-white'
                : 'opacity-50 cursor-not-allowed bg-gray-100'
            }`}
            style={{ boxShadow: isValidOptions ? '3px 3px 0px 0px rgba(0,0,0,1)' : 'none' }}
          >
            <Save className="w-4 h-4" />
            {savedFlash ? '已存档' : '存档'}
          </button>
        </div>

        <HandDrawnFrame className="mb-6">
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
                <span className="w-5 h-5 bg-black text-white rounded flex items-center justify-center text-xs">
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
                    className="p-2 border-2 border-black rounded hover:bg-gray-50 transition-colors text-xs"
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
          {!isValidOptions ? (
            <div className="text-center">
              <p className="text-sm text-black mb-2">请先输入有效的选项</p>
              <p className="text-xs text-gray-400">每个选项不能为空，至少需要2个选项</p>
            </div>
          ) : (
            <>
              {activeGame === 'coin' && <CoinFlipGame options={options} />}
              {activeGame === 'wheel' && <EliminationWheelGame options={options} />}
              {activeGame === 'scratch' && <ScratchCardGame options={options} />}
              {activeGame === 'throw' && <SubconsciousThrowGame options={options} />}
            </>
          )}
        </HandDrawnFrame>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate('/hub')}
            className="p-2 border-2 border-black rounded hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            返回首页
          </button>
          <button
            onClick={() => setOptions(['', ''])}
            className="px-4 py-2 border-2 border-black rounded hover:bg-gray-50 transition-colors text-sm"
          >
            重置选项
          </button>
        </div>
      </div>
    </div>
  );
}
