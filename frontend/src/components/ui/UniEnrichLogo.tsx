import React from "react";

interface UniEnrichLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const UniEnrichLogo: React.FC<UniEnrichLogoProps> = ({
  className = "",
  size = 36,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Precision Geometric Mark */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-xs group-hover:scale-105 transition-transform duration-200"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #111111 0%, #1a1e22 100%)",
          border: "1.5px solid #2b3033",
        }}
      >
        <svg
          width={size * 0.7}
          height={size * 0.7}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Interlocking Geometric Hex Prism */}
          <path
            d="M20 4L34 12V28L20 36L6 28V12L20 4Z"
            stroke="#15BCDF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Stylized Monogram U & E Bridge */}
          <path
            d="M13 14V23C13 26.866 16.134 30 20 30C23.866 30 27 26.866 27 23V14"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Central AI Signal Core Node */}
          <circle cx="20" cy="20" r="3.2" fill="#15BCDF" />
          <path
            d="M17 19H23"
            stroke="#111111"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex items-baseline gap-1.5 font-quantico leading-none">
          <span className="font-bold text-xl tracking-tight text-[#111111] lowercase">
            unienrich
          </span>
          <span className="text-[10px] font-bold text-[#15BCDF] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#15BCDF]/10 border border-[#15BCDF]/30">
            AI
          </span>
        </div>
      )}
    </div>
  );
};
