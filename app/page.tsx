"use client";

import { useState, useRef } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please describe your app");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generateCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate app");
      }

      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred"
      );
      setGeneratedCode(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-light flex flex-col">
      <main className="flex-1 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl text-amber-brand animate-pulse">✦</span>
              <h1 className="text-4xl sm:text-5xl font-bold text-purple-brand">
                PrestoMagic
              </h1>
            </div>

            <p className="text-center text-ink text-lg mb-8">
              No code. Just a little magic.
            </p>

            <div className="space-y-4">
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleGenerate();
                  }
                }}
                placeholder="Describe your app... e.g. a habit tracker"
                className="w-full px-6 py-4 rounded-xl border-2 border-purple-brand text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-brand transition"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full px-6 py-4 bg-purple-brand text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-pulse">✦</span>
                    Conjuring your app...
                  </>
                ) : (
                  <>Make it appear ✦</>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}
            </div>

            {generatedCode && (
              <div className="mt-8 border-t-2 border-purple-light pt-6">
                <h2 className="text-xl font-bold text-ink mb-4">
                  Your App
                </h2>
                <div className="rounded-xl overflow-hidden shadow-md border border-purple-light">
                  <Sandpack
                    template="react-ts"
                    files={{
                      "/App.tsx": {
                        code: generatedCode,
                        active: true,
                      },
                    }}
                    options={{
                      showLineNumbers: false,
                      showNavigator: false,
                      initMode: "immediate",
                    }}
                    theme="light"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-8 text-center text-ink text-sm">
        Powered by Kimi K2 + Together AI · Workflows by AINL
      </footer>
    </div>
  );
}
