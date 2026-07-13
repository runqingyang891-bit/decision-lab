interface FloatingLabItemProps {
  type: 'microscope' | 'flask' | 'beaker' | 'testtube' | 'bunsen' | 'atom' | 'dna' | 'brain' | 'syringe' | 'petri' | 'graduated' | 'centrifuge';
  left: string;
  top: string;
  size: number;
  delay: number;
  duration: number;
}

function FloatingLabItem({ type, left, top, size, delay, duration }: FloatingLabItemProps) {
  const renderIcon = () => {
    const s = size;
    switch (type) {
      case 'microscope':
        return (
          <svg viewBox="0 0 100 120" width={s} height={s * 1.2} className="text-gray-500 opacity-60">
            <circle cx="50" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="3"/>
            <rect x="45" y="45" width="10" height="50" fill="none" stroke="currentColor" strokeWidth="3"/>
            <rect x="35" y="90" width="30" height="8" fill="none" stroke="currentColor" strokeWidth="3"/>
            <rect x="25" y="98" width="50" height="5" fill="none" stroke="currentColor" strokeWidth="3"/>
            <circle cx="50" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'flask':
        return (
          <svg viewBox="0 0 80 100" width={s} height={s * 1.25} className="text-amber-600 opacity-65">
            <path d="M20,60 L25,25 Q40,10 60,25 L65,60" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M25,60 L60,60" stroke="currentColor" strokeWidth="3"/>
            <path d="M25,60 L15,75 L60,75 L60,60" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M35,20 L50,20" stroke="currentColor" strokeWidth="3"/>
            <path d="M40,50 L55,50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
          </svg>
        );
      case 'beaker':
        return (
          <svg viewBox="0 0 90 100" width={s} height={s * 1.11} className="text-blue-600 opacity-65">
            <path d="M15,30 L20,90 L75,90 L80,30" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M15,30 L80,30" stroke="currentColor" strokeWidth="3"/>
            <path d="M25,50 L70,50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
            <path d="M25,70 L70,70" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
            <rect x="65" y="15" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          </svg>
        );
      case 'testtube':
        return (
          <svg viewBox="0 0 30 100" width={s * 0.33} height={s} className="text-green-600 opacity-65">
            <rect x="5" y="15" width="20" height="70" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M5,15 Q15,0 25,15" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M5,55 L25,55" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
            <rect x="2" y="85" width="26" height="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'bunsen':
        return (
          <svg viewBox="0 0 60 80" width={s * 0.67} height={s} className="text-orange-600 opacity-65">
            <rect x="20" y="50" width="20" height="25" fill="none" stroke="currentColor" strokeWidth="3"/>
            <rect x="25" y="35" width="10" height="15" fill="none" stroke="currentColor" strokeWidth="3"/>
            <circle cx="30" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M30,18 L30,5" stroke="currentColor" strokeWidth="3"/>
            <path d="M28,3 L30,5 L32,3" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M25,30 Q20,20 28,12" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
            <path d="M35,30 Q40,20 32,12" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
          </svg>
        );
      case 'atom':
        return (
          <svg viewBox="0 0 80 80" width={s} height={s} className="text-purple-600 opacity-65">
            <circle cx="40" cy="40" r="6" fill="currentColor"/>
            <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
            <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" transform="rotate(60 40 40)"/>
            <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" transform="rotate(120 40 40)"/>
            <circle cx="40" cy="15" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="65" cy="40" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="40" cy="65" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'dna':
        return (
          <svg viewBox="0 0 40 100" width={s * 0.4} height={s} className="text-pink-600 opacity-65">
            <path d="M20,5 Q35,20 20,35 Q5,50 20,65 Q35,80 20,95" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M20,5 Q5,20 20,35 Q35,50 20,65 Q5,80 20,95" fill="none" stroke="currentColor" strokeWidth="3"/>
            <circle cx="20" cy="5" r="5" fill="currentColor"/>
            <circle cx="20" cy="35" r="5" fill="currentColor"/>
            <circle cx="20" cy="65" r="5" fill="currentColor"/>
            <circle cx="20" cy="95" r="5" fill="currentColor"/>
          </svg>
        );
      case 'brain':
        return (
          <svg viewBox="0 0 100 80" width={s * 1.25} height={s} className="text-gray-600 opacity-60">
            <path d="M15,40 Q10,20 30,15 Q50,10 70,15 Q90,20 85,40" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M15,40 Q10,60 30,65 Q50,70 70,65 Q90,60 85,40" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M45,25 Q50,35 45,45" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M55,25 Q50,35 55,45" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M40,35 Q50,45 60,35" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="25" cy="30" r="4" fill="currentColor"/>
            <circle cx="75" cy="30" r="4" fill="currentColor"/>
            <circle cx="25" cy="50" r="4" fill="currentColor"/>
            <circle cx="75" cy="50" r="4" fill="currentColor"/>
          </svg>
        );
      case 'syringe':
        return (
          <svg viewBox="0 0 40 120" width={s * 0.33} height={s * 1.2} className="text-red-500 opacity-60">
            <rect x="15" y="40" width="10" height="60" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M15,40 L15,30 Q20,15 25,30 L25,40" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M10,90 L30,90" stroke="currentColor" strokeWidth="2"/>
            <circle cx="20" cy="25" r="3" fill="currentColor"/>
          </svg>
        );
      case 'petri':
        return (
          <svg viewBox="0 0 80 40" width={s} height={s * 0.5} className="text-teal-600 opacity-60">
            <ellipse cx="40" cy="20" rx="35" ry="15" fill="none" stroke="currentColor" strokeWidth="3"/>
            <ellipse cx="40" cy="22" rx="30" ry="10" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="25" cy="18" r="3" fill="currentColor" opacity="0.5"/>
            <circle cx="45" cy="22" r="4" fill="currentColor" opacity="0.5"/>
            <circle cx="55" cy="15" r="2" fill="currentColor" opacity="0.5"/>
          </svg>
        );
      case 'graduated':
        return (
          <svg viewBox="0 0 50 100" width={s * 0.5} height={s} className="text-indigo-600 opacity-65">
            <path d="M10,20 L15,95 L40,95 L45,20 Q27.5,5 10,20" fill="none" stroke="currentColor" strokeWidth="3"/>
            <path d="M45,30 L50,30" stroke="currentColor" strokeWidth="2"/>
            <path d="M45,45 L50,45" stroke="currentColor" strokeWidth="2"/>
            <path d="M45,60 L50,60" stroke="currentColor" strokeWidth="2"/>
            <path d="M45,75 L50,75" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'centrifuge':
        return (
          <svg viewBox="0 0 80 80" width={s} height={s} className="text-cyan-600 opacity-60">
            <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="3"/>
            <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M40,5 L40,15 M40,65 L40,75 M5,40 L15,40 M65,40 L75,40" stroke="currentColor" strokeWidth="2"/>
            <circle cx="25" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="55" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="25" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="55" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed pointer-events-none z-0"
      style={{
        left,
        top,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {renderIcon()}
    </div>
  );
}

export function FloatingLabDecorations() {
  const items: FloatingLabItemProps[] = [
    { type: 'microscope', left: '5%', top: '10%', size: 45, delay: 0, duration: 8 },
    { type: 'flask', left: '90%', top: '15%', size: 40, delay: 2, duration: 10 },
    { type: 'beaker', left: '8%', top: '60%', size: 35, delay: 1, duration: 12 },
    { type: 'testtube', left: '92%', top: '55%', size: 55, delay: 3, duration: 9 },
    { type: 'bunsen', left: '5%', top: '85%', size: 50, delay: 0.5, duration: 11 },
    { type: 'atom', left: '88%', top: '80%', size: 40, delay: 4, duration: 7 },
    { type: 'dna', left: '2%', top: '35%', size: 45, delay: 2.5, duration: 13 },
    { type: 'brain', left: '95%', top: '30%', size: 35, delay: 1.5, duration: 14 },
    { type: 'syringe', left: '15%', top: '25%', size: 50, delay: 5, duration: 9 },
    { type: 'petri', left: '80%', top: '45%', size: 45, delay: 3.5, duration: 11 },
    { type: 'graduated', left: '3%', top: '55%', size: 45, delay: 1, duration: 10 },
    { type: 'centrifuge', left: '93%', top: '65%', size: 38, delay: 4.5, duration: 8 },
    { type: 'flask', left: '20%', top: '75%', size: 35, delay: 6, duration: 12 },
    { type: 'microscope', left: '75%', top: '10%', size: 38, delay: 2, duration: 9 },
    { type: 'atom', left: '12%', top: '45%', size: 35, delay: 3, duration: 10 },
    { type: 'dna', left: '85%', top: '90%', size: 42, delay: 5.5, duration: 11 },
  ];

  return (
    <>
      {items.map((item, index) => (
        <FloatingLabItem key={index} {...item} />
      ))}
    </>
  );
}

export function LabFooterDecoration() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-0 pointer-events-none">
      <svg viewBox="0 0 1400 150" className="w-full h-auto opacity-40">
        <path d="M40,130 L40,95 L80,95 L80,110 L130,110 L130,80 L170,80 L170,105 L210,105 L210,65" 
              fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="120" cy="50" r="35" fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        <path d="M95,50 L145,50 M120,25 L120,75" stroke="#1a1a1a" strokeWidth="2"/>
        
        <path d="M280,130 L280,55 L360,55 L360,80 L310,80 L310,105 L380,105 L380,55" 
              fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
        
        <path d="M480,130 L480,65 L520,65 L520,40 L600,40 L600,65 L640,65 L640,130" 
              fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        <path d="M495,90 L625,90 M495,110 L625,110" stroke="#1a1a1a" strokeWidth="2"/>
        
        <circle cx="750" cy="85" r="30" fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        <circle cx="750" cy="85" r="18" fill="none" stroke="#1a1a1a" strokeWidth="2"/>
        <circle cx="750" cy="85" r="6" fill="#1a1a1a"/>
        <path d="M750,115 L750,130" stroke="#1a1a1a" strokeWidth="3"/>
        
        <path d="M880,130 L880,60 L920,60 L920,35 L905,35 L905,25 L935,25 L935,35 L920,35 L920,60 L960,60 L960,130" 
              fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        
        <path d="M1080,130 L1080,75 L1110,75 L1110,50 L1140,50 L1140,75 L1170,75 L1170,130" 
              fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        <path d="M1095,65 L1155,65" stroke="#1a1a1a" strokeWidth="2"/>
        
        <path d="M1250,130 L1250,90 L1310,90 L1310,65 L1285,65 L1285,45 L1335,45 L1335,65 L1310,65 L1310,90 L1370,90 L1370,130" 
              fill="none" stroke="#1a1a1a" strokeWidth="3"/>
        
        <path d="M200,130 L200,125 L260,125 L260,130" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="3 3"/>
        <path d="M520,130 L520,125 L580,125 L580,130" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="3 3"/>
        <path d="M950,130 L950,125 L1010,125 L1010,130" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeDasharray="3 3"/>
        
        <text x="700" y="145" textAnchor="middle" fontSize="12" fill="#1a1a1a" fontFamily="Georgia, serif">
          [ Lab Equipment Sketch - Hand Drawn ]
        </text>
      </svg>
    </div>
  );
}
