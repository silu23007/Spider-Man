import React, { useState, useRef, useEffect } from "react";
import { CommMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Send, Terminal, Newspaper, AlertOctagon, HelpCircle, ArrowRight, Loader } from "lucide-react";

export default function DailyBugleConsole() {
  // Chat Console States
  const [activePersona, setActivePersona] = useState<"PETER" | "BRUCE">("PETER");
  const [messages, setMessages] = useState<CommMessage[]>([
    {
      id: "init",
      sender: "SYSTEM",
      text: " Avenger-Protocol Secured Link established. Select frequency to connect.",
      timestamp: new Date()
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Daily Bugle Rant States
  const [rantTopic, setRantTopic] = useState("Vigilante noise violations in Queens");
  const [generatedRant, setGeneratedRant] = useState<string>("");
  const [isRantLoading, setIsRantLoading] = useState(false);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle connection greetings
  useEffect(() => {
    let greeting = "";
    if (activePersona === "PETER") {
      greeting = "Yo! Spidey here. Signal is a bit fuzzy, I'm swinging through Queens right now. Did you find those gamma weapon crates Bruce was talking about?";
    } else {
      greeting = "Dr. Bruce Banner here. My sensors are picking up anomalous kinetic readings in downtown New York. What are you seeing on the ground?";
    }
    
    setMessages((prev) => [
      ...prev,
      {
        id: `greeting-${activePersona}-${Date.now()}`,
        sender: activePersona,
        text: greeting,
        timestamp: new Date()
      }
    ]);
  }, [activePersona]);

  const handleSendComm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isChatLoading) return;

    const currentInput = userInput;
    setUserInput("");

    // Append user message
    const userMsg: CommMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: currentInput,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      // Gather history
      const history = messages
        .filter((m) => m.sender !== "SYSTEM")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text
        }));

      const res = await fetch("/api/gemini/commlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          character: activePersona,
          message: currentInput,
          history
        })
      });

      if (!res.ok) throw new Error("Connection timed out.");
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: activePersona,
          text: data.text || "Connection glitch. Try again.",
          timestamp: new Date()
        }
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "SYSTEM",
          text: `⚠️ Transceiver frequency failure: ${err.message || "Unknown anomaly"}`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleGenerateRant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rantTopic.trim() || isRantLoading) return;

    setIsRantLoading(true);
    setGeneratedRant("");

    try {
      const res = await fetch("/api/gemini/bugle-rant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: rantTopic })
      });

      if (!res.ok) throw new Error("Daily Bugle servers are congested.");
      const data = await res.json();

      setGeneratedRant(data.text);
    } catch (err: any) {
      console.error(err);
      setGeneratedRant(`⚠️ EDITORIAL CRITICAL EXCEPTION: DAILY BUGLE SERVERS BLOCKED BY SPIDER-SHIELD FIREWALL! (${err.message})`);
    } finally {
      setIsRantLoading(false);
    }
  };

  return (
    <div id="bugle-console-section" className="py-16 px-4 max-w-7xl mx-auto z-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Module A: Avengers Transceiver Console (Terminal Chat) */}
        <div className="flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-white/5 border-b border-white/10 p-3 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-mono text-xs font-bold text-zinc-300">AVENGER TRANSCEIVER LINK v1.2</span>
            </div>
            
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
          </div>

          {/* Persona selector tabs */}
          <div className="grid grid-cols-2 border-b border-white/10 bg-black/20">
            <button
              onClick={() => setActivePersona("PETER")}
              className={`py-3 text-xs font-mono uppercase font-black tracking-widest cursor-pointer transition-all duration-200 ${
                activePersona === "PETER"
                  ? "bg-red-950/20 text-red-400 border-r border-white/10"
                  : "text-zinc-500 hover:bg-white/5 border-r border-white/10"
              }`}
            >
              📡 Peter's Web-Comm Link
            </button>
            <button
              onClick={() => setActivePersona("BRUCE")}
              className={`py-3 text-xs font-mono uppercase font-black tracking-widest cursor-pointer transition-all duration-200 ${
                activePersona === "BRUCE"
                  ? "bg-emerald-950/20 text-emerald-400"
                  : "text-zinc-500 hover:bg-white/5"
              }`}
            >
              🧪 Banner S.H.I.E.L.D. Link
            </button>
          </div>

          {/* Chat message logs view */}
          <div className="flex-1 min-h-96 max-h-110 overflow-y-auto p-4 space-y-3 bg-black/10 font-mono text-xs flex flex-col">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              const isSys = m.sender === "SYSTEM";
              
              let bubbleStyle = "bg-white/5 text-zinc-300 border border-white/10 self-start rounded-xl";
              let label = "VIGILANTE COMM";
              if (isUser) {
                bubbleStyle = "bg-red-500/10 text-red-200 border-red-500/20 self-end ml-10 rounded-xl";
                label = "YOU";
              } else if (isSys) {
                bubbleStyle = "bg-black/30 text-yellow-500 border-yellow-500/20 text-center w-full self-center italic rounded-xl";
                label = "COMM SIGNALS";
              } else if (m.sender === "BRUCE") {
                bubbleStyle = "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 self-start mr-10 rounded-xl";
                label = "DR. BANNER [HULK]";
              } else if (m.sender === "PETER") {
                bubbleStyle = "bg-red-500/10 text-red-300 border-red-500/20 self-start mr-10 rounded-xl";
                label = "PETER [SPIDER-MAN]";
              }

              return (
                <div key={m.id} className={`max-w-4/5 p-3 space-y-1 ${bubbleStyle}`}>
                  {!isSys && (
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider block">
                      {label}
                    </span>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  <span className="text-[8px] text-zinc-600 block text-right mt-1">
                    {m.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              );
            })}

            {isChatLoading && (
              <div className="bg-black/30 border border-white/10 text-zinc-400 p-3 rounded-xl self-start flex items-center space-x-2">
                <Loader className="w-3.5 h-3.5 animate-spin text-red-500" />
                <span className="animate-pulse">Decrypting response via satellite...</span>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendComm} className="border-t border-white/10 p-3 bg-black/20 flex space-x-2">
            <input
              type="text"
              placeholder={`Send encrypted message to ${activePersona === "PETER" ? "Peter Parker" : "Bruce Banner"}...`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={isChatLoading}
              className="flex-1 bg-black/40 text-white font-mono text-xs px-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/50"
            />
            <button
              type="submit"
              disabled={isChatLoading || !userInput.trim()}
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Module B: Daily Bugle Newspaper Rant Generator */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-5 md:p-6 flex flex-col justify-between text-white">
          
          <div className="space-y-4">
            
            {/* Header Newspaper Brand */}
            <div className="text-center border-b border-white/10 pb-3">
              <div className="flex items-center justify-center space-x-1.5 text-xs font-sans font-black tracking-widest uppercase">
                <Newspaper className="w-4 h-4 text-red-500" />
                <span>THE DAILY BUGLE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tighter uppercase leading-none mt-1 text-white">
                JJJ EDITORIAL BOARD
              </h1>
              <div className="flex justify-between items-center text-[9px] font-mono border-t border-white/10 mt-1 pt-1 text-zinc-400">
                <span>NEW YORK EDITION</span>
                <span>VOL. XCVI No. 204</span>
                <span>PRICE: ONE DIME</span>
              </div>
            </div>

            {/* Prompt Generator Input */}
            <form onSubmit={handleGenerateRant} className="space-y-3 bg-black/30 p-3 border border-white/10 rounded-2xl shadow-inner">
              <label className="text-xs font-mono font-bold block uppercase text-zinc-400">
                🚨 Input Rant Catalyst (Topic or Scandal):
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g., Spider-Man destroying subway signs or Hulk sized footprints"
                  value={rantTopic}
                  onChange={(e) => setRantTopic(e.target.value)}
                  disabled={isRantLoading}
                  className="flex-1 bg-black/40 text-white p-2 rounded-xl border border-white/10 font-mono text-xs focus:outline-none focus:border-red-500/30"
                />
                <button
                  type="submit"
                  disabled={isRantLoading || !rantTopic.trim()}
                  className="bg-red-600/80 hover:bg-red-700/80 text-white font-sans font-black text-xs px-4 py-2 uppercase border border-white/20 rounded-xl shadow-md cursor-pointer disabled:opacity-50 transition-all duration-200"
                >
                  {isRantLoading ? "WRITING..." : "LAUNCH RANT"}
                </button>
              </div>
            </form>

            {/* Article view container */}
            <div className="min-h-64 bg-black/30 border border-white/10 p-4 rounded-2xl shadow-inner overflow-y-auto max-h-80 font-serif leading-relaxed text-sm text-zinc-200">
              {isRantLoading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <div className="w-8 h-8 border-4 border-t-red-600 border-zinc-300 rounded-full animate-spin" />
                  <p className="font-mono text-xs text-zinc-600 animate-pulse">
                    J. Jonah Jameson is screaming at his secretary, generating column...
                  </p>
                </div>
              ) : generatedRant ? (
                <div className="prose prose-sm prose-zinc text-zinc-200 whitespace-pre-line">
                  {generatedRant}
                </div>
              ) : (
                <div className="text-center py-16 text-zinc-400 font-sans italic space-y-2">
                  <AlertOctagon className="w-8 h-8 mx-auto text-yellow-600 animate-bounce" />
                  <p className="text-xs">
                    No scandal printed yet. Use the editorial input above to force Jameson to release an angry bulletin against the Spider-Menace!
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Footnote */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Editor-in-Chief: J. JONAH JAMESON</span>
            <span className="text-red-500 font-bold">EXPOSING GUARDS & THREATS</span>
          </div>

        </div>

      </div>
    </div>
  );
}
