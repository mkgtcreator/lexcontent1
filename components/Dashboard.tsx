import React, { useState, useEffect } from 'react';
import { ContentItem, Reminder, UserProfile } from '../types';
import { Plus, Calendar as CalendarIcon, FileText, ArrowRight, Zap, Layers, Bell, CheckSquare, Trash2, Calendar, CheckCircle } from 'lucide-react';

interface DashboardProps {
  contents: ContentItem[];
  reminders: Reminder[];
  onCreateContent: () => void;
  onNavigate: (view: any) => void;
  userProfile: UserProfile;
  onAddReminder: (text: string, date: string) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  contents, 
  reminders, 
  onCreateContent, 
  onNavigate, 
  userProfile,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder
}) => {
  const planned = contents.filter(c => c.status === 'Planejado').length;
  const created = contents.filter(c => c.status === 'Criado').length;
  const posted = contents.filter(c => c.status === 'Postado').length;
  const totalPipeline = contents.length;

  const upcomingContents = contents
    .filter(c => c.status !== 'Postado')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Prioritize fullName, then firmName first word, then default
  const userName = userProfile?.fullName 
    ? userProfile.fullName.split(' ')[0] 
    : (userProfile?.firmName ? userProfile.firmName.split(' ')[0] : 'Advogado(a)');

  // Local state for new reminder input
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');
  const [newReminderDate, setNewReminderDate] = useState(new Date().toISOString().split('T')[0]);

  // Popup State
  const [reminderPopup, setReminderPopup] = useState<{title: string, items: {text: string, date: string}[]} | null>(null);
  const [hasCheckedDaily, setHasCheckedDaily] = useState(false);

  // Effect: Check for Daily Reminders on Mount (once reminders are loaded)
  useEffect(() => {
    if (!hasCheckedDaily && reminders.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const todaysReminders = reminders.filter(r => r.date === today && !r.completed);
        
        if (todaysReminders.length > 0) {
            setReminderPopup({
                title: "Lembretes de Hoje",
                items: todaysReminders
            });
        }
        setHasCheckedDaily(true);
    }
  }, [reminders, hasCheckedDaily]);

  const handleAddReminderSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newReminderText.trim()) {
          onAddReminder(newReminderText, newReminderDate);
          
          // Trigger Popup for the created reminder
          setReminderPopup({
              title: "Lembrete Criado!",
              items: [{ text: newReminderText, date: newReminderDate }]
          });

          setNewReminderText('');
          setIsAddingReminder(false);
      }
  };

  const activeReminders = reminders.filter(r => !r.completed);

  // Reminder Modal Component
  const ReminderModal = () => {
    if (!reminderPopup) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800 transform transition-all scale-100">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto text-blue-600 dark:text-blue-400">
                    <Bell size={24} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-4">{reminderPopup.title}</h3>
                
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {reminderPopup.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col mb-3 last:mb-0 border-b last:border-0 border-slate-100 dark:border-slate-700 pb-2 last:pb-0">
                             <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{item.text}</span>
                             <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                <Calendar size={10} /> {new Date(item.date).toLocaleDateString()}
                             </span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => setReminderPopup(null)}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200 dark:shadow-none"
                >
                    <CheckCircle size={18} /> Confirmar
                </button>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <ReminderModal />

      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bem-vindo de volta, {userName}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Aqui está o que está acontecendo com sua estratégia hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Planejado', value: planned, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Criado', value: created, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Postado', value: posted, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Total Pipeline', value: totalPipeline, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 rounded-full opacity-50 group-hover:scale-110 transition-transform ${stat.bg}`}></div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 relative z-10">{stat.label}</p>
            <span className={`text-4xl font-bold ${stat.color} dark:text-white relative z-10`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Actions */}
          <section>
            <div className="flex items-center gap-2 mb-4">
               <Zap size={18} className="text-blue-600 dark:text-blue-400" />
               <h3 className="font-bold text-slate-900 dark:text-white text-lg">Ações Rápidas</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => onNavigate('calendar')} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group">
                    <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-full mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                        <CalendarIcon size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">Abrir Calendário</span>
                </button>
                <button onClick={() => onNavigate('content-bank')} className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group">
                    <div className="bg-blue-50 dark:bg-slate-800 p-3 rounded-full mb-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                        <Layers size={24} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">Gerenciar Kanban</span>
                </button>
                <button onClick={() => onNavigate('ai-assistant')} className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 border border-transparent rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all group">
                    <div className="bg-white/20 p-3 rounded-full mb-3">
                        <Plus size={24} className="text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm">Gerar com IA</span>
                </button>
            </div>
          </section>

          {/* Upcoming Content */}
          <section>
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Próximos Conteúdos</h3>
                <button onClick={() => onNavigate('calendar')} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">Ver calendário</button>
             </div>
             <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {upcomingContents.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-slate-500 mb-4">Nada agendado para os próximos dias.</p>
                            <button onClick={onCreateContent} className="text-sm font-semibold text-blue-600 hover:text-blue-800">Criar primeiro post</button>
                        </div>
                    ) : (
                        upcomingContents.map(content => (
                            <div key={content.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => onNavigate('content-bank')}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${content.status === 'Planejado' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{content.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
                                            <span>{new Date(content.date).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span className="text-blue-600 dark:text-blue-400">{content.platform}</span>
                                        </div>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-slate-300 dark:text-slate-600" />
                            </div>
                        ))
                    )}
                </div>
             </div>
          </section>
        </div>

        {/* Side Column - Reminders Module */}
        <div className="lg:col-span-1">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                    <Bell size={18} className="text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Lembretes</h3>
                </div>
                <p className="text-xs text-slate-500 mb-6">Fique em dia com suas tarefas.</p>

                {!isAddingReminder ? (
                     <button 
                        onClick={() => setIsAddingReminder(true)}
                        className="w-full py-2.5 mb-6 border-2 border-dashed border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                     >
                        <Plus size={16}/> Novo Lembrete
                     </button>
                ) : (
                    <form onSubmit={handleAddReminderSubmit} className="mb-6 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-fade-in">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Ex: Gravar story..."
                            className="w-full text-sm font-medium mb-2 outline-none bg-transparent text-slate-900 dark:text-white placeholder-slate-400"
                            value={newReminderText}
                            onChange={(e) => setNewReminderText(e.target.value)}
                        />
                        <div className="flex items-center gap-2 mb-3">
                             <Calendar size={14} className="text-slate-400"/>
                             <input 
                                type="date" 
                                className="text-xs bg-transparent text-slate-500 outline-none"
                                value={newReminderDate}
                                onChange={(e) => setNewReminderDate(e.target.value)}
                             />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white text-xs font-bold py-1.5 rounded-lg hover:bg-blue-700">Salvar</button>
                            <button type="button" onClick={() => setIsAddingReminder(false)} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-1.5 rounded-lg hover:bg-slate-200">Cancelar</button>
                        </div>
                    </form>
                )}
                
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ativos ({activeReminders.length})</h4>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px] custom-scrollbar pr-1">
                    {activeReminders.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 italic text-sm">
                            Tudo em dia!
                        </div>
                    ) : (
                        activeReminders.map(reminder => (
                            <div key={reminder.id} className="group bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                                <button 
                                    onClick={() => onToggleReminder(reminder.id)}
                                    className="mt-0.5 text-slate-300 hover:text-green-500 transition-colors"
                                >
                                    <CheckSquare size={18} />
                                </button>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{reminder.text}</p>
                                    <span className="text-[10px] text-slate-400 block mt-1">{new Date(reminder.date).toLocaleDateString()}</span>
                                </div>
                                <button 
                                    onClick={() => onDeleteReminder(reminder.id)}
                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      );
};