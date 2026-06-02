import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

let aiClient = null;
function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Settings menu (or in your .env file).");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const parseJsonFromMarkdown = (text) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e2) {
        console.error("Failed to parse extracted JSON", e2);
        return null;
      }
    }
    return null;
  }
};

// POST /api/gemini/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { image } = req.body;
    
    // Check if the base64 string includes the data uri prefix
    const base64Data = image.startsWith('data:image') 
      ? image.split(',')[1] 
      : image;

    const prompt = `
      You are an expert cassava agronomist. Analyze this cassava leaf or plant image.
      Identify the cassava variety (if possible), growth stage, and carefully check for cassava specific diseases such as:
      - Cassava Mosaic Disease (CMD)
      - Cassava Brown Streak Disease (CBSD)
      - Cassava Bacterial Blight (CBB)
      - Cassava Green Mite (CGM) Damage
      - Brown Leaf Spot (BLS)
      - Healthy Cassava leaves

      Estimate an NDVI visual score (0.0 to 1.0) if applicable.
      
      Return a STRICT JSON object with this structure:
      {
        "detectedSubject": "Specific Cassava Issue or Healthy Plant",
        "condition": "Healthy/Warning/Critical",
        "confidence": 0-100 (number),
        "issues": ["List of specific issues found"],
        "recommendations": ["List of 3 actionable recommendations for cassava farmers"]
      }
      Do not add any markdown formatting outside the JSON.
    `;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.2,
      }
    });

    const text = response.text || "{}";
    const parsed = parseJsonFromMarkdown(text);

    if (!parsed) {
      throw new Error("Could not parse AI response");
    }

    res.json({
      detectedSubject: parsed.detectedSubject || "Unknown Crop",
      condition: parsed.condition || "Unknown",
      confidence: parsed.confidence || 0,
      issues: parsed.issues || [],
      recommendations: parsed.recommendations || [],
      rawAnalysis: text
    });

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    let errorMessage = "Failed to analyze image";
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }

    // Still send a 500 error code but with a predictable JSON structure so frontend parses it
    res.status(500).json({
      error: errorMessage,
      detectedSubject: "Error",
      condition: "Unknown",
      confidence: 0,
      issues: [errorMessage],
      recommendations: ["Ensure API key is correctly configured via Settings menu or .env variables."],
      rawAnalysis: errorMessage
    });
  }
});

// POST /api/gemini/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, language, history = [], isSupport } = req.body;

    let systemInstruction = '';
    
    if (isSupport) {
      systemInstruction = `You are Agrivision Support Bot, an AI assistant for the Agrivision farm management platform.
      Your goal is to help users resolve their issues quickly. 
      If the user asks a simple question about how to use the app (e.g., how to add a farm, how to view crop health), answer it concisely.
      If the user has a complex issue, a bug, a billing problem, or explicitly asks for a human agent, you MUST say: "I will escalate this to a human agent. Please wait while I book a ticket for you."
      IMPORTANT: You must respond in the '${language}' language. Format your answers clearly.`;
    } else {
      systemInstruction = `You are CassavaBot, a highly specialized Cassava agronomist/advisor. You provide concise, scientific, and practical advice on cassava leaf diseases (like Cassava Mosaic Disease, Cassava Brown Streak Disease, Cassava Bacterial Blight), stem cuttings, fertilizer for cassava, and soil wellness. 
      IMPORTANT: You must respond in the '${language}' language. Format your answers clearly using Markdown.`;
    }

    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3.1-pro',
      config: {
        systemInstruction
      }
    });

    // Replay history to build the session state natively in the SDK if needed.
    // However, the new `@google/genai` syntax currently allows passing history to model config or we can just pass the whole content array if preferred, but we will just manually send the latest message for now to fix the core error.
    
    // Alternatively, we just use generateContent with concatenated history, but chat.sendMessage works if we only care about single turns or if we recreate the chat.
    // To support history accurately in genai SDK, we rebuild contents array.
    const contents = history.map(msg => ({
      role: msg.role === 'model' || msg.role === 'assistant' || msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro',
      contents,
      config: {
        systemInstruction
      }
    });

    res.json({ text: response.text || "I'm having trouble thinking right now. Please try again." });
  } catch (error) {
    console.error("Chat Error:", error);
    let errorMessage = "Connection error with AI service.";
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    res.status(500).json({ text: errorMessage, error: errorMessage });
  }
});

export default router;
