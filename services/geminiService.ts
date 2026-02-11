
import { GoogleGenAI, Type } from "@google/genai";
import { EstimateResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartEstimate = async (details: string): Promise<EstimateResponse> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Você é um especialista em planejamento de serviços domésticos e comerciais. 
    Analise a descrição: "${details}".
    Considere uma ampla gama de tarefas: limpeza padrão, pesada, pós-obra, pré-mudança, limpeza de escritórios, jardinagem, limpeza de calhas, portões e lavagem de telhados.
    
    REGRAS OBRIGATÓRIAS:
    1. O tempo deve ser em blocos de 4h, 6h ou 8h para serviços padrão.
    2. Tarefas de risco ou especializadas (telhados, calhas) devem ter um acréscimo no 'valorSugerido' devido ao risco e equipamentos necessários.
    3. Se for limpeza comercial (escritórios), considere a metragem se citada.
    4. No campo 'recomendacoes', liste os passos do serviço incluindo segurança se for externo.
    5. No campo 'explicacao', detalhe por que o serviço exige esse tempo (ex: tempo de secagem de telhado ou cuidado com eletrônicos em escritórios).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tempoEstimado: {
            type: Type.NUMBER,
            description: "Tempo total sugerido em horas",
          },
          valorSugerido: {
            type: Type.NUMBER,
            description: "Valor total baseado na complexidade da tarefa",
          },
          recomendacoes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Cronograma e passos do serviço",
          },
          explicacao: {
            type: Type.STRING,
            description: "Justificativa detalhada do tempo e valor",
          },
        },
        required: ["tempoEstimado", "valorSugerido", "recomendacoes", "explicacao"],
      },
    },
  });

  return JSON.parse(response.text || '{}') as EstimateResponse;
};

export const getAIAssistantMessage = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: 'Você é o concierge especializado do Só Diaristas. Você entende de tudo: desde limpeza fina de apartamentos até manutenção de calhas e lavagem de telhados. Ajude o cliente a entender a complexidade de cada tarefa e recomende o tempo ideal.',
    }
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
