"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Cpu, Zap, Activity, Flame, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useNeuroForge, AGENT_PERSONAS } from "@/context/NeuroForgeContext";
import { formatNumber } from "@/lib/utils";

export function TokenAnalytics() {
  const { currentMission, totalLifetimeTokens } = useNeuroForge();

  // Synthetic distribution of tokens per agent
  const agentDistributionData = [
    { name: "Architect", tokens: 28400, fill: "#06b6d4" },
    { name: "Coder", tokens: 36200, fill: "#10b981" },
    { name: "SecOps", tokens: 22100, fill: "#f43f5e" },
    { name: "QA", tokens: 19800, fill: "#f59e0b" },
    { name: "Arbiter", tokens: 35000, fill: "#a855f7" },
  ];

  const throughputTimeline = [
    { round: "R1", tokensSec: 142, latency: 280 },
    { round: "R2", tokensSec: 185, latency: 240 },
    { round: "R3", tokensSec: 164, latency: 310 },
    { round: "R4", tokensSec: 210, latency: 190 },
    { round: "R5", tokensSec: 195, latency: 220 },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#080d1a] border border-cyan-500/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Lifetime Token Burn</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">{formatNumber(totalLifetimeTokens)}</div>
          <div className="text-[10px] text-slate-500 mt-1">Sintesis Komputasi 9Router</div>
        </div>

        <div className="bg-[#080d1a] border border-emerald-500/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Throughput</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">182 tok/s</div>
          <div className="text-[10px] text-slate-500 mt-1">Model combo-111 local</div>
        </div>

        <div className="bg-[#080d1a] border border-purple-500/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Zero-Defect Score</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">100%</div>
          <div className="text-[10px] text-slate-500 mt-1">Multi-Pass Verification</div>
        </div>

        <div className="bg-[#080d1a] border border-amber-500/30 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>ROI Leverage</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">Ultra-High</div>
          <div className="text-[10px] text-slate-500 mt-1">Architectural Consistency</div>
        </div>
      </div>

      {/* 2 Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono">
        
        {/* Token Distribution Chart */}
        <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>ALOKASI TOKEN PER AGENT PERSONA</span>
            </h4>
            <span className="text-[10px] text-slate-400">Total Akumulatif</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1222", borderColor: "#1e293b", fontSize: 11, color: "#fff" }}
                />
                <Bar dataKey="tokens" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Throughput Velocity Chart */}
        <div className="bg-[#080d1a] border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>SPEED VELOCITY (TOKENS/SEC)</span>
            </h4>
            <span className="text-[10px] text-emerald-400">ThinkPad L480 Hardware</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={throughputTimeline}>
                <defs>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="round" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0b1222", borderColor: "#1e293b", fontSize: 11, color: "#fff" }}
                />
                <Area type="monotone" dataKey="tokensSec" stroke="#10b981" strokeWidth={2} fill="url(#speedGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
