
import React from 'react';
import { CheckCircle, Calendar, MessageSquare, ArrowRight, Zap, Sparkles, Check, LayoutDashboard, Trello, Target, Bot, Plus, Bell, Layers, Settings, Moon, LogOut, ShieldCheck, MousePointer2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const whatsappUrl = "https://wa.me/5511991576492?text=Olá, quero saber mais sobre o plano PRO do LexContent!";

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-5 border-b border-slate-100 max-w-7xl mx-auto w-full sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <BrandLogo size="md" />
          <span className="text-xl font-black tracking-tight text-slate-900">LexContent</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={onLogin} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
            Entrar
          </button>
          <button 
            onClick={onGetStarted}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Começar Grátis
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 animate-fade-in">
          <Sparkles size={14} />
          IA Jurídica de Última Geração
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-[1.1]">
          Marketing Jurídico <br />
          <span className="text-blue-600">Organizado e Inteligente.</span>
        </h1>
        
        <p className="text-xl text-slate-500 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
          Planeje, crie e mantenha constância sem ferir a ética da advocacia. A plataforma completa para gestão de conteúdo e estratégia assistida por IA.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl text-lg font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 hover:-translate-y-1 active:scale-95"
          >
            Criar conta gratuita <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => window.open(whatsappUrl, '_blank')}
            className="w-full sm:w-auto text-slate-600 font-black px-8 py-4 hover:text-blue-600 transition-colors"
          >
            Ver recursos Pro
          </button>
        </div>

        {/* Browser Mockup Preview */}
        <div className="relative max-w-7xl mx-auto rounded-[2.5rem] border border-slate-200 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] overflow-hidden bg-white flex text-left animate-fade-in group">
           {/* Sidebar Mockup */}
           <div className="w-60 bg-slate-50 border-r border-slate-100 p-6 space-y-10 hidden lg:flex flex-col">
              <div className="flex items-center gap-3">
                 <BrandLogo size="sm" />
                 <span className="font-black text-slate-900 text-sm">LexContent</span>
              </div>
              <div className="flex-1 space-y-1.5 text-slate-400 font-bold text-xs">
                 <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl shadow-sm text-blue-600 border border-slate-100"><LayoutDashboard size={18}/> Dashboard</div>
                 <div className="flex items-center gap-3 p-2.5"><Calendar size={18}/> Calendário</div>
                 <div className="flex items-center gap-3 p-2.5"><Target size={18}/> Estratégia</div>
                 <div className="flex items-center gap-3 p-2.5"><Bot size={18}/> LexIA</div>
                 <div className="flex items-center gap-3 p-2.5"><Trello size={18}/> Banco de Conteúdos</div>
              </div>
              <div className="space-y-1 border-t border-slate-100 pt-6 text-slate-400 font-bold text-xs">
                 <div className="flex items-center gap-3 p-2.5"><Settings size={18}/> Configurações</div>
                 <div className="flex items-center gap-3 p-2.5"><Moon size={18}/> Escuro</div>
                 <div className="flex items-center gap-3 p-2.5 text-red-500"><LogOut size={18}/> Sair</div>
              </div>
           </div>
           {/* Main Content Mockup */}
           <div className="flex-1 bg-white p-8 md:p-12 flex flex-col gap-12 overflow-hidden">
              <div>
                 <h3 className="text-3xl font-black text-slate-900 mb-2">Bem-vindo de volta, Suelen</h3>
                 <p className="text-slate-400 font-bold">Aqui está o que está acontecendo com sua estratégia hoje.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {['Planejado', 'Criado', 'Postado', 'Total Pipeline'].map((label, i) => (
                    <div key={label} className="p-6 border border-slate-100 rounded-[1.75rem] bg-white shadow-sm relative overflow-hidden">
                       <p className="text-slate-400 font-black text-[10px] uppercase mb-1 relative z-10">{label}</p>
                       <span className={`text-4xl font-black relative z-10 ${i === 1 || i === 2 ? 'text-slate-200' : i === 0 ? 'text-blue-600' : 'text-indigo-600'}`}>
                        {i === 0 || i === 3 ? '1' : '0'}
                       </span>
                    </div>
                 ))}
              </div>
              <div className="flex flex-col lg:flex-row gap-12">
                 <div className="flex-1 space-y-12">
                    <div>
                        <div className="flex items-center gap-2 mb-6 text-blue-600 font-black uppercase tracking-widest text-[10px]">
                           <Zap size={14} fill="currentColor"/> Ações Rápidas
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                           <div className="p-8 border border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-white shadow-sm">
                              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Calendar size={28}/></div>
                              <span className="font-black text-slate-800 text-[10px] uppercase text-center">Calendário</span>
                           </div>
                           <div className="p-8 border border-slate-100 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-white shadow-sm">
                              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-sm"><Layers size={28}/></div>
                              <span className="font-black text-slate-800 text-[10px] uppercase text-center">Kanban</span>
                           </div>
                           <div className="p-8 bg-blue-600 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-white shadow-2xl shadow-blue-200">
                              <div className="p-4 bg-white/20 rounded-2xl"><Plus size={32} strokeWidth={3}/></div>
                              <span className="font-black text-[10px] uppercase text-center">Gerar com IA</span>
                           </div>
                        </div>
                    </div>
                    <div>
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="font-black text-slate-900 text-lg">Próximos Conteúdos</h4>
                          <span className="text-blue-600 font-black text-[10px] uppercase tracking-wider">Ver calendário</span>
                       </div>
                       <div className="flex items-center gap-5 p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] group">
                          <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
                          <div className="flex-1">
                             <p className="font-black text-slate-900 text-base">lei do inquilinato</p>
                             <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">17/12/2025 • FACEBOOK</p>
                          </div>
                          <ArrowRight size={20} className="text-slate-300"/>
                       </div>
                    </div>
                 </div>
                 <div className="w-full lg:w-80 p-10 bg-slate-50/40 rounded-[2.5rem] border border-slate-100 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3 font-black text-slate-900 text-lg">
                       <Bell size={22} className="text-blue-600"/> Lembretes
                    </div>
                    <p className="text-slate-400 text-xs font-bold mb-8">Fique em dia com suas tarefas.</p>
                    <div className="p-5 border-2 border-dashed border-blue-100 rounded-[1.5rem] flex items-center justify-center gap-2 text-blue-600 font-black text-[10px] uppercase mb-10">
                       <Plus size={16} strokeWidth={3}/> Novo Lembrete
                    </div>
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ativos (1)</p>
                       <div className="p-5 bg-white border border-slate-100 rounded-[1.75rem] shadow-sm flex gap-4 items-start">
                          <div className="w-6 h-6 border-2 border-slate-100 rounded-lg flex-shrink-0"></div>
                          <div>
                             <p className="font-black text-slate-900 text-sm">teste</p>
                             <p className="text-[10px] text-slate-400 font-black mt-1">17/12/2025</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Diga adeus à criação exaustiva manual</h2>
            <p className="text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                Otimize suas estratégias nas redes sociais sem o esforço repetitivo. Aqui você encontra uma ferramenta completa para criação e gestão de conteúdos jurídicos em um só lugar. Resolva de vez a dificuldade de gerar posts manualmente e mantenha sua presença digital sempre ativa.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
                { 
                    title: "Comece Gratuitamente", 
                    desc: "Crie sua conta e organize sua rotina de conteúdo. Utilize a inteligência jurídica para apoiar suas publicações diárias de forma simples.",
                    icon: <CheckCircle className="text-blue-600" />
                },
                { 
                    title: "Calendário Editorial", 
                    desc: "Visualize todo o seu planejamento mensal. Organize suas publicações sem depender de planilhas confusas.",
                    icon: <Calendar className="text-blue-600" />
                },
                { 
                    title: "IA Jurídica Manual", 
                    desc: "Gere ideias e textos educativos alinhados ao seu posicionamento profissional através do LexIA.",
                    icon: <Bot className="text-blue-600" />
                },
                { 
                    title: "Gestão Kanban", 
                    desc: "Acompanhe o que está sendo planejado ou postado com um fluxo intuitivo de trabalho.",
                    icon: <Trello className="text-blue-600" />
                }
            ].map((feature, i) => (
                <div key={i} className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-blue-100 transition-all">
                    <div className="mb-6 p-3 bg-white w-fit rounded-2xl shadow-sm">{feature.icon}</div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">{feature.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Plano Pro Section */}
      <section className="bg-slate-950 py-32 px-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-600/20">
              Exclusivo Plano Pro
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Estratégia <br />
              <span className="text-blue-500">Automatizada.</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md">
              Ideal para advogados que precisam de constância sem esforço manual e uma estratégia mensal pronta em segundos.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
              {[
                "Cronogramas Automáticos",
                "Frequência Customizada",
                "Planejamento em Lote",
                "IA de Posicionamento",
                "Uso Ilimitado",
                "Suporte VIP"
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-300 text-sm font-bold">
                  <div className="bg-blue-600/20 p-1 rounded-full">
                    <Check size={14} className="text-blue-500" strokeWidth={4} />
                  </div>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-sm">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                <ShieldCheck size={80} className="text-blue-600" />
              </div>
              
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">Investimento Mensal</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-2xl font-black text-slate-900">R$</span>
                <span className="text-7xl font-black text-slate-900 tracking-tighter">67</span>
              </div>

              <p className="text-slate-500 text-xs font-bold leading-relaxed mb-10">
                Assinatura mensal recorrente com ativação direta via WhatsApp. Desbloqueie todo o poder da LexIA.
              </p>

              <button 
                onClick={() => window.open(whatsappUrl, '_blank')}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group-hover:-translate-y-1"
              >
                Desbloquear Pro <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white py-32 px-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-12">
             <BrandLogo size="xl" className="shadow-2xl" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 leading-tight">
            "Você não paga por uma ferramenta. <br />
            Você paga por <span className="text-blue-600">direção</span>."
          </h2>
          <p className="text-2xl text-slate-500 font-bold leading-relaxed max-w-2xl mx-auto italic">
            A LexContent entrega organização gratuita. Nossa IA Pro economiza seu bem mais precioso: o tempo de decisão estratégica.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-24 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="flex items-center gap-3">
               <BrandLogo size="sm" />
               <span className="text-2xl font-black tracking-tight text-slate-900">LexContent</span>
             </div>
             <p className="text-slate-400 text-sm font-bold">Marketing jurídico com inteligência e ética.</p>
          </div>
          <div className="flex gap-12 text-sm font-black text-slate-400">
            <button onClick={onLogin} className="hover:text-blue-600 transition-colors">Entrar</button>
            <button onClick={onGetStarted} className="hover:text-blue-600 transition-colors">Criar Conta</button>
            <button onClick={() => window.open(whatsappUrl, '_blank')} className="hover:text-blue-600 transition-colors">Suporte</button>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">
            © 2026 LexContent. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
