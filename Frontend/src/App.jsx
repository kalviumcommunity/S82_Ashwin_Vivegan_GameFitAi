import { useState } from "react";

export default function App() {
  const [model, setModel] = useState("");
  const [game, setGame] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zeroShot, setZeroShot] = useState(false);
  const [oneShot, setOneShot] = useState(false);
  const [multiShot, setMultiShot] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);

    let endpoint = "check"; // default system prompt
    if (multiShot) endpoint = "check-multi-shot";
    else if (oneShot) endpoint = "check-one-shot";
    else if (zeroShot) endpoint = "check-zero-shot";

    try {
      const res = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, game }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Something went wrong" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎮 GameFit AI</h1>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <input
          type="text"
          placeholder="Enter your PC/Laptop model..."
          className="w-full border p-2 rounded-lg"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter game title..."
          className="w-full border p-2 rounded-lg"
          value={game}
          onChange={(e) => setGame(e.target.value)}
        />

        <div className="flex items-center space-x-4">
          <label>
            <input
              type="checkbox"
              checked={zeroShot}
              onChange={() => {
                setZeroShot(!zeroShot);
                if (!zeroShot) {
                  setOneShot(false);
                  setMultiShot(false);
                }
              }}
            />{" "}
            Zero-Shot
          </label>

          <label>
            <input
              type="checkbox"
              checked={oneShot}
              onChange={() => {
                setOneShot(!oneShot);
                if (!oneShot) {
                  setZeroShot(false);
                  setMultiShot(false);
                }
              }}
            />{" "}
            One-Shot
          </label>

          <label>
            <input
              type="checkbox"
              checked={multiShot}
              onChange={() => {
                setMultiShot(!multiShot);
                if (!multiShot) {
                  setZeroShot(false);
                  setOneShot(false);
                }
              }}
            />{" "}
            Multi-Shot
          </label>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading
            ? "Checking..."
            : multiShot
            ? "Check Multi-Shot"
            : oneShot
            ? "Check One-Shot"
            : zeroShot
            ? "Ask AI"
            : "Check Compatibility"}
        </button>
      </div>

      {result && (
        <div className="mt-6 w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : zeroShot || oneShot || multiShot ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">AI Response</h2>
              <p>{result.response}</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <p><b>Compatible:</b> {result.compatible ? "✅ Yes" : "❌ No"}</p>
              <p><b>Settings:</b> {result.settings}</p>
              <p><b>FPS Estimate:</b> {result.fps_estimate}</p>
              <p><b>Bottleneck:</b> {result.bottleneck}</p>
              <p><b>Upgrade Suggestion:</b> {result.upgrade_suggestion}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
