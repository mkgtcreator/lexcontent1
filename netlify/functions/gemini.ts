import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

const SYSTEM_INSTRUCTION = `
Você é o "LexContent AI", um estrategista de conteúdo jurídico sênior especializado em marketing ético para advogados brasileiros.
Siga rigorosamente o Código de Ética da OAB (Provimento 205/2021).
Nunca prometa resultados e mantenha tom profissional.
`;

export const handler = async (event: any) => {
  try {
    const { action, payload } = JSON.parse(event.body);

    // 🔹 Estratégia automática (cronograma)
    if (action === "generateCalendar") {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: payload.prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: payload.schema,
        },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ text: response.text }),
      };
    }

    // 🔹 Conteúdo manual (post)
    if (action === "generatePost") {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: payload.prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ text: response.text }),
      };
    }

    // 🔹 Chat
    if (action === "chat") {
      const chat = ai.chats.create({
        model: "gemini-1.5-flash",
        history: payload.history,
        config: {
          systemInstruction:
            SYSTEM_INSTRUCTION +
            `\nContexto do usuário: ${JSON.stringify(payload.profile)}`,
        },
      });

      const result = await chat.sendMessage({ message: payload.message });

      return {
        statusCode: 200,
        body: JSON.stringify({ text: result.text }),
      };
    }

    return { statusCode: 400, body: "Ação inválida" };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
