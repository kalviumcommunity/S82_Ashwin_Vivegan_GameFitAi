# 🎮 GameFit AI – Can I Run This Game?

**GameFit AI** is an intelligent AI-powered assistant that helps users determine whether a specific video game is compatible with their laptop or PC, based simply on the device model (e.g., *HP Pavilion 15-ec2008AX*). It leverages OpenAI’s capabilities to compare user hardware with game requirements, analyze bottlenecks, suggest optimal settings, and provide upgrade recommendations.

GameFit AI is designed to showcase the use of modern AI techniques (Prompting, Structured Output, Function Calling, RAG) within a full-stack web application built using React.js, Node.js/FastAPI, and the OpenAI API.

---

## 🎯 Project Objective

To build an interactive assistant that:
- Accepts laptop/PC **model name** as input
- Responds with structured compatibility results (JSON)
- Calls backend functions to fetch hardware specs and game requirements
- Retrieves external benchmark data or game compatibility info

---

## 🧠 Key AI Concepts Used

This project implements four essential AI development techniques:

---

### 1. 🗣️ Prompting

**What it is:**  
Prompting is how we communicate with the AI. It includes:

- **System Prompt:** Sets the assistant’s behavior and tone
- **User Prompt:** The actual user input (e.g., game + model)

**How GameFit AI uses it:**  
The system prompt is defined as:
> "You are GameFit, a professional hardware analyst. Based on the given laptop/PC model and a game title, determine if the system can run the game. Provide the result in structured JSON."

A user prompt might be:
> "Can I run GTA V on my HP Pavilion 15-ec2008AX?"

The LLM uses both to generate accurate, formatted responses based on hardware analysis and game specs.

---

### 2. 📦 Structured Output

**What it is:**  
Structured output ensures the model returns information in a machine-readable format like JSON.

**Why it matters:**  
This allows the frontend to easily parse and display:
- Compatibility status
- Suggested settings
- Estimated FPS
- Bottleneck analysis

**How GameFit AI uses it:**

The system prompt enforces a JSON structure:
json
{
  "compatible": true,
  "settings": "Medium",
  "fps_estimate": "45-60 FPS",
  "bottleneck": "GPU",
  "upgrade_suggestion": "Consider upgrading to a GTX 1650 or higher"
}
This output is directly used in the frontend UI.

3. ⚙️ Function Calling
What it is:
OpenAI’s function calling feature lets the AI suggest backend function calls to fetch real data.

Why it matters:
GameFit AI needs to look up exact specs for a model or retrieve official game requirements.

How GameFit AI uses it:

When the AI needs system data, it calls a function like:

json
Copy
Edit
{
  "function_call": {
    "name": "getLaptopSpecs",
    "arguments": {
      "model": "HP Pavilion 15-ec2008AX"
    }
  }
}
The backend processes this by searching the database and returns the full specs to the model to complete the response.

Other potential functions include:

getGameRequirements(gameTitle)

getBenchmarkScore(component)

compareSpecsAndPredict(game, specs)

4. 🔍 RAG (Retrieval-Augmented Generation)
What it is:
RAG enhances AI by retrieving up-to-date or external information and feeding it as context.

Why it matters:
GameFit AI needs access to:

Game minimum/recommended specs

Laptop hardware info (especially less common models)

Real-world benchmark and performance data

How GameFit AI uses it:

If a user says:

"Can I run Cyberpunk 2077 on a Dell G15 5525?"

GameFit:

Retrieves specs of the Dell G15 5525 (e.g., Ryzen 5 6600H, RTX 3050, 16GB RAM)

Retrieves Cyberpunk 2077’s requirements

Adds both to the prompt as context

The AI then makes an informed, grounded prediction

This RAG workflow ensures compatibility checks are accurate and real-world based.

🛠️ Tech Stack
Layer	Tools
Frontend	React.js, Tailwind CSS
Backend	Node.js (Express) or FastAPI
AI Model	OpenAI GPT-4 / GPT-4o
Data Sources	Internal JSON DBs (laptop specs, game specs), Benchmark APIs
Hosting	Vercel (frontend), Render/Railway (backend)
LLM Features	Prompting, Function Calling, RAG, Structured Output

📈 Example Use Case
💬 Prompt:

“Can I run Red Dead Redemption 2 on Acer Nitro 5 AN515-58?”

🤖 AI Output:

json
Copy
Edit
{
  "compatible": true,
  "settings": "High",
  "fps_estimate": "50-60 FPS",
  "bottleneck": null,
  "upgrade_suggestion": "None required"
}
Frontend renders:

✅ Compatibility: Yes

🎮 Recommended Settings: High

🔥 Estimated FPS: 50-60

🧠 Bottleneck: None

⚙️ Suggestion: You're good to go!

✅ Future Improvements
🔄 Auto-detect system specs (via Electron or browser APIs)

📊 FPS predictor model using regression

📥 Support custom hardware input (not just model)

🧠 Learn from user feedback to improve predictions

💬 Chat-based UI for natural interaction
