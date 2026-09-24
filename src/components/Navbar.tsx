"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Zap,
  Activity,
  Server,
  Layers,
  Sparkles,
  Settings2,
  CheckCircle2,
  ExternalLink,
  Flame,
} from "lucide-react";
import { useNeuroForge } from "@/context/NeuroForgeContext";
import { formatNumber } from "@/lib/utils";

export function Navbar() {
  const { totalLifetimeTokens, routerConfig, setRouterConfig } = useNeuroForge();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-[#060a14]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between font-mono text-xs">
        
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-wider">NEUROFORGE AI</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                ORCHESTRATOR
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Autonomous Multi-Agent LLM Mesh Studio</p>
          </div>
        </div>

        {/* Center Live Telemetry */}
        <div className="hidden lg:flex items-center gap-6 text-[11px]">
          <div className="flex items-center gap-2 bg-[#0c1222] border border-slate-800 px-3 py-1.5 rounded-xl">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Lifetime Tokens Burned:</span>
            <strong className="text-cyan-400 font-bold">{formatNumber(totalLifetimeTokens)}</strong>
          </div>

          <div className="flex items-center gap-2 bg-[#0c1222] border border-slate-800 px-3 py-1.5 rounded-xl">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Endpoint:</span>
            <span className="text-emerald-400 font-bold">{routerConfig.endpoint}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="p-2 rounded-xl bg-[#0c1222] border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            title="9Router Engine Config"
          >
            <Settings2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">9Router Config</span>
          </button>

          <a
            href="https://olyxmintabansos-byte.github.io/olyx-portfolio/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <span>Hub Utama</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 9Router Config Drawer Modal */}
      {isConfigOpen && (
        <div className="border-t border-slate-800 bg-[#090f1e] px-6 py-4 animate-in slide-in-from-top-2 duration-150 font-mono text-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <h4 className="font-bold text-white">Local 9Router Engine Bridge</h4>
                <p className="text-[11px] text-slate-400">Targeting OpenAI-compatible local LLM server on ThinkPad L480</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-[#040711] border border-slate-700 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400">Host:</span>
                <input
                  type="text"
                  value={routerConfig.endpoint}
                  onChange={(e) => setRouterConfig({ ...routerConfig, endpoint: e.target.value })}
                  className="bg-transparent text-white focus:outline-none w-48 text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 bg-[#040711] border border-slate-700 px-3 py-1.5 rounded-xl">
                <span className="text-slate-400">Model:</span>
                <input
                  type="text"
                  value={routerConfig.model}
                  onChange={(e) => setRouterConfig({ ...routerConfig, model: e.target.value })}
                  className="bg-transparent text-cyan-300 focus:outline-none w-40 text-[11px]"
                />
              </div>

              <button
                onClick={() => setIsConfigOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all cursor-pointer"
              >
                Simpan & Kunci
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
