import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

const ALLOWED_ANIMALS = [
  "cat", "dog", "lion", "elephant", "giraffe",
  "monkey", "rabbit", "bear", "fish", "bird",
  "cow", "pig", "duck", "frog", "horse"
];

// In-memory cache for generated animal images to make game snappy and save quota
const imageCache = new Map<string, string>();

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Image generation endpoint
app.post("/api/generate-image", async (req, res) => {
  const { animal } = req.body;

  if (!animal || typeof animal !== "string" || !ALLOWED_ANIMALS.includes(animal.toLowerCase())) {
    res.status(400).json({ error: "Invalid animal requested" });
    return;
  }

  const cleanAnimal = animal.toLowerCase();

  // Check cache first
  if (imageCache.has(cleanAnimal)) {
    res.json({ success: true, imageUrl: imageCache.get(cleanAnimal), cached: true });
    return;
  }

  const ai = getAiClient();
  if (!ai) {
    // Graceful fallback to emoji without failing
    res.json({ success: false, fallback: true, message: "Gemini API key not configured" });
    return;
  }

  try {
    // Attempt image generation with a clean, child-friendly prompt
    const prompt = `A cute, bright, friendly cartoon illustration of a ${cleanAnimal} for young children, simple clean colorful storybook style, solid vibrant background, happy expression, high quality`;

    // Try imagen-3.0-generate-002 first, or fallback to gemini-3.1-flash-lite-image
    let base64Image: string | null = null;

    try {
      const imgRes = await ai.models.generateImages({
        model: "imagen-3.0-generate-002",
        prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: "1:1",
        },
      });

      const firstImg = imgRes.generatedImages?.[0]?.image?.imageBytes;
      if (firstImg) {
        base64Image = `data:image/jpeg;base64,${firstImg}`;
      }
    } catch (imagenError: any) {
      console.warn("Imagen generation error, attempting flash-lite-image:", imagenError?.message || imagenError);
      
      try {
        const contentRes = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [{ text: prompt }],
          },
        });

        const parts = contentRes.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || "image/png";
            base64Image = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      } catch (flashError: any) {
        console.warn("Flash image generation also failed:", flashError?.message || flashError);
      }
    }

    if (base64Image) {
      imageCache.set(cleanAnimal, base64Image);
      res.json({ success: true, imageUrl: base64Image, cached: false });
    } else {
      res.json({ success: false, fallback: true });
    }
  } catch (error: any) {
    console.error("Image generation failed:", error?.message || error);
    // Never freeze or return 500 error; always gracefully trigger client emoji fallback
    res.json({ success: false, fallback: true });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
