
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { BrandLogo } from './BrandLogo';

interface AuthPageProps {
  onComplete: () => void;
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onComplete, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
        let result;
        if (isLogin) {
            result = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (result.error) throw result.error;
            onComplete();
        } else {
            result = await supabase.auth.signUp({
                email,
                password,
            });
            if (result.error) throw result.error;

            if (result.data.user && !result.data.session) {
                setSuccessMsg("Conta criada com sucesso! Verifique seu email para confirmar o cadastro antes de entrar.");
                setIsLogin(true);
            } else {
                 onComplete();
            }
        }

    } catch (err: any) {
        setError(err.message === "Invalid login credentials" ? "Email ou senha incorretos." : err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const toggleMode = () => {
      setIsLogin(!isLogin);
      setError(null);
      setSuccessMsg(null);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10">
        <div className="flex justify-center mb-8">
          <BrandLogo size="lg" />
        </div>
        
        <h2 className="text-3xl font-black text-center text-slate-900 mb-2">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-center text-slate-400 mb-10 text-sm font-bold">
          {isLogin ? 'Acesse seu escritório digital LexContent.' : 'Marketing jurídico inteligente e ético.'}
        </p>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl flex items-start gap-3 border border-red-100 animate-fade-in">
                <AlertCircle size={18} className="mt-0.5 shrink-0" /> 
                <span className="font-bold">{error}</span>
            </div>
        )}

        {successMsg && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-2xl flex items-start gap-3 border border-green-100 animate-fade-in">
                <CheckCircle size={18} className="mt-0.5 shrink-0" /> 
                <span className="font-bold">{successMsg}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email Profissional</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-slate-900"
                placeholder="seu.nome@advocacia.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-slate-300" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-slate-900"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-70 mt-4"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : isLogin ? 'Entrar Agora' : 'Criar Conta'} 
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-10 text-center text-sm font-bold text-slate-400">
          {isLogin ? 'Ainda não tem conta?' : 'Já possui cadastro?'}
          <button
            onClick={toggleMode}
            className="ml-2 text-blue-600 font-black hover:underline underline-offset-4"
          >
            {isLogin ? 'Cadastre-se aqui' : 'Faça login'}
          </button>
        </div>
        
        <div className="mt-8 text-center">
            <button onClick={onBack} className="text-[10px] text-slate-300 hover:text-slate-500 font-black uppercase tracking-widest">Voltar para home</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
