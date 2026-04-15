"use client";

import { useState, useRef, useEffect } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";

interface AppHistory {
  id: string;
  prompt: string;
  code: string;
  timestamp: number;
}

const TEMPLATES = [
  { name: "Todo App", prompt: "a simple todo list app with add and delete functionality" },
  { name: "Weather Widget", prompt: "a weather widget that shows current temperature and conditions" },
  { name: "Habit Tracker", prompt: "a habit tracker to track daily habits with checkmarks" },
  { name: "Counter App", prompt: "a simple counter with increment and decrement buttons" },
  { name: "Timer", prompt: "a countdown timer with start, pause, and reset buttons" },
  { name: "Calculator", prompt: "a basic calculator with add, subtract, multiply, divide operations" },
  { name: "Notes App", prompt: "a notes app where users can create, edit, and delete notes" },
  { name: "Pomodoro Timer", prompt: "a pomodoro timer that alternates between 25 min work and 5 min break" },
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<AppHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"react" | "vue" | "vanilla">("react");
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join("");
          setPrompt(transcript);
        };
      }
    }
  }, []);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("prestomagic-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (prompt: string, code: string) => {
    const newEntry: AppHistory = {
      id: Date.now().toString(),
      prompt,
      code,
      timestamp: Date.now(),
    };
    const updated = [newEntry, ...history].slice(0, 20);
    setHistory(updated);
    localStorage.setItem("prestomagic-history", JSON.stringify(updated));
  };

  const handleGenerate = async (textPrompt: string = prompt) => {
    if (!textPrompt.trim()) {
      setError("Please describe your app");
      return;
    }

    setLoading(true);
    setError(null);
    setEditMode(false);

    try {
      const response = await fetch("/api/generateCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate app");
      }

      const data = await response.json();
      setGeneratedCode(data.code);
      setEditedCode(data.code);
      setCurrentPrompt(textPrompt);
      saveToHistory(textPrompt, data.code);
      generateSuggestions(data.code);
      setSuggestions([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred"
      );
      setGeneratedCode(null);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (code: string) => {
    const newSuggestions = [];
    if (!code.includes("background")) newSuggestions.push("Add a dark mode theme");
    if (!code.includes("animation")) newSuggestions.push("Add smooth animations");
    if (!code.includes("localStorage")) newSuggestions.push("Add data persistence");
    if (!code.includes("useState")) newSuggestions.push("Add more interactive features");
    setSuggestions(newSuggestions.slice(0, 3));
  };

  const handleRefine = async (suggestion: string) => {
    const refinedPrompt = `${currentPrompt}. ${suggestion}`;
    setPrompt(refinedPrompt);
    handleGenerate(refinedPrompt);
  };

  const handleTemplateClick = (template: typeof TEMPLATES[0]) => {
    setPrompt(template.prompt);
    handleGenerate(template.prompt);
  };

  const handleDownloadCode = () => {
    if (!generatedCode) return;
    const element = document.createElement("a");
    const file = new Blob([generatedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "App.tsx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    const btn = document.activeElement as HTMLButtonElement;
    const originalText = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  };

  const handleGenerateShareUrl = () => {
    if (!generatedCode) return;
    const encoded = btoa(generatedCode);
    const url = `${window.location.origin}?code=${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-purple-light flex flex-col">
      <main className="flex-1 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center justify-center gap-3 flex-1">
                <span className="text-4xl text-amber-brand animate-pulse">✦</span>
                <h1 className="text-3xl sm:text-5xl font-bold text-purple-brand">
                  PrestoMagic
                </h1>
              </div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-4 py-2 bg-purple-brand text-white rounded-xl text-sm hover:opacity-90 transition"
              >
                {showHistory ? "Hide" : "History"}
              </button>
            </div>

            <p className="text-center text-ink text-lg mb-8">
              No code. Just a little magic.
            </p>

            {/* Templates */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-ink mb-3">Quick Start Templates</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => handleTemplateClick(template)}
                    disabled={loading}
                    className="px-3 py-2 bg-purple-light border border-purple-brand text-purple-brand text-xs font-semibold rounded-lg hover:bg-purple-brand hover:text-white transition disabled:opacity-50"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Section */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-2">
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
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-purple-brand text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-brand transition"
                />
                <button
                  onClick={handleVoiceInput}
                  className={`px-4 py-4 rounded-xl font-semibold transition ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-amber-brand text-white hover:opacity-90"
                  }`}
                  title="Voice input"
                >
                  🎤
                </button>
              </div>

              {/* Language Selection */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="w-full px-4 py-2 border-2 border-purple-brand rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-amber-brand"
              >
                <option value="react">React + TypeScript</option>
                <option value="vue">Vue 3</option>
                <option value="vanilla">Vanilla JavaScript</option>
              </select>

              <button
                onClick={() => handleGenerate()}
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

            {/* History Panel */}
            {showHistory && history.length > 0 && (
              <div className="mb-6 max-h-48 overflow-y-auto bg-purple-light rounded-xl p-4">
                <h3 className="font-semibold text-ink mb-3">Recent Creations</h3>
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setGeneratedCode(item.code);
                        setEditedCode(item.code);
                        setCurrentPrompt(item.prompt);
                        setShowHistory(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-white border border-purple-brand rounded-lg text-sm text-ink hover:bg-purple-light transition truncate"
                    >
                      {item.prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generated App */}
            {generatedCode && (
              <div className="mt-8 border-t-2 border-purple-light pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-ink">Your App</h2>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-2 bg-amber-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={handleDownloadCode}
                      className="px-3 py-2 bg-purple-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
                    >
                      ⬇️ Download
                    </button>
                    <button
                      onClick={handleGenerateShareUrl}
                      className="px-3 py-2 bg-purple-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
                    >
                      🔗 Share
                    </button>
                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="px-3 py-2 bg-purple-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition"
                    >
                      ✏️ {editMode ? "Preview" : "Edit"}
                    </button>
                  </div>
                </div>

                {editMode ? (
                  <div className="space-y-2 mb-4">
                    <textarea
                      value={editedCode}
                      onChange={(e) => setEditedCode(e.target.value)}
                      className="w-full h-64 px-4 py-2 border-2 border-purple-brand rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-brand"
                    />
                    <button
                      onClick={() => {
                        setGeneratedCode(editedCode);
                        setEditMode(false);
                      }}
                      className="w-full px-4 py-2 bg-amber-brand text-white font-semibold rounded-xl hover:opacity-90 transition"
                    >
                      Apply Changes
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden shadow-md border border-purple-light mb-4">
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
                )}

                {/* Share URL Display */}
                {shareUrl && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                    ✓ Share link copied! {shareUrl}
                  </div>
                )}

                {/* AI Suggestions */}
                {suggestions.length > 0 && (
                  <div className="mt-6 p-4 bg-purple-light rounded-xl">
                    <h3 className="font-semibold text-ink mb-3">Suggested Improvements</h3>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleRefine(suggestion)}
                          className="w-full text-left px-4 py-2 bg-white border border-purple-brand rounded-lg text-sm text-ink hover:bg-purple-light transition"
                        >
                          💡 {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 sm:px-8 text-center text-ink text-sm">
        Powered by Llama 3.3 70B + Together AI · Workflows by AINL
      </footer>
    </div>
  );
}
