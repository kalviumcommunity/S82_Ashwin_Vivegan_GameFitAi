import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function for generating responses with temperature
async function generateWithTemperature(prompt, stopSequences = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent({
  contents: [{ role: "user", parts: [{ text: prompt }] }],
  generationConfig: {
    temperature: 0.25, 
    topK: 40,
    topP: 0.7,          
    stopSequences: stopSequences.length > 0 ? stopSequences : undefined,
  },
});

const usage = result.response.usageMetadata;
console.log("Prompt tokens:", usage.promptTokenCount);
console.log("Completion tokens:", usage.candidatesTokenCount);
console.log("Total tokens:", usage.totalTokenCount);

return result.response.text().trim();
}


// ----------------- ZERO SHOT -----------------
app.post("/check-compatibility", async (req, res) => {
  const { model, game } = req.body;
  const prompt = `Check if ${model} can run ${game} smoothly.`;

  try {
    const response = await generateWithTemperature(prompt);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ----------------- ONE SHOT -----------------
app.post("/check-one-shot", async (req, res) => {
  const { model, game } = req.body;
  const oneShotPrompt = `
Example:
PC: RTX 3060, i5 12th Gen, 16GB RAM
Game: Cyberpunk 2077
Result: Compatible ✅, Runs at 60-80 FPS on High Settings.

Now check for:
PC: ${model}
Game: ${game}
Result:
`;

  try {
    const response = await generateWithTemperature(oneShotPrompt);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ----------------- MULTI SHOT -----------------
app.post("/check-multi-shot", async (req, res) => {
  const { model, game } = req.body;
  const multiShotPrompt = `
Examples:
PC: GTX 1650, i5 10th Gen, 8GB RAM
Game: GTA V
Result: ✅ Compatible, Runs 50-60 FPS on Medium.

PC: Intel UHD 620, i3 8th Gen, 4GB RAM
Game: Cyberpunk 2077
Result: ❌ Not Compatible, Game won’t run smoothly.

Now check for:
PC: ${model}
Game: ${game}
Result:
`;

  try {
    const response = await generateWithTemperature(multiShotPrompt);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ----------------- STOP SEQUENCE -----------------
app.post("/check-stop-sequence", async (req, res) => {
  const { model, game } = req.body;

  const stopPrompt = `
PC: ${model}
Game: ${game}
Answer only until you finish compatibility analysis. 
Do not generate anything after '---END---'.

Output:
`;

  try {
    let response = await generateWithTemperature(stopPrompt, ["---END---"]);
    response = response.replace(/---END---/g, ""); // cleanup if added

    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
