import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface HealthProvider {
  name: string;
  location: string;
  specialty: string;
  rating: number;
  image: string;
  description: string;
}

export async function discoverHealthcare(query: string): Promise<HealthProvider[]> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for top-tier providers (such as state-of-the-art hospitals, specialized air transport teams, homecare helpers, medical logistics suppliers, or custom medical equipment importers) based on this query: "${query}". 
      If the query is general, suggest high-quality worldwide options. 
      If the query highlights a specific region, suggest outstanding providers available for or in that region.
      Return a list of 3 premium, highly reputable agencies or centers.`,
      config: {
        systemInstruction: "You are a warm, highly resourceful global health coordinator. When users explain their needs (such as specialized treatment travel, urgent flights, at-home support, or medical device imports), you match them with renowned, highly realistic vendors. Always return valid JSON and friendly, human-centric descriptions.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              location: { type: Type.STRING },
              specialty: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              image: { type: Type.STRING, description: "A high-quality Unsplash image URL related to medical/hospital" },
              description: { type: Type.STRING }
            },
            required: ["name", "location", "specialty", "rating", "image"]
          }
        }
      }
    });

    if (!response.text) return [];
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Discovery Error:", error);
    return [];
  }
}
