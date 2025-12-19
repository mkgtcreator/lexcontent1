
import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-11 h-11 text-[16px]',
    lg: 'w-20 h-20 text-[32px]',
    xl: 'w-28 h-28 text-[44px]',
  };

  return (
    <div 
      className={`relative flex items-center justify-center rounded-2xl bg-slate-950 border border-slate-800 shadow-sm overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {/* Camada de Profundidade Sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-transparent opacity-40" />
      
      {/* Tipografia LC - Confiança e Modernidade */}
      <div className="relative z-10 flex items-baseline select-none px-1">
        <span 
          className="font-extrabold tracking-tighter text-white"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          L
        </span>
        <span 
          className="font-medium tracking-tighter text-blue-500 -ml-[0.5px]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          C
        </span>
      </div>

      {/* Detalhe de Acabamento - Ponto de Foco (Sinal de Precisão) */}
      <div className="absolute bottom-[18%] right-[18%] w-1 h-1 rounded-full bg-blue-500/80 shadow-[0_0_4px_rgba(59,130,246,0.4)]" />
      
      {/* Brilho Superior Minimalista */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />
    </div>
  );
};
