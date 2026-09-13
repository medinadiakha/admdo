import React from 'react';

interface AdmdoLogoProps {
  variant?: 'emblem' | 'banner';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const AdmdoLogo: React.FC<AdmdoLogoProps> = ({
  variant = 'emblem',
  size = 'md',
  className = '',
  showText = true,
}) => {
  const sizeClasses = {
    sm: variant === 'emblem' ? 'w-10 h-10' : 'h-10',
    md: variant === 'emblem' ? 'w-14 h-14' : 'h-14',
    lg: variant === 'emblem' ? 'w-20 h-20' : 'h-20',
    xl: variant === 'emblem' ? 'w-28 h-28' : 'h-28',
  }[size];

  if (variant === 'banner') {
    return (
      <div className={`flex items-center gap-3.5 sm:gap-4 ${className}`}>
        {/* Emblem */}
        <div className="relative shrink-0 flex items-center justify-center">
          <AdmdoLogo variant="emblem" size={size} showText={false} />
        </div>

        {/* Text and wheat branch */}
        {showText && (
          <div className="flex flex-col justify-center select-none">
            <span className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-800 uppercase leading-none">
              Association pour le Développement de
            </span>
            <span className="text-base sm:text-xl lg:text-2xl font-black tracking-tight text-emerald-800 leading-tight">
              Medina Diakha Wouly
            </span>
            {/* Laurel/wheat accent */}
            <div className="flex items-center gap-1 mt-0.5 opacity-85">
              <svg className="h-3 w-32 text-amber-700" viewBox="0 0 160 16" fill="currentColor">
                <path d="M10 8 Q30 3 50 8 Q70 13 80 8 Q90 3 110 8 Q130 13 150 8" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                {/* stylized leaves */}
                <ellipse cx="25" cy="5" rx="4" ry="2" transform="rotate(-25 25 5)" />
                <ellipse cx="45" cy="5" rx="4" ry="2" transform="rotate(-20 45 5)" />
                <ellipse cx="65" cy="5" rx="4" ry="2" transform="rotate(-15 65 5)" />
                <ellipse cx="95" cy="5" rx="4" ry="2" transform="rotate(15 95 5)" />
                <ellipse cx="115" cy="5" rx="4" ry="2" transform="rotate(20 115 5)" />
                <ellipse cx="135" cy="5" rx="4" ry="2" transform="rotate(25 135 5)" />
                <ellipse cx="25" cy="11" rx="4" ry="2" transform="rotate(25 25 11)" />
                <ellipse cx="45" cy="11" rx="4" ry="2" transform="rotate(20 45 11)" />
                <ellipse cx="65" cy="11" rx="4" ry="2" transform="rotate(15 65 11)" />
                <ellipse cx="95" cy="11" rx="4" ry="2" transform="rotate(-15 95 11)" />
                <ellipse cx="115" cy="11" rx="4" ry="2" transform="rotate(-20 115 11)" />
                <ellipse cx="135" cy="11" rx="4" ry="2" transform="rotate(-25 135 11)" />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Blue Orbital Ring */}
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="#3b66ff"
          strokeWidth="3.5"
          strokeDasharray="480 30"
          transform="rotate(-20 100 100)"
        />
        {/* Orbit Satellite Node */}
        <circle cx="186" cy="100" r="6" fill="#3b66ff" />
        <circle cx="186" cy="100" r="2.5" fill="#ffffff" />

        {/* Inner Lime-Green Circle Frame */}
        <circle
          cx="100"
          cy="100"
          r="74"
          fill="none"
          stroke="#7cd332"
          strokeWidth="2.5"
        />

        {/* Central Vibrant Green Disc */}
        <circle cx="100" cy="98" r="70" fill="#78ce38" />

        {/* Two Stylized Reaching Solidarity Hands */}
        {/* Left Hand (Olive / Brown) */}
        <g fill="#7e7a2b">
          <path d="M42 90 C46 76 60 62 76 62 C78 68 76 74 72 78 C79 73 85 71 90 73 C86 78 81 83 75 85 C83 83 88 84 92 88 C85 91 80 94 74 96 C82 96 86 99 87 103 C77 105 66 102 56 104 C48 102 44 96 42 90 Z" />
        </g>

        {/* Right Hand (Slate Teal Blue) */}
        <g fill="#4392a8">
          <path d="M158 90 C154 76 140 62 124 62 C122 68 124 74 128 78 C121 73 115 71 110 73 C114 78 119 83 125 85 C117 83 112 84 108 88 C115 91 120 94 126 96 C118 96 114 99 113 103 C123 105 134 102 144 104 C152 102 156 96 158 90 Z" />
        </g>

        {/* Lower Banner background for text */}
        <path
          d="M34 98 Q100 106 166 98 L160 142 Q100 156 40 142 Z"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* ADMDO Bold Textured Letters */}
        <text
          x="100"
          y="132"
          textAnchor="middle"
          fontSize="30"
          fontWeight="900"
          fontFamily="Impact, Arial Black, sans-serif"
          fill="#111827"
          letterSpacing="2"
        >
          ADMDO
        </text>

        {/* Subtitle Under ADMDO */}
        <text
          x="100"
          y="144"
          textAnchor="middle"
          fontSize="6.2"
          fontWeight="700"
          fontFamily="sans-serif"
          fill="#1f2937"
          letterSpacing="0.2"
        >
          Association pour le Développement de Medina Diakha Wouly
        </text>
      </svg>
    </div>
  );
};
