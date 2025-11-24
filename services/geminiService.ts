import { GoogleGenAI } from "@google/genai";
import { Character } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateSenseiWisdom = async (score: number, character: Character): Promise<string> => {
  const ai = createClient();
  if (!ai) {
    return "Wisdom comes from within... (API Key missing)";
  }

  try {
    const prompt = `
      The player just finished a game of 3D Watermelon Slicing.
      
      Player Stats:
      - Score: ${score}
      - Character Played: ${character.name} (${character.description})
      
      Task:
      Generate a short, profound, or humorous 1-sentence quote tailored to their performance and the element of their character. 
      If the score is low (< 10), be encouraging. If high (> 50), be praiseworthy.
      Mention watermelons or fruit metaphorically.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a wise, slightly mystical, but cheerful Fruit Ninja Sensei.",
      }
    });

    return response.text?.trim() || "The melon is round, like the circle of life.";
  } catch (error) {
    console.error("Error generating wisdom:", error);
    return "Even the sharpest blade sometimes misses. (Network Error)";
  }
};