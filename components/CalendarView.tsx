import React from 'react';
import { ContentItem } from '../types';
import { ChevronLeft, ChevronRight, Target } from 'lucide-react';

interface CalendarViewProps {
  contents: ContentItem[];
  onSelectContent: (item: ContentItem) => void;
  onGenerateStrategy: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ contents, onSelectContent, onGenerateStrategy }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const getContentsForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return contents.filter(c => c.date === dateStr);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendário Editorial</h1>
            <p className="text-slate-500 text-sm">Visualize e organize sua estratégia mensal.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={onGenerateStrategy}
                className="flex items-center gap-2 bg-blue-600 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
                <Target size={16} /> Gerar Cronograma IA
            </button>
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <button onClick={prevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"><ChevronLeft size={20} className="dark:text-white" /></button>
                <span className="w-32 text-center font-medium dark:text-white text-sm">{monthNames[month]} {year}</span>
                <button onClick={nextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"><ChevronRight size={20} className="dark:text-white" /></button>
            </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-slate-50/30 dark:bg-slate-900">
          {days.map((date, idx) => (
            <div 
              key={idx} 
              className={`min-h-[100px] border-b border-r border-slate-200 dark:border-slate-800 p-2 relative group transition-colors hover:bg-white dark:hover:bg-slate-800/50 ${!date ? 'bg-slate-100/50 dark:bg-slate-950/50' : ''}`}
            >
              {date && (
                <>
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                     date.toDateString() === new Date().toDateString() 
                     ? 'bg-blue-600 text-white' 
                     : 'text-slate-700 dark:text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-700'
                  }`}>
                    {date.getDate()}
                  </span>
                  
                  <div className="mt-2 space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar">
                    {getContentsForDay(date).map(content => (
                      <div 
                        key={content.id}
                        onClick={() => onSelectContent(content)}
                        className={`text-[10px] px-2 py-1.5 rounded-md border cursor-pointer truncate transition-all shadow-sm hover:shadow-md hover:scale-[1.02] font-medium ${
                            content.status === 'Postado' 
                            ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' 
                            : content.status === 'Criado'
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300'
                            : 'bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {content.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;