
import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, ContentItem, ContentStatus, Platform, ContentFormat, Reminder } from './types';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import Onboarding from './components/Onboarding';
import CalendarView from './components/CalendarView';
import ContentBank from './components/ContentBank';
import AIAssistant from './components/AIAssistant';
import StrategyAI from './components/StrategyAI';
import { BrandLogo } from './components/BrandLogo';
import { LayoutDashboard, Calendar, Trello, Settings, LogOut, Sun, Moon, Trash2, Target, Bot, X, Save } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

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

const TONES = [
    "Profissional e Acessível",
    "Formal e Técnico",
    "Empático e Acolhedor",
    "Direto e Informativo"
];

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<ViewState>('landing');
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userProfile, setUserProfile] = useState<UserProfile>({
      firmName: '',
      fullName: '', 
      areasOfLaw: 'Direito Civil',
      targetAudience: '',
      tone: 'Profissional e Acessível',
      postFrequency: '3x',
      mainObjective: 'Educativo',
      plan: 'free'
  });
  
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setView('dashboard');
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setView('dashboard');
      else setView('landing');
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user) {
        fetchData();
    }
  }, [session]);

  const fetchData = async () => {
      if (!session?.user) return;

      try {
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
        
        if (profileData) {
            setUserProfile({
                firmName: profileData.firm_name || '',
                fullName: profileData.full_name || '',
                areasOfLaw: profileData.areas_of_law || '',
                targetAudience: profileData.target_audience || '',
                tone: profileData.tone || 'Profissional e Acessível',
                postFrequency: profileData.post_frequency || '3x',
                mainObjective: profileData.main_objective || 'Educativo',
                plan: profileData.plan || 'free'
            });

            if (profileData.firm_name === 'Novo Escritório' || !profileData.full_name) {
                setView('onboarding');
            }
        }

        const { data: contentsData, error: contentError } = await supabase
            .from('contents')
            .select('*')
            .eq('user_id', session.user.id);
        
        if (contentsData) {
            const mappedContents: ContentItem[] = contentsData.map((c: any) => ({
                id: c.id,
                title: c.title,
                date: c.date,
                platform: c.platform,
                format: c.format,
                objective: c.objective,
                status: c.status,
                copy: c.copy,
                notes: c.notes,
                areaOfLaw: c.area_of_law
            }));
            setContents(mappedContents);
        }

        const { data: remindersData, error: reminderError } = await supabase
            .from('reminders')
            .select('*')
            .eq('user_id', session.user.id);
            
        if (remindersData) {
            setReminders(remindersData);
        }
      } catch (error: any) {
          console.error("Data fetch error:", error.message);
      }
  };

  const handleUpdateProfile = async (newProfile: UserProfile) => {
      setUserProfile(newProfile);
      if (session?.user) {
          await supabase.from('profiles').upsert({
              id: session.user.id,
              firm_name: newProfile.firmName,
              full_name: newProfile.fullName, 
              areas_of_law: newProfile.areasOfLaw,
              target_audience: newProfile.targetAudience,
              tone: newProfile.tone,
              post_frequency: newProfile.postFrequency,
              main_objective: newProfile.mainObjective,
              plan: newProfile.plan
          });
      }
      setShowSettings(false);
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
      const profileWithPlan = { ...profile, plan: userProfile.plan };
      setUserProfile(profileWithPlan);
      if (session?.user) {
          await supabase.from('profiles').update({
              full_name: profile.fullName,
              firm_name: profile.firmName,
              areas_of_law: profile.areasOfLaw,
              target_audience: profile.targetAudience,
              tone: profile.tone,
              post_frequency: profile.postFrequency,
              main_objective: profile.mainObjective
          }).eq('id', session.user.id);
      }
      setView('dashboard');
  };

  const addContentItems = async (newItems: ContentItem[]) => {
    setContents(prev => [...prev, ...newItems]);

    if (session?.user) {
        const dbItems = newItems.map(item => ({
            id: item.id, 
            user_id: session.user.id,
            title: item.title,
            date: item.date,
            platform: item.platform,
            format: item.format,
            objective: item.objective,
            status: item.status,
            copy: item.copy,
            area_of_law: item.areaOfLaw
        }));
        await supabase.from('contents').upsert(dbItems);
    }
  };

  const updateStatus = async (id: string, status: ContentStatus) => {
    setContents(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    if (session?.user) {
        await supabase.from('contents').update({ status }).eq('id', id);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem && session?.user) {
        let itemToSave = { ...editingItem };
        
        if (itemToSave.id === 'new') {
            itemToSave.id = crypto.randomUUID(); 
            setContents(prev => [...prev, itemToSave]);
            
            await supabase.from('contents').insert({
                id: itemToSave.id,
                user_id: session.user.id,
                title: itemToSave.title,
                date: itemToSave.date,
                platform: itemToSave.platform,
                format: itemToSave.format,
                objective: itemToSave.objective,
                status: itemToSave.status,
                copy: itemToSave.copy,
                area_of_law: itemToSave.areaOfLaw
            });
        } else {
            setContents(prev => prev.map(c => c.id === itemToSave.id ? itemToSave : c));
            
            await supabase.from('contents').update({
                title: itemToSave.title,
                date: itemToSave.date,
                platform: itemToSave.platform,
                format: itemToSave.format,
                objective: itemToSave.objective,
                status: itemToSave.status,
                copy: itemToSave.copy,
                area_of_law: itemToSave.areaOfLaw
            }).eq('id', itemToSave.id);
        }
        setEditingItem(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
      if (confirm('Tem certeza que deseja excluir este conteúdo?')) {
          setContents(prev => prev.filter(c => c.id !== id));
          setEditingItem(null);
          if (session?.user) {
              await supabase.from('contents').delete().eq('id', id);
          }
      }
  };

  const addReminder = async (text: string, date: string) => {
      const newReminder: Reminder = {
          id: crypto.randomUUID(),
          text,
          date,
          completed: false
      };
      setReminders(prev => [newReminder, ...prev]);
      
      if (session?.user) {
          await supabase.from('reminders').insert({
              id: newReminder.id,
              user_id: session.user.id,
              text,
              date,
              completed: false
          });
      }
  };

  const toggleReminder = async (id: string) => {
      const reminder = reminders.find(r => r.id === id);
      if (!reminder) return;
      const newStatus = !reminder.completed;

      setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: newStatus } : r));
      
      if (session?.user) {
          await supabase.from('reminders').update({ completed: newStatus }).eq('id', id);
      }
  };

  const deleteReminder = async (id: string) => {
      setReminders(prev => prev.filter(r => r.id !== id));
      if (session?.user) {
          await supabase.from('reminders').delete().eq('id', id);
      }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = () => setView('auth');
  const handleAuthComplete = () => {
      setView('dashboard'); 
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setView('landing');
    setContents([]);
    setReminders([]);
  };

  const openNewContentModal = () => {
      setEditingItem({
          id: 'new',
          title: '',
          date: new Date().toISOString().split('T')[0],
          platform: 'Instagram',
          format: 'Post',
          objective: 'Educativo',
          status: 'Planejado',
          copy: '',
          areaOfLaw: userProfile?.areasOfLaw
      });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-500 text-sm font-medium tracking-tight animate-pulse">Iniciando LexContent...</div>;

  if (view === 'landing') return <LandingPage onGetStarted={handleLogin} onLogin={handleLogin} />;
  if (view === 'auth') return <AuthPage onComplete={handleAuthComplete} onBack={() => setView('landing')} />;
  if (view === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div className="flex h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-hidden">
      
      {/* Settings Modal (Moved to root level for correct stacking and visibility) */}
      {showSettings && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 md:p-10 relative">
                  <button 
                      onClick={() => setShowSettings(false)}
                      className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                      <X size={24} />
                  </button>

                  <div className="mb-8">
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Configurações</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Mantenha seu perfil jurídico atualizado.</p>
                  </div>

                  <div className="space-y-6">
                      <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Seu Nome</label>
                          <input 
                              type="text"
                              defaultValue={userProfile.fullName || ''}
                              id="settings-fullname"
                              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold"
                              placeholder="Ex: Dra. Suelen"
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Nome do Escritório</label>
                          <input 
                              type="text"
                              defaultValue={userProfile.firmName || ''}
                              id="settings-firmname"
                              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold"
                              placeholder="Ex: Esc. teste"
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Área Principal</label>
                          <select 
                              id="settings-areasoflaw"
                              defaultValue={userProfile.areasOfLaw}
                              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold"
                          >
                              {AREAS_OF_LAW.map(area => <option key={area} value={area}>{area}</option>)}
                          </select>
                          <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight italic">Isso ajuda a IA a sugerir conteúdo relevante.</p>
                      </div>

                      <div>
                          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tom de Voz</label>
                          <select 
                              id="settings-tone"
                              defaultValue={userProfile.tone}
                              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:text-white font-bold"
                          >
                              {TONES.map(tone => <option key={tone} value={tone}>{tone}</option>)}
                          </select>
                      </div>
                  </div>

                  <div className="mt-10">
                      <button 
                          onClick={() => {
                            const fullName = (document.getElementById('settings-fullname') as HTMLInputElement).value;
                            const firmName = (document.getElementById('settings-firmname') as HTMLInputElement).value;
                            const areasOfLaw = (document.getElementById('settings-areasoflaw') as HTMLSelectElement).value;
                            const tone = (document.getElementById('settings-tone') as HTMLSelectElement).value;
                            handleUpdateProfile({
                                ...userProfile,
                                fullName,
                                firmName,
                                areasOfLaw,
                                tone
                            });
                          }}
                          className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
                      >
                          <Save size={20} /> Salvar Alterações
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* Sidebar Principal */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <BrandLogo size="md" />
          <span className="font-black tracking-tight text-xl text-slate-900 dark:text-white">LexContent</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'dashboard' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setView('calendar')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'calendar' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Calendar size={18} /> Calendário
          </button>
          <button onClick={() => setView('strategy')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'strategy' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Target size={18} /> Estratégia
          </button>
          <button 
            onClick={() => setView('ai-assistant')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'ai-assistant' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Bot size={18} /> LexIA
          </button>
          <button onClick={() => setView('content-bank')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'content-bank' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm border border-slate-100 dark:border-slate-700' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Trello size={18} /> Banco de Conteúdos
          </button>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Settings size={18} /> Configurações
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />} {darkMode ? 'Claro' : 'Escuro'}
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut size={18} /> Sair
            </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-white dark:bg-slate-950 relative">
        <div className="md:hidden p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 sticky top-0 z-10">
             <div className="font-black text-lg flex items-center gap-2 text-slate-900 dark:text-white">
               <BrandLogo size="sm" /> 
               LexContent
             </div>
             <button onClick={() => setDarkMode(!darkMode)} className="text-slate-500">{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
        
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-40 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            <button onClick={() => setView('dashboard')} className={`p-2 rounded ${view === 'dashboard' ? 'text-blue-600 dark:text-white' : 'text-slate-300'}`}><LayoutDashboard size={24} /></button>
            <button onClick={() => setView('calendar')} className={`p-2 rounded ${view === 'calendar' ? 'text-blue-600 dark:text-white' : 'text-slate-300'}`}><Calendar size={24} /></button>
            <button onClick={() => setView('ai-assistant')} className={`p-3 bg-blue-600 dark:bg-white text-white dark:text-slate-900 rounded-full -mt-8 shadow-xl border-4 border-white dark:border-slate-900`}><Bot size={24} /></button>
            <button onClick={() => setView('content-bank')} className={`p-2 rounded ${view === 'content-bank' ? 'text-blue-600 dark:text-white' : 'text-slate-300'}`}><Trello size={24} /></button>
            <button onClick={() => setShowSettings(true)} className="p-2 text-slate-300"><Settings size={24} /></button>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-10 pb-24 md:pb-10 h-full">
          {view === 'dashboard' && (
              <Dashboard 
                contents={contents} 
                reminders={reminders}
                onCreateContent={openNewContentModal} 
                onNavigate={setView} 
                userProfile={userProfile} 
                onAddReminder={addReminder}
                onToggleReminder={toggleReminder}
                onDeleteReminder={deleteReminder}
              />
          )}
          {view === 'calendar' && <CalendarView contents={contents} onSelectContent={setEditingItem} onGenerateStrategy={() => setView('strategy')} />}
          {view === 'content-bank' && (
            <ContentBank 
                contents={contents} 
                onUpdateStatus={updateStatus} 
                onEdit={setEditingItem} 
                onCreate={openNewContentModal} 
                onDelete={handleDeleteItem}
            />
          )}
          {view === 'ai-assistant' && <AIAssistant userProfile={userProfile} onAddContent={addContentItems} onUpdateProfile={setUserProfile} />}
          {view === 'strategy' && <StrategyAI userProfile={userProfile} onAddContent={addContentItems} onNavigate={setView} />}
        </div>
      </main>
    </div>
  );
};

export default App;
