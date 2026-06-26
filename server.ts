import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google GenAI client lazily or safely
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fall back to local responses.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Enable JSON body parsing
app.use(express.json());

// API Routes FIRST

// 1. Comm-Link endpoint (Peter / Bruce Chat)
app.post("/api/gemini/commlink", async (req, res) => {
  try {
    const { character, message, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getAIClient();
    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is missing, return a fun, immersive mock response
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      let mockReply = "";
      if (character === "PETER") {
        mockReply = `[Comm-Link Offline - Static Buzzing]\n"Hey! Peter here. Signal is a bit weak right now—probably Norman's tech jamming my frequency. But in short: yes, I'm tracking those gamma signatures across Queens! They look exactly like the residue Bruce warned me about. Catch you on the flip side!"`;
      } else {
        mockReply = `[S.H.I.E.L.D. Secure Terminal - Simulated Mode]\n"Dr. Banner here. My sensors are picking up a local grid-jam. Let's look at the data: the spatial displacement vector in Manhattan is matching Peter's spider-tracer frequencies perfectly. Keep safe out there, kid. The green guy is getting restless."`;
      }
      return res.json({ text: mockReply });
    }

    const isPeter = character === "PETER";
    const systemInstruction = isPeter
      ? "You are Peter Parker (Spider-Man) in the MCU, post-No Way Home ('Brand New Day' era). Everyone has forgotten your true identity. You are witty, energetic, slightly tired, but deeply heroic, swinging around NYC. You are secretly working with Dr. Bruce Banner (Hulk) to trace a dangerous gamma-tech weapons ring. Keep your response brief, interactive, under 120 words, witty, and stay firmly in character."
      : "You are Dr. Bruce Banner (Smart Hulk) in the MCU. You are highly analytical, friendly, and science-focused. You act as a mentor and 'science bro' to Spider-Man (Peter Parker). You are tracking strange multiversal/gamma energy anomalies in NYC. Keep your response brief, scientific, reassuring, under 120 words, and firmly in character as a brilliant Avenger.";

    // Convert history to format suited for API
    // We can compile contents with systemInstruction in the config
    const contents = [];
    
    // Add history
    for (const h of history) {
      contents.push({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }]
      });
    }
    
    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in commlink API:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 2. Daily Bugle rants generator
app.post("/api/gemini/bugle-rant", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required." });
    }

    const ai = getAIClient();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      const mockRant = `# EXCLUSIVE: SPIDER-MENACE ALIGNING WITH GREEN GOLIATH TO RANSACK NEW YORK!\n\n**By J. Jonah Jameson, Editor-in-Chief**\n\nI told you so! I told all of you, but did anyone listen?! NO! Under the guise of a 'Brand New Day', that masked arachnid vigilante is back, swinging around our beautiful city as if he owns the skyline! And if that wasn't enough to make your blood boil, my secret sources tell me he's been spotted exchanging secret encrypted frequencies with none other than the HULK! \n\nThat's right, folks! The menace of Queens and the monster of Manhattan, colluding! Are they planning a scientific breakthroughs? Or are they planning to smash the Brooklyn Bridge into rubble?! I'll give you three guesses, and the first two don't count! Stay alert, citizens! Demand accountability! Demand Spider-Man unmasks!`;
      return res.json({ text: mockRant });
    }

    const systemInstruction = "You are J. Jonah Jameson, the legendary, hot-tempered, Spider-Man-hating Editor-in-Chief of the Daily Bugle. You speak in shouting uppercase words, use excessive exclamation marks, are extremely dramatic, and find a way to blame Spider-Man for whatever topic is presented, even if it makes no logical sense. Write a scandalous editorial article. Keep it to 150-200 words, formatted in Markdown with a catchy headline, and make sure to include references to the 'green menace' or 'Hulk' if relevant!";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Write an editorial article about: ${topic}`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in Bugle-Rant API:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Setup Vite Dev server or Serve production assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error("Failed to start server:", err);
});
