"use client";

import React from "react";
import {
  Swords,
  Flame,
  ShieldAlert,
  Gavel,
  Trophy,
  Sparkles,
  Play,
  Layers,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { useNeuroForge, DEBATE_TOPICS, AGENT_PERSONAS } from "@/context/NeuroForgeContext";
import { formatNumber } from "@/lib/utils";
import { DebateTopic } from "@/types/neuroforge";

export function DebateArena() {
  const { currentDebate, debateSessions, startDebate, selectDebate } = useNeuroForge();

  return (
    <div className="space-y-8 font-sans">
      {/* Header Topic Picker */}
      <div className="bg-[#080d1a] border border-purple-500/30 rounded-3xl p-6 sm:p-8 neon-glow-purple space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-bold uppercase mb-2">
              <Swords className="w-3.5 h-3.5" />
              <span>Multi-Agent Adversarial Debate Arena</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Adversarial Engineering Battleground
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Adu argumen antar-agen otonom untuk membedah dilema arsitektur ekstrem sampai konsensus inkumben tercapai.
            </p>
          </div>

          {currentDebate && (
            <div className="bg-[#0f172a] border border-slate-800 p-3 rounded-2xl font-mono text-xs text-right shrink-0">
              <span className="text-slate-400 block text-[10px]">Debate Token Burn:</span>
              <strong className="text-purple-400 text-sm">{formatNumber(currentDebate.totalTokens)} tok</strong>
            </div>
          )}
        </div>

        {/* Debate Topic Selector */}
        <div>
          <span className="text-xs font-mono text-slate-400 font-bold block mb-2">Pilih Topik Perdebatan:</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DEBATE_TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="bg-[#0d1424] border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl flex flex-col justify-between space-y-3 transition-all group"
              >
                <div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block">
                    {topic.category}
                  </span>
                  <h4 className="font-bold text-white text-xs mt-1 group-hover:text-purple-300 transition-colors">
                    {topic.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {topic.proposition}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-slate-400">{topic.proAgent} vs {topic.contraAgent}</span>
                  <button
                    onClick={() => startDebate(topic)}
                    disabled={currentDebate?.status === "debating"}
                    className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Mulai Debat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Debate Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Turns Feed (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>LIVE ARGUMENTATION TURNS</span>
            </h3>
            {currentDebate && (
              <span className="text-xs text-slate-400">
                Status: <strong className={currentDebate.status === "concluded" ? "text-emerald-400" : "text-amber-400"}>
                  {currentDebate.status.toUpperCase()}
                </strong>
              </span>
            )}
          </div>

          {currentDebate ? (
            <div className="space-y-4">
              {currentDebate.turns.map((turn) => {
                const persona = AGENT_PERSONAS[turn.agentRole];
                return (
                  <div
                    key={turn.id}
                    className={`bg-[#080d1a] border rounded-2xl p-5 space-y-3 font-mono transition-all ${
                      turn.stance === "VERDICT"
                        ? "border-purple-500/60 shadow-lg shadow-purple-950/20"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${persona.avatarColor} flex items-center justify-center text-slate-950 font-black shadow-md`}>
                          <span className="text-[10px] text-white font-bold">{turn.agentRole.slice(0, 3)}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-white">{turn.agentName}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              turn.stance === "PRO"
                                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                                : turn.stance === "CONTRA"
                                ? "bg-rose-500/10 border-rose-500/40 text-rose-400"
                                : "bg-purple-500/10 border-purple-500/40 text-purple-400"
                            } font-bold`}>
                              {turn.stance}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{turn.thesisTitle}</span>
                        </div>
                      </div>

                      <div className="text-right text-[10px]">
                        <span className="text-cyan-400 font-bold block">{formatNumber(turn.tokensBurned)} tok</span>
                        <span className="text-amber-400 font-bold">Skor: {turn.argumentScore}/100</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed pt-1">
                      {turn.argument}
                    </p>

                    {turn.attackVectorOrProof && (
                      <div className="p-2.5 bg-rose-950/20 border border-rose-500/30 rounded-xl text-[11px] text-rose-300">
                        <strong className="block text-[10px] uppercase text-rose-400">Attack Vector Alert:</strong>
                        {turn.attackVectorOrProof}
                      </div>
                    )}
                  </div>
                );
              })}

              {currentDebate.status === "debating" && (
                <div className="bg-[#0b1122] border border-purple-500/40 rounded-2xl p-6 text-center space-y-3 font-mono animate-pulse">
                  <Sparkles className="w-6 h-6 text-purple-400 mx-auto animate-spin" />
                  <p className="text-xs text-purple-300 font-bold">
                    Agen sedang memformulasikan sanggahan dialektika berikutnya...
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Alokasi komputasi ~3.000 token per putaran debat
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#080d1a] border border-slate-800 rounded-2xl p-12 text-center text-slate-500 font-mono text-xs">
              Belum ada sesi debat aktif. Klik tombol "Mulai Debat" pada salah satu topik di atas!
            </div>
          )}
        </div>

        {/* Ruling Card & Past Debates (1 Col) */}
        <div className="space-y-6 font-mono text-xs">
          {/* Ruling Card */}
          <div className="bg-[#080d1a] border border-purple-500/40 rounded-2xl p-5 space-y-4 neon-glow-purple">
            <div className="flex items-center gap-2">
              <Gavel className="w-5 h-5 text-purple-400" />
              <h4 className="font-black text-white text-sm">PUTUSAN INKUMBEN ARBITER</h4>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs">
              {currentDebate?.rulingSummary || "Menunggu jalannya persidangan debat antar agen..."}
            </p>

            {currentDebate?.winner && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Pemenang Konsensus:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-bold flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {currentDebate.winner}
                </span>
              </div>
            )}
          </div>

          {/* Past Debates */}
          <div className="bg-[#080d1a] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">
              HISTORY SESI DEBAT
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {debateSessions.map((d) => (
                <button
                  key={d.id}
                  onClick={() => selectDebate(d.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    currentDebate?.id === d.id
                      ? "bg-[#131a31] border-purple-500/50 text-white"
                      : "bg-[#0b101f] border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">{d.topicTitle}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                    <span>{d.turns.length} Ronde</span>
                    <span className="text-purple-400 font-bold">{formatNumber(d.totalTokens)} tok</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
