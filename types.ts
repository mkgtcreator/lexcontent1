
export type ViewState = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'calendar' | 'content-bank' | 'ai-assistant' | 'strategy';

export type Platform = 'Instagram' | 'LinkedIn' | 'Facebook' | 'Blog' | 'All';
export type ContentFormat = 'Post' | 'Story' | 'Reels' | 'Carrossel' | 'Article';
export type ContentStatus = 'Planejado' | 'Criado' | 'Postado';
export type ContentObjective = 'Educativo' | 'Autoridade' | 'Relacionamento';

export interface UserProfile {
  fullName?: string;
  firmName: string;
  areasOfLaw: string;
  targetAudience: string;
  tone: string;
  postFrequency: string;
  mainObjective: ContentObjective;
  plan: 'free' | 'pro'; // Controle de Paywall
}

export interface ContentItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  platform: Platform;
  format: ContentFormat;
  objective: ContentObjective;
  status: ContentStatus;
  copy?: string;
  notes?: string;
  areaOfLaw?: string;
}

export interface Reminder {
  id: string;
  text: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  isSystem?: boolean;
}
