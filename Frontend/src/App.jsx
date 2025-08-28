import { useState } from "react";
import axios from "axios";

function App() {
  const [model, setModel] = useState("");
  const [game, setGame] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [zeroShot, setZeroShot] = useState(false);
  const [oneShot, setOneShot] = useState(false);
  const [multiShot, setMultiShot] = useState(false);
  const [stopSeq, setStopSeq] = useState(false);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);

    let endpoint = "check-compatibility";
    if (oneShot) endpoint = "check-one-shot";
    if (multiShot) endpoint = "check-multi-shot";
    if (stopSeq) endpoint = "check-stop-sequence";

    try {
      const response = await axios.post(`http://localhost:5000/${endpoint}`, {
        model,
        game,
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setResult({ response: "❌ Something went wrong." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">
        🎮 PC-Game Compatibility Checker
      </h1>

      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter PC Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Enter Game Name"
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />

        {/* Checkboxes */}
        <div className="flex flex-col gap-2 mb-4">
          <label>
            <input
              type="checkbox"
              checked={zeroShot}
              onChange={() => {
                setZeroShot(!zeroShot);
                setOneShot(false);
                setMultiShot(false);
                setStopSeq(false);
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
                setZeroShot(false);
                setMultiShot(false);
                setStopSeq(false);
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
                setZeroShot(false);
                setOneShot(false);
                setStopSeq(false);
              }}
            />{" "}
            Multi-Shot
          </label>
          <label>
            <input
              type="checkbox"
              checked={stopSeq}
              onChange={() => {
                setStopSeq(!stopSeq);
                setZeroShot(false);
                setOneShot(false);
                setMultiShot(false);
              }}
            />{" "}
            Stop Sequence
          </label>
        </div>

        {/* Button */}
        <button
          onClick={handleCheck}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
        >
          {loading
            ? "Checking..."
            : stopSeq
            ? "Check Stop Sequence"
            : multiShot
            ? "Check Multi-Shot"
            : oneShot
            ? "Check One-Shot"
            : zeroShot
            ? "Ask AI"
            : "Check Compatibility"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">AI Response</h2>
          <p>{result.response}</p>
        </div>
      )}
    </div>
  );
}

export default App;
