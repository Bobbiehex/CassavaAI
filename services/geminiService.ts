
import { AIAnalysisResult } from "../types";
import { getApiBaseUrl } from '../config';

export const analyzeCropImage = async (base64Image: string): Promise<AIAnalysisResult> => {
   try {
       const API_BASE_URL = getApiBaseUrl();
       const response = await fetch(`${API_BASE_URL}/gemini/analyze`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ image: base64Image })
       });
       
       if (!response.ok) {
           let errMsg = `API Error: ${response.status}`;
           try {
               const errData = await response.json();
               if (errData && errData.rawAnalysis) {
                   return errData;
               }
               if (errData && errData.error) {
                   errMsg = errData.error;
               } else if (errData && errData.message) {
                   errMsg = errData.message;
               }
           } catch (e) {
               // ignore
           }
           throw new Error(errMsg);
       }
       return await response.json();
   } catch (error) {
       console.error("Gemini Proxy Error:", error);
       return {
           detectedSubject: "Error",
           condition: "Unknown",
           confidence: 0,
           issues: ["Failed to analyze image"],
           recommendations: ["Check internet connection", "Ensure API key is valid"],
           rawAnalysis: String(error)
       };
   }
};

export const createSupportBotSession = (language: string = 'english'): any => {
    return { language, isSupport: true };
};

export const createChatSession = (language: string = 'english'): any => {
    return { language, isSupport: false };
};

export const sendChatMessage = async (chatSession: any, message: string, history: any[] = []): Promise<string> => {
   try {
       const API_BASE_URL = getApiBaseUrl();
       const response = await fetch(`${API_BASE_URL}/gemini/chat`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ message, language: chatSession.language, history, isSupport: chatSession.isSupport })
       });
       if (!response.ok) {
           let errMsg = `API Error: ${response.status}`;
           try {
               const errData = await response.json();
               if (errData && errData.text) {
                   return errData.text;
               }
               if (errData && errData.error) {
                   errMsg = errData.error;
               } else if (errData && errData.message) {
                   errMsg = errData.message;
               }
           } catch (e) {
               // ignore
           }
           throw new Error(errMsg);
       }
       const data = await response.json();
       return data.text || "I'm having trouble thinking right now. Please try again.";
   } catch (error) {
       console.error("Chat Error:", error);
       return "Connection error with AI service.";
   }
};
