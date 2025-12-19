
import React, { useState } from 'react';
import { UserProfile, ContentItem } from '../types';
import { Sparkles, Calendar, Loader2, Target, CheckCircle, Lock, ArrowRight, Share2 } from 'lucide-react';
import { generateCalendarPlan } from '../services/geminiService';

interface StrategyAIProps {
  userProfile: UserProfile;
  onAddContent: (items: ContentItem[]) => void;
  onNavigate: (view: any) => void;
}

const AREAS_OF_LAW = [
    "Direito Civil",
    "Direito Penal",
    "Direito Trabalhista",
    "Direito Previdenciário",
    "Direito de Família",
    "Direito Tributário",
    "Direito Empresarial",
    "Direito Imobiliário",
    "Direito do Consumidor",
    "Direito Digital",
    "Outro"
];

const PLATFORMS = ["Instagram", "LinkedIn", "Facebook", "Blog"];

const StrategyAI: React.FC<StrategyAIProps> = ({ userProfile, onAddContent, onNavigate }) => {
  const [selectedArea, setSelectedArea] = useState(userProfile.areasOfLaw || AREAS_OF_LAW[0]);
  const [duration, setDuration] = useState('Semanal');
  const [frequency, setFrequency] = useState('3x por semana');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isPro = userProfile.plan === 'pro';

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  const handleGenerate = async () => {
    // Verificação de Segurança de Plano (Paywall)
    if (!isPro) {
        return; // O botão já deve estar bloqueado pela UI, mas prevenimos aqui também.
    }

    if (selectedPlatforms.length === 0) {
        alert("Selecione pelo menos uma plataforma.");
        return;
    }

    setIsLoading(true);
    try {
        const tempProfile = { ...userProfile, areasOfLaw: selectedArea };
        const newContents = await generateCalendarPlan(tempProfile, duration, frequency, selectedPlatforms);
        
        if (newContents.length > 0) {
            onAddContent(newContents);
            setIsSuccess(true);
        } else {
            alert("Não foi possível gerar o cronograma. Tente novamente.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao conectar com a IA.");
    } finally {
        setIsLoading(false);
    }
  };

  if (isSuccess) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Cronograma Criado!</h2>
                <p className="text-slate-500 mb-6 text-sm">Seus conteúdos foram gerados e organizados no calendário.</p>
                <div className="space-y-3">
                    <button onClick={() => onNavigate('calendar')} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                        Ver Calendário
                    </button>
                    <button onClick={() => setIsSuccess(false)} className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        Criar Novo Cronograma
                    </button>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto h-full animate-fade-in relative">
        <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
                <Target className="text-blue-600" size={32} />
                Cronograma Automático
            </h1>
            <p className="text-slate-500 text-lg mt-2">Deixe a IA planejar sua estratégia mensal de marketing jurídico.</p>
        </div>

        <div className="relative">
            {/* Paywall Overlay para usuários Free */}
            {!isPro && (
                <div className="absolute inset-0 z-20 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center p-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm text-center animate-fade-in">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Recurso Pro</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                            A geração de cronogramas automáticos completos é um recurso exclusivo do plano Pro. 
                            Ative agora para planejar todo o seu mês em segundos.
                        </p>
                        <button 
                            onClick={() => window.open('https://wa.me/5511991576492?text=Olá, quero ativar o plano PRO do LexContent!', '_blank')}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            Ativar Estratégia Pro <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 ${!isPro ? 'opacity-40 grayscale-[0.5] select-none pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Parâmetros */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Área de Atuação</label>
                            <select 
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                {AREAS_OF_LAW.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duração do Cronograma</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Semanal', 'Quinzenal', 'Mensal'].map(d => (
                                    <button 
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                        duration === d 
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                    }`}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Frequência de Postagem</label>
                            <select 
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <option>1x por dia</option>
                                <option>Todo dia útil (Seg-Sex)</option>
                                <option>3x por semana</option>
                                <option>2x por semana</option>
                                <option>1x por semana</option>
                            </select>
                        </div>
                    </div>

                    {/* Resumo e Ação */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Plataformas</label>
                            <div className="grid grid-cols-2 gap-3">
                                {PLATFORMS.map(platform => (
                                    <button
                                        key={platform}
                                        onClick={() => togglePlatform(platform)}
                                        className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                                            selectedPlatforms.includes(platform)
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedPlatforms.includes(platform) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                            {selectedPlatforms.includes(platform) && <Check size={10} className="text-white" />}
                                        </div>
                                        {platform}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                            <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 text-sm flex items-center gap-2">
                                <Sparkles size={14} /> Resumo
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-200">
                                Gerar cronograma <strong>{duration}</strong> sobre <strong>{selectedArea}</strong> para <strong>{selectedPlatforms.join(', ')}</strong>.
                            </p>
                        </div>

                        <button 
                            onClick={handleGenerate}
                            disabled={isLoading || !isPro}
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" /> Gerando Estratégia...
                                </>
                            ) : (
                                <>
                                    <Calendar size={24} /> Gerar Cronograma
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// Helper icon
const Check = ({size, className}: {size: number, className?: string}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default StrategyAI;
