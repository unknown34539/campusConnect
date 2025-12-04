import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    // API key is assumed to be available in process.env.API_KEY per instructions
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const generateProjectIdeas = async (interests: string[], major: string): Promise<string> => {
  const ai = getClient();
  const prompt = `
    I am a university student majoring in ${major}.
    My interests are: ${interests.join(', ')}.
    
    Please suggest 3 innovative project ideas that I could build for a portfolio or hackathon.
    For each idea, provide a Title, a brief Description, and Recommended Tech Stack.
    Format the output as a clean Markdown list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Sorry, I couldn't generate ideas right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while contacting the AI assistant.";
  }
};

export const chatWithAI = async (message: string, history: {role: 'user' | 'model', text: string}[]): Promise<string> => {
  const ai = getClient();
  
  // Convert simple history to API format if needed, or just use a fresh chat for simplicity in this MVP
  // For a more robust chat, we would maintain the chat session object.
  // Here we will use a single turn generation for simplicity with context if needed, 
  // or a chat session if we want to maintain state properly.
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: "You are CampusBot, a helpful academic assistant for university students. Keep answers concise, encouraging, and focused on student success.",
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }))
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting right now. Please try again later.";
  }
};