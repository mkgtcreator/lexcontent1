import { UserProfile, ContentItem } from "../types";

const callAI = async (action: string, payload: any) => {
  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  if (!response.ok) {
    throw new Error("Erro ao comunicar com a IA");
  }

  return response.json();
};

export const generateCalendarPlan = async (
  profile: UserProfile,
  duration: string,
  frequency: string,
  platforms: string[]
): Promise<ContentItem[]> => {
  const prompt = `
Gere um cronograma de conteúdo estratégico para o escritório ${profile.firmName}.
Áreas: ${profile.areasOfLaw}.
Público: ${profile.targetAudience}.
Tom: ${profile.tone}.
Duração: ${duration}.
Frequência: ${frequency}.
Plataformas: ${platforms.join(", ")}.
`;

  const schema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        platform: { type: "STRING" },
        format: { type: "STRING" },
        objective: { type: "STRING" },
        copy: { type: "STRING" },
        dayOffset: { type: "INTEGER" },
      },
      required: ["title", "platform", "format", "objective", "copy", "dayOffset"],
    },
  };

  const data = await callAI("generateCalendar", { prompt, schema });

  const today = new Date();

  return JSON.parse(data.text).map((item: any, i: number) => {
    const date = new Date();
    date.setDate(today.getDate() + (item.dayOffset ?? i));

    return {
      id: crypto.randomUUID(),
      title: item.title,
      date: date.toISOString().split("T")[0],
      platform: item.platform,
      format: item.format,
      objective: item.objective,
      copy: item.copy,
      status: "Planejado",
      areaOfLaw: profile.areasOfLaw,
    };
  });
};

export const generatePostContent = async (
  profile: UserProfile,
  topic: string,
  platform: string,
  format: string
): Promise<string> => {
  const prompt = `
Tema: ${topic}
Plataforma: ${platform}
Formato: ${format}
Público: ${profile.targetAudience}
Tom: ${profile.tone}
Área: ${profile.areasOfLaw}
`;

  const data = await callAI("generatePost", { prompt });
  return data.text;
};

export const chatWithAI = async (
  history: any[],
  message: string,
  profile: UserProfile
) => {
  const data = await callAI("chat", { history, message, profile });
  return data.text;
};
