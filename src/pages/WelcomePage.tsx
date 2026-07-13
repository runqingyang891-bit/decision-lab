import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { HandDrawnFrame } from '../components/layout/HandDrawnFrame';
import { MagicButton } from '../components/common/MagicButton';
import { HandDrawnInput } from '../components/common/HandDrawnInput';
import { HandDrawnSelect } from '../components/common/HandDrawnSelect';
import { HandDrawnCheckbox } from '../components/common/HandDrawnCheckbox';
import { ZODIAC_SIGNS, MBTI_TYPES } from '../utils/constants';

export function WelcomePage() {
  const navigate = useNavigate();
  const setUserProfile = useAppStore((state) => state.setUserProfile);
  
  const [name, setName] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [mbti, setMbti] = useState('');
  const [agreements, setAgreements] = useState({
    agree1: false,
    agree2: false,
    agree3: false
  });
  const [isPressed, setIsPressed] = useState(false);

  const handleSubmit = () => {
    if (!name || !agreements.agree1 || !agreements.agree2) return;
    
    setIsPressed(true);
    
    setTimeout(() => {
      setUserProfile({
        name,
        zodiac,
        mbti: mbti.toUpperCase(),
        reg_date: new Date().toISOString().split('T')[0]
      });
      navigate('/hub');
    }, 150);
  };

  const isFormValid = name && agreements.agree1 && agreements.agree2;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <HandDrawnFrame className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-2xl hand-font mb-2 text-black">
            纠结症自救实验室
          </h1>
          <p className="text-xs text-gray-400">V1.0</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <div>
            <label className="block text-black text-sm mb-2">
              实验代号（姓名）<span className="text-magic-red">*</span>
            </label>
            <HandDrawnInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入你的代号"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-black text-sm mb-2">
              星座（选填）
            </label>
            <HandDrawnSelect
              value={zodiac}
              onChange={setZodiac}
              options={ZODIAC_SIGNS}
              placeholder="如 天蝎座"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-black text-sm mb-2">
              MBTI（选填）
            </label>
            <HandDrawnInput
              value={mbti}
              onChange={(e) => setMbti(e.target.value.toUpperCase())}
              placeholder="如 INTJ"
              maxLength={4}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <HandDrawnCheckbox
              checked={agreements.agree1}
              onChange={(checked) => setAgreements({ ...agreements, agree1: checked })}
              label="本实验室结论仅供参考。"
            />
            <HandDrawnCheckbox
              checked={agreements.agree2}
              onChange={(checked) => setAgreements({ ...agreements, agree2: checked })}
              label="我允许一个卡通计算器拷问我的灵魂。"
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full hand-drawn-box bg-white py-3 text-black text-sm transition-all ${
                isFormValid 
                  ? 'hover:bg-gray-50 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ boxShadow: isFormValid ? '3px 3px 0px 0px rgba(0,0,0,1)' : 'none' }}
            >
              初始协议签订
            </button>
          </div>
        </form>

        <div className="mt-8 flex justify-center">
          <div
            className="px-4 py-2 border-2 border-dashed border-black text-xs text-gray-600"
            style={{
              transform: 'rotate(-3deg)',
              fontFamily: 'Georgia, serif'
            }}
          >
            机密档案
          </div>
        </div>
      </HandDrawnFrame>
    </div>
  );
}
