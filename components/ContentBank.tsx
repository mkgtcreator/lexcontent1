import React, { useState } from 'react';
import { ContentItem, ContentStatus, Platform } from '../types';
import { MoreHorizontal, Video, Image, Type, Plus, Trash2 } from 'lucide-react';

interface ContentBankProps {
  contents: ContentItem[];
  onUpdateStatus: (id: string, status: ContentStatus) => void;
  onEdit: (item: ContentItem) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

const ContentBank: React.FC<ContentBankProps> = ({ contents, onUpdateStatus, onEdit, onCreate, onDelete }) => {
  const getIcon = (format: string) => {
    switch (format) {
      case 'Reels': return <Video size={14} />;
      case 'Story': return <Image size={14} />;
      case 'Carrossel': return <Image size={14} />;
      default: return <Type size={14} />;
    }
  };

  const getPlatformStyle = (platform: Platform) => {
    switch(platform) {
        case 'Instagram': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent';
        case 'Facebook': return 'bg-blue-600 text-white border-blue-600';
        case 'LinkedIn': return 'bg-blue-800 text-white border-blue-800';
        default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('contentId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e: React.DragEvent, status: ContentStatus) => {
    const id = e.dataTransfer.getData('contentId');
    if (id) {
        onUpdateStatus(id, status);
    }
  };

  const KanbanColumn = ({ status, title, colorClass }: { status: ContentStatus, title: string, colorClass: string }) => {
    const items = contents.filter(c => c.status === status);

    return (
      <div 
        className="flex-1 min-w-[300px] bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 flex flex-col h-full max-h-[calc(100vh-140px)] transition-colors border border-slate-200 dark:border-slate-800"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`}></span>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{title}</h3>
            <span className="text-xs text-slate-500 font-medium">{items.length}</span>
          </div>
          <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><MoreHorizontal size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar px-1 pb-4">
          {items.map(item => (
            <div 
              key={item.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, item.id)}
              onClick={() => onEdit(item)}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all group hover:-translate-y-1 relative"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPlatformStyle(item.platform)}`}>
                  {item.platform}
                </span>
                
                {/* Delete Button - Always visible for better usability */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                    }}
                    className="absolute top-3 right-3 text-slate-300 hover:text-red-500 z-10 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                    <Trash2 size={16} />
                </button>
              </div>
              
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 leading-snug pr-4">{item.title}</h4>
              
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-medium">
                    {getIcon(item.format)} {item.format}
                </span>
                <span className="font-medium">{new Date(item.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
             <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-xs text-slate-400 font-medium">Arraste itens para cá</span>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Banco de Conteúdos</h1>
            <p className="text-xs text-slate-500 mt-1">Gerencie seu pipeline de produção.</p>
        </div>
        <button 
            onClick={onCreate}
            className="bg-blue-600 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
        >
            <Plus size={16} /> Novo Conteúdo
        </button>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 h-full">
        <KanbanColumn status="Planejado" title="Planejado" colorClass="bg-blue-500" />
        <KanbanColumn status="Criado" title="Pronto / Criado" colorClass="bg-yellow-500" />
        <KanbanColumn status="Postado" title="Publicado" colorClass="bg-green-500" />
      </div>
    </div>
  );
};

export default ContentBank;