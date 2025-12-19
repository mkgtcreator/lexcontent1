import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, ContentItem } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Use Gemini 3 Flash Preview as recommended for modern tasks and better quotas
const MODEL_NAME = 'gemini-3-flash-preview';

const SYSTEM_INSTRUCTION = `
Você é o "LexContent AI", um estrategista de conteúdo jurídico sênior especializado em marketing ético para advogados brasileiros.
Sua missão é gerar conteúdo educativo, profissional e estritamente alinhado ao Código de Ética da OAB (Provimento 205/2021).
Nunca prometa resultados, não use tom apelativo e foque em autoridade através do conhecimento.
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Lógica de Retry para lidar com instabilidades temporárias do Google (Erro 503)
 */
async function retryOperation<T>(operation: () => Promise<T>, retries = 2, delayMs = 2000): Promise<T> {
    try {
        return await operation();
    } catch (error: any) {
        const status = error?.status || error?.code;
        const message = error?.message?.toLowerCase() || "";

        // Se o erro for 429 (Cota Excedida), não adianta tentar de novo imediatamente
        if (status === 429 || message.includes('quota') || message.includes('limit exceeded') || message.includes('429')) {
            console.error("LIMITE DE COTA ATINGIDO (Erro 429).");
            throw new Error("QUOTA_EXCEEDED");
        }

        // Se for erro 503 (Sobrecarga), tenta novamente com espera
        if (retries > 0 && (status === 503 || message.includes('overloaded'))) {
            console.warn(`[LexContent] Modelo sobrecarregado. Tentando novamente em ${delayMs/1000}s...`);
            await delay(delayMs);
            return retryOperation(operation, retries - 1, delayMs * 2);
        }
        throw error;
    }
}

/**
 * Tratamento centralizado de erros da API
 */
const handleApiError = (error: any) => {
    if (error.message === "QUOTA_EXCEEDED") {
        alert("Limite de uso da IA atingido.\n\nComo você já ativou o faturamento, verifique no Google AI Studio se sua chave está vinculada ao projeto correto. Pode levar alguns minutos para o Google liberar sua nova cota (15 req/min).");
    } else {
        console.error("Erro na chamada da IA:", error);
        alert("Ocorreu um erro ao falar com a IA. Tente novamente em instantes.");
    }
};

export const generateCalendarPlan = async (
  profile: UserProfile, 
  duration: string, 
  frequency: string, 
  platforms: string[]
): Promise<ContentItem[]> => {
  
  const prompt = `Gere um cronograma de conteúdo estratégico para o escritório ${profile.firmName}.
  Áreas de atuação: ${profile.areasOfLaw}. Público-alvo: ${profile.targetAudience}. Tom: ${profile.tone}.
  Duração do plano: ${duration}. Frequência: ${frequency}. Redes: ${platforms.join(', ')}.
  
  REQUISITO: Retorne um ARRAY JSON. Cada objeto deve ter: title, platform, format, objective, copy (texto completo da legenda/roteiro) e dayOffset (inteiro do dia).`;

  try {
    const response = await retryOperation(async () => {
        // Use ai.models.generateContent to query GenAI with both the model name and prompt.
        return await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            platform: { type: Type.STRING },
                            format: { type: Type.STRING },
                            objective: { type: Type.STRING },
                            copy: { type: Type.STRING },
                            dayOffset: { type: Type.INTEGER }
                        },
                        required: ["title", "platform", "format", "objective", "copy", "dayOffset"]
                    }
                }
            }
        });
    });

    // Extracting text output from GenerateContentResponse using the .text property.
    const rawData = JSON.parse(response.text || "[]");
    const today = new Date();
    
    return rawData.map((item: any, index: number) => {
        const postDate = new Date();
        postDate.setDate(today.getDate() + (item.dayOffset || index));
        
        return {
            id: crypto.randomUUID(),
            title: item.title,
            date: postDate.toISOString().split('T')[0],
            platform: item.platform,
            format: item.format,
            objective: item.objective,
            status: 'Planejado',
            copy: item.copy,
            areaOfLaw: profile.areasOfLaw
        };
    });
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const generatePostContent = async (
  profile: UserProfile, 
  topic: string, 
  platform: string, 
  format: string
): Promise<string> => {
    const prompt = `Crie um conteúdo completo sobre o tema: "${topic}".
    Plataforma: ${platform}. Formato: ${format}. 
    Público: ${profile.targetAudience}. Estilo: ${profile.tone}. Área: ${profile.areasOfLaw}.
    Escreva a legenda final pronta para uso, com hashtags e sugestão visual.`;

    try {
        const response = await retryOperation(async () => {
            return await ai.models.generateContent({
                model: MODEL_NAME,
                contents: prompt,
                config: { systemInstruction: SYSTEM_INSTRUCTION }
            });
        });
        // Accessing response text directly via the .text property.
        return response.text || "Não foi possível gerar o conteúdo agora.";
    } catch (error) {
        handleApiError(error);
        return "Erro de conexão com a IA. Verifique sua cota.";
    }
}

export const chatWithAI = async (
    history: any[],
    message: string,
    profile: UserProfile
) => {
    try {
        const chat = ai.chats.create({
            model: MODEL_NAME,
            history: history,
            config: { 
                systemInstruction: SYSTEM_INSTRUCTION + `\nContexto do Usuário: ${JSON.stringify(profile)}` 
            }
        });
        const result = await retryOperation(async () => await chat.sendMessage({ message }));
        // Accessing result text directly via the .text property.
        return result.text;
    } catch (error) {
        handleApiError(error);
        return "Desculpe, meu limite de processamento foi atingido. Tente novamente em um minuto.";
    }
}