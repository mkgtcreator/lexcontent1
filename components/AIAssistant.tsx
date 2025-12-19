import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ContentItem, Platform, ContentFormat } from '../types';
import { Send, Sparkles, Loader2, Copy, Eraser, MessageSquare, Bot } from 'lucide-react';
import { generatePostContent } from '../services/geminiService';

interface AIAssistantProps {
  userProfile: UserProfile;
  onAddContent: (items: ContentItem[]) => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
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

const AIAssistant: React.FC<AIAssistantProps> = ({ userProfile, onAddContent, onUpdateProfile }) => {
  const [selectedArea, setSelectedArea] = useState(userProfile.areasOfLaw || AREAS_OF_LAW[0]);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  
  // Post Gen Params
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('Instagram');
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>('Post');
  
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (messages.length === 0) {
        setMessages([
            {
                id: 'welcome',
                role: 'ai',
                text: `Olá! Sou a LexIA. Escolha a área, a plataforma e o tema, e eu escreverei o post para você.`
            }
        ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        // Explicit Post Generation
        const response = await generatePostContent(
            { ...userProfile, areasOfLaw: selectedArea }, // Use session area
            input, 
            selectedPlatform, 
            selectedFormat
        );
        
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: response }]);
        
        // Auto-create item in background
        const newItem: ContentItem = {
            id: crypto.randomUUID(),
            title: input.length > 30 ? input.substring(0, 30) + '...' : input,
            date: new Date().toISOString().split('T')[0],
            platform: selectedPlatform,
            format: selectedFormat,
            objective: 'Educativo',
            status: 'Planejado',
            copy: response,
            areaOfLaw: selectedArea
        };
        onAddContent([newItem]);

    } catch (error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "Erro na conexão. Tente novamente." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white dark:bg-white dark:text-blue-600 p-1.5 rounded-lg shadow-sm">
                <Bot size={16} />
            </div>
            <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">LexIA</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="truncate max-w-[150px]">Assistente Inteligente</span>
                </div>
            </div>
        </div>
        
        <select 
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white outline-none focus:ring-1 focus:ring-blue-600 max-w-[140px]"
        >
            {AREAS_OF_LAW.map(area => (
                <option key={area} value={area}>{area}</option>
            ))}
        </select>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-br-none shadow-blue-100' 
              : 'bg-white dark:bg-slate-800 dark:text-slate-100 text-slate-800 rounded-bl-none border border-slate-200 dark:border-slate-700'
            }`}>
              {msg.text}
              {msg.role === 'ai' && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-2">
                       <button className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-[10px] uppercase font-bold" onClick={() => navigator.clipboard.writeText(msg.text)}>
                        <Copy size={10} /> Copiar
                      </button>
                  </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-3 border border-slate-200 dark:border-slate-700 shadow-sm">
                <Loader2 size={16} className="animate-spin text-blue-600 dark:text-white" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">LexIA digitando...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="flex gap-2 mb-3">
             <select 
                value={selectedPlatform} 
                onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
                className="flex-1 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-1 focus:ring-blue-600 outline-none font-medium"
            >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Facebook">Facebook</option>
                <option value="Blog">Blog</option>
            </select>
            <select 
                value={selectedFormat} 
                onChange={(e) => setSelectedFormat(e.target.value as ContentFormat)}
                className="flex-1 text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white focus:ring-1 focus:ring-blue-600 outline-none font-medium"
            >
                <option value="Post">Post (Feed)</option>
                <option value="Story">Story</option>
                <option value="Reels">Reels</option>
                <option value="Carrossel">Carrossel</option>
                <option value="Article">Artigo</option>
            </select>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite o tema (ex: Lei do Inquilinato)..."
            className="w-full pr-12 pl-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-white resize-none h-[55px] custom-scrollbar text-sm dark:text-white shadow-sm transition-shadow"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;