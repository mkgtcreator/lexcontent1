
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, BookOpen, User } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    firmName: '',
    areasOfLaw: '',
    targetAudience: '',
    tone: 'Profissional e Acessível',
    postFrequency: '3x por semana',
    mainObjective: 'Educativo',
    plan: 'free',
  });

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onComplete(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-between items-center px-4">
            <div className={`h-1 flex-1 rounded bg-slate-200 overflow-hidden`}>
                <div className={`h-full bg-slate-900 transition-all duration-500`} style={{ width: `${(step/3)*100}%` }}></div>
            </div>
            <span className="ml-4 text-sm font-medium text-slate-500">Passo {step} de 3</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="flex justify-center mb-4">
                            <BrandLogo size="lg" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Sobre Você e o Escritório</h2>
                        <p className="text-slate-500 text-sm">Personalize a LexIA para o seu perfil jurídico.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Seu Nome Completo</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Ex: Dra. Suelen Silva"
                            value={formData.fullName || ''}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nome do Escritório (Opcional)</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Ex: Silva & Souza Advogados"
                            value={formData.firmName}
                            onChange={(e) => handleChange('firmName', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Áreas de Atuação</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Ex: Direito de Família, Trabalhista, Civil"
                            value={formData.areasOfLaw}
                            onChange={(e) => handleChange('areasOfLaw', e.target.value)}
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Público e Tom</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Quem é seu público-alvo?</label>
                        <input 
                            type="text" 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                            placeholder="Ex: Empresários, Trabalhadores do setor industrial..."
                            value={formData.targetAudience}
                            onChange={(e) => handleChange('targetAudience', e.target.value)}
                        />
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Tom de Voz</label>
                         <select 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white transition-all"
                            value={formData.tone}
                            onChange={(e) => handleChange('tone', e.target.value)}
                         >
                            <option>Profissional e Acessível</option>
                            <option>Formal e Técnico</option>
                            <option>Empático e Acolhedor</option>
                            <option>Direto e Informativo</option>
                         </select>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Estratégia de Conteúdo</h2>
                    </div>

                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-2">Frequência de Postagem</label>
                         <select 
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white transition-all"
                            value={formData.postFrequency}
                            onChange={(e) => handleChange('postFrequency', e.target.value)}
                         >
                            <option>2x por semana</option>
                            <option>3x por semana</option>
                            <option>5x por semana (Dia Útil)</option>
                            <option>Diariamente</option>
                         </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-4">Objetivo Principal</label>
                        <div className="grid grid-cols-1 gap-3">
                            {['Educativo', 'Autoridade', 'Relacionamento'].map((obj) => (
                                <button
                                    key={obj}
                                    onClick={() => handleChange('mainObjective', obj as any)}
                                    className={`p-4 rounded-lg border text-left transition-all ${
                                        formData.mainObjective === obj 
                                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-sm' 
                                        : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                >
                                    <span className="font-bold text-slate-900 block text-sm">{obj}</span>
                                    <span className="text-xs text-slate-500">
                                        {obj === 'Educativo' && 'Informar sobre direitos e deveres do cidadão.'}
                                        {obj === 'Autoridade' && 'Demonstrar especialidade e vivência jurídica.'}
                                        {obj === 'Relacionamento' && 'Conectar humanamente com o cliente ideal.'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 flex justify-end">
                <button 
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    {step === 3 ? 'Concluir' : 'Continuar'} <ArrowRight size={18} />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
