"use client";

import React, { useState } from "react";
import {
  Cpu,
  Layers,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Play,
  Terminal,
  Send,
  Code2,
  Activity,
  History,
  Copy,
  Check,
  Flame,
  Zap,
} from "lucide-react";
import { useNeuroForge, AGENT_PERSONAS, PRESET_MISSIONS } from "@/context/NeuroForgeContext";
import { formatNumber } from "@/lib/utils";

export default function NeuroForgeStudioPage() {
  const {
    currentMission,
    missions,
    startMission,
    selectMission,
    loadPreset,
    totalLifetimeTokens,
  } = useNeuroForge();

  const [inputPrompt, setInputPrompt] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || currentMission?.status === "running") return;
    startMission(inputPrompt.trim());
    setInputPrompt("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans pb-24">
      {/* Hero Mission Control */}
      <section className="bg-gradient-to-r from-[#070d1e] via-[#0f172a] to-[#070d1e] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden neon-glow-cyan">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Multi-Agent Consensus Matrix</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            High-ROI Heavy AI <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Orchestrator Studio
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Perintahkan 5 Agen Otonom (Architect, Coder, SecOps, QA, Arbiter) untuk berdebat, merevisi, dan memvalidasi arsitektur enterprise lu secara rekursif dengan integrasi streaming 9Router.
          </p>

          {/* Quick Preset Buttons */}
          <div className="pt-2">
            <span className="text-[11px] font-mono text-slate-400 block mb-2 font-bold">Preset Misi Kelas Berat:</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_MISSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => loadPreset(p)}
                  className="px-3 py-1.5 rounded-xl bg-[#11192e] border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleLaunch} className="mt-6 pt-6 border-t border-slate-800/80 flex items-center gap-3">
          <input
            type="text"
            placeholder="Masukkan problem statement atau query arsitektur berat untuk di-orchestrate..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={currentMission?.status === "running"}
            className="flex-1 bg-[#060a14] border border-slate-700 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={currentMission?.status === "running"}
            className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black font-mono text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
          >
            {currentMission?.status === "running" ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>Orchestrating...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Mission</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* Main Studio Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Live Agent Consensus Feed (2 Cols Wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="font-mono font-black text-white text-base">AUTONOMOUS AGENT REASONING DAG</h2>
            </div>

            {currentMission && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">Tokens Burned: <strong className="text-cyan-400">{formatNumber(currentMission.totalTokensBurned)}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">Rounds: <strong className="text-amber-400">{currentMission.roundsCompleted}/{currentMission.maxRounds}</strong></span>
              </div>
            )}
          </div>

          {/* Steps Timeline Feed */}
          {currentMission ? (
            <div className="space-y-4">
              {currentMission.steps.map((step, idx) => {
                const persona = AGENT_PERSONAS[step.role];
                return (
                  <div
                    key={step.id}
                    className="bg-[#080d1a] border border-slate-800 rounded-2xl p-5 space-y-3 transition-all hover:border-slate-700 shadow-md font-mono"
                  >
                    {/* Step Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${persona.avatarColor} flex items-center justify-center text-slate-950 font-black shadow-md`}>
                          <span className="text-[10px] text-white font-bold">{step.role.slice(0, 3)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{step.agentName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${persona.badgeBorder} font-bold`}>
                              {persona.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{persona.specialty}</span>
                        </div>
                      </div>

                      <div className="text-right text-[10px] text-slate-400">
                        <div className="text-cyan-400 font-bold">{formatNumber(step.tokensUsed)} tokens</div>
                        <div>{step.latencyMs}ms</div>
                      </div>
                    </div>

                    {/* Thought / Rationale Block */}
                    <div className="bg-[#0d1424] border-l-2 border-cyan-500 p-3 rounded-r-xl text-[11px] text-slate-300">
                      <span className="text-cyan-400 font-bold block mb-1">Chain of Thought:</span>
                      {step.thought}
                    </div>

                    {/* Content Body */}
                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pt-1">
                      {step.content}
                    </div>

                    {/* Optional Generated Code Snippet */}
                    {step.codeSnippet && (
                      <div className="mt-3 bg-[#03060f] border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-2 bg-[#090f1d] border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Generated Specification Code</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(step.codeSnippet!)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCode ? "Tersalin" : "Salin"}</span>
                          </button>
                        </div>
                        <pre className="p-3 text-[11px] text-emerald-400 font-mono overflow-x-auto">
                          <code>{step.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })}

              {currentMission.status === "running" && (
                <div className="bg-[#0b1122] border border-cyan-500/40 rounded-2xl p-6 text-center space-y-3 font-mono animate-pulse">
                  <Sparkles className="w-6 h-6 text-cyan-400 mx-auto animate-spin" />
                  <p className="text-xs text-cyan-300 font-bold">
                    Multi-Agent Mesh sedang memproses ronde penalaran berikutnya...
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Beban komputasi dialokasikan: ~2.400 token/ronde via local streaming engine
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#080d1a] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 font-mono text-xs">
              Belum ada misi aktif. Pilih salah satu preset atau ketik problem di bar atas untuk memulai!
            </div>
          )}
        </div>

        {/* Right Column: Mission History & Arbiter Synthesis (1 Col Wide) */}
        <div className="space-y-6">
          {/* Executive Synthesis Summary */}
          <div className="bg-[#080d1a] border border-purple-500/40 rounded-2xl p-5 space-y-4 neon-glow-purple font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
              <h3 className="font-black text-white text-sm">EXECUTIVE ARBITER SYNTHESIS</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentMission?.finalSynthesis || "Menunggu konsensus lengkap dari seluruh agen untuk menyusun laporan eksekutif..."}
            </p>

            <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>Status Konsensus:</span>
                <strong className={currentMission?.status === "completed" ? "text-emerald-400" : "text-amber-400"}>
                  {currentMission?.status === "completed" ? "100% VERIFIED" : "IN PROGRESS"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Efisiensi Arsitektur:</span>
                <strong className="text-cyan-400">Zero-Hallucination</strong>
              </div>
            </div>
          </div>

          {/* Past Missions History */}
          <div className="bg-[#080d1a] border border-slate-800 rounded-2xl p-5 space-y-4 font-mono">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-xs">HISTORY MISI ORCHESTRATOR</h3>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {missions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => selectMission(m.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                    currentMission?.id === m.id
                      ? "bg-[#111a31] border-cyan-500/50 text-white shadow-sm"
                      : "bg-[#0b101f] border-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <div className="font-bold truncate text-[11px]">{m.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>{m.steps.length} Agen</span>
                    <span className="text-cyan-400 font-bold">{formatNumber(m.totalTokensBurned)} tok</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
