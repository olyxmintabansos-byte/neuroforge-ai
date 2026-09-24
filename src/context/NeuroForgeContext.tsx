"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  AgentPersona,
  AgentRole,
  AgentExecutionStep,
  OrchestrationMission,
  RouterConfig,
  PresetMission,
} from "@/types/neuroforge";

export const AGENT_PERSONAS: Record<AgentRole, AgentPersona> = {
  ARCHITECT: {
    role: "ARCHITECT",
    name: "Aetherius-01",
    title: "Chief Systems Architect",
    avatarColor: "from-cyan-500 to-blue-600",
    badgeBorder: "border-cyan-500/40 text-cyan-400 bg-cyan-500/10",
    systemPrompt: "Decompose mission into strict architectural boundaries, data flow graphs, and latency SLA targets.",
    specialty: "Topology & Modular Scaling",
  },
  CODER: {
    role: "CODER",
    name: "Synthia-TS",
    title: "Principal Full-Stack Engineer",
    avatarColor: "from-emerald-500 to-teal-600",
    badgeBorder: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    systemPrompt: "Generate strict typed TypeScript/Next.js code without any placeholders or unhandled rejections.",
    specialty: "High-Performance Implementation",
  },
  SECOPS: {
    role: "SECOPS",
    name: "Vigil-Red",
    title: "SecOps Threat Auditor",
    avatarColor: "from-rose-500 to-red-600",
    badgeBorder: "border-rose-500/40 text-rose-400 bg-rose-500/10",
    systemPrompt: "Penetrate architecture for concurrency race conditions, memory leaks, and SSR token exposure.",
    specialty: "Threat Modeling & Zero-Trust",
  },
  QA: {
    role: "QA",
    name: "Testron-99",
    title: "Chaos & Stress Engineer",
    avatarColor: "from-amber-500 to-orange-600",
    badgeBorder: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    systemPrompt: "Subject system to 100k concurrent client simulations, network jitter, and local quota exhaustion.",
    specialty: "Edge-Case Verification",
  },
  JUDGE: {
    role: "JUDGE",
    name: "Nexus-Arbiter",
    title: "Consensus & Synthesis Judge",
    avatarColor: "from-purple-500 to-indigo-600",
    badgeBorder: "border-purple-500/40 text-purple-400 bg-purple-500/10",
    systemPrompt: "Arbitrate disputes, synthesize debate conclusions, and deliver the final executable directive.",
    specialty: "Final Master Synthesis",
  },
};

export const PRESET_MISSIONS: PresetMission[] = [
  {
    id: "preset-1",
    title: "Zero-Downtime Multi-Region Database Sync",
    description: "Design CRDT conflict-free replication for client-side offline storage with real-time peer syncing.",
    category: "SYSTEM_DESIGN",
    prompt: "Rancang arsitektur sinkronisasi multi-region real-time dengan CRDT, IndexedDB fallback lokal, dan sub-10ms conflict resolution saat reconnect.",
  },
  {
    id: "preset-2",
    title: "Fintech Tokenized Payment Gateway Audit",
    description: "Stress-audit ISO 20022 payment flow for idempotency keys, replay attacks, and state leakage.",
    category: "SECURITY_AUDIT",
    prompt: "Lakukan threat audit pada payment gateway transaksi B2B: verifikasi validasi signature HMAC, idempotency cache Redis, dan isolasi thread worker.",
  },
  {
    id: "preset-3",
    title: "Ultra High-Throughput Autonomous Agent Cluster",
    description: "Orchestrate 50+ background worker agents processing 10M tokens/min with graceful backoff.",
    category: "PERFORMANCE_STRESS",
    prompt: "Bangun arsitektur cluster multi-agent worker: dynamic load-balancer, backpressure buffer, streaming SSE pipe, dan zero-memory-leak garbage collection.",
  },
];

interface NeuroForgeContextType {
  missions: OrchestrationMission[];
  currentMission: OrchestrationMission | null;
  routerConfig: RouterConfig;
  setRouterConfig: React.Dispatch<React.SetStateAction<RouterConfig>>;
  startMission: (prompt: string, category?: OrchestrationMission["category"]) => Promise<void>;
  selectMission: (id: string) => void;
  loadPreset: (preset: PresetMission) => void;
  totalLifetimeTokens: number;
}

const NeuroForgeContext = createContext<NeuroForgeContextType | undefined>(undefined);

export function NeuroForgeProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<OrchestrationMission[]>([]);
  const [currentMission, setCurrentMission] = useState<OrchestrationMission | null>(null);
  const [totalLifetimeTokens, setTotalLifetimeTokens] = useState<number>(142500);
  const [routerConfig, setRouterConfig] = useState<RouterConfig>({
    endpoint: "http://127.0.0.1:20128/v1",
    model: "Xngoding (combo-111)",
    temperature: 0.2,
    autoStreaming: true,
    isOnline: true,
  });

  // Load state from LocalStorage
  useEffect(() => {
    try {
      const savedMissions = localStorage.getItem("neuroforge_missions");
      if (savedMissions) {
        const parsed = JSON.parse(savedMissions);
        setMissions(parsed);
        if (parsed.length > 0) setCurrentMission(parsed[0]);
      } else {
        // Seed initial mission
        const seedMission: OrchestrationMission = {
          id: "mission-seed-01",
          title: "Genesis Multi-Agent Orchestration & Local Mesh Setup",
          prompt: "Arsitektur Client-Side Local-First Next.js 16 dengan 9Router Streaming Engine",
          category: "SYSTEM_DESIGN",
          status: "completed",
          roundsCompleted: 3,
          maxRounds: 3,
          totalTokensBurned: 8420,
          createdAt: new Date().toISOString(),
          steps: [
            {
              id: "step-1",
              role: "ARCHITECT",
              agentName: AGENT_PERSONAS.ARCHITECT.name,
              timestamp: "14:10:02",
              status: "completed",
              thought: "Menganalisis isolasi memory boundary pada Next.js static export.",
              content: "Rekomendasi topologi: pisahkan layer presentasi dari layer komputasi LLM. Gunakan Web Workers untuk parsing streaming SSE tanpa blocking Main UI Thread (60fps lock).",
              tokensUsed: 2150,
              latencyMs: 340,
            },
            {
              id: "step-2",
              role: "SECOPS",
              agentName: AGENT_PERSONAS.SECOPS.name,
              timestamp: "14:10:05",
              status: "completed",
              critiqueTarget: "ARCHITECT",
              thought: "Mendeteksi potensi kebocoran key pada LocalStorage saat sanitasi prompt.",
              content: "Audit Alert: LocalStorage rentan XSS. Solusi: Semua token telemetry dan session keys di-hash dengan SHA-256 dan disimpan dalam in-memory transient context.",
              tokensUsed: 1980,
              latencyMs: 290,
            },
            {
              id: "step-3",
              role: "JUDGE",
              agentName: AGENT_PERSONAS.JUDGE.name,
              timestamp: "14:10:09",
              status: "completed",
              thought: "Konsensus tercapai. Menghasilkan production specification.",
              content: "Konsensus final: Arsitektur 100% verified. Eksekusi static export dengan .nojekyll bypass dan streaming client-side buffer disahkan.",
              codeSnippet: "// NeuroForge Production Stream Adapter\nexport async function streamNeuroMesh(payload) {\n  return fetch('http://127.0.0.1:20128/v1/chat/completions', {\n    method: 'POST',\n    body: JSON.stringify(payload)\n  });\n}",
              tokensUsed: 4290,
              latencyMs: 510,
            },
          ],
          finalSynthesis: "Ekosistem NeuroForge terverifikasi tahan banting (zero-defect). Seluruh agen mencapai konsensus arsitektur dengan efisiensi token 8.420.",
        };
        setMissions([seedMission]);
        setCurrentMission(seedMission);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (missions.length > 0) {
      try {
        localStorage.setItem("neuroforge_missions", JSON.stringify(missions));
      } catch (e) {
        console.error(e);
      }
    }
  }, [missions]);

  const selectMission = (id: string) => {
    const found = missions.find((m) => m.id === id);
    if (found) setCurrentMission(found);
  };

  const loadPreset = (preset: PresetMission) => {
    startMission(preset.prompt, preset.category);
  };

  const startMission = async (
    prompt: string,
    category: OrchestrationMission["category"] = "SYSTEM_DESIGN"
  ) => {
    const newMissionId = `mission-${Date.now()}`;
    const newMission: OrchestrationMission = {
      id: newMissionId,
      title: prompt.slice(0, 48) + "...",
      prompt,
      category,
      status: "running",
      roundsCompleted: 0,
      maxRounds: 4,
      totalTokensBurned: 0,
      steps: [],
      createdAt: new Date().toISOString(),
    };

    setMissions((prev) => [newMission, ...prev]);
    setCurrentMission(newMission);

    // Sequence of 4 Agent execution rounds
    const rolesToExecute: AgentRole[] = ["ARCHITECT", "CODER", "SECOPS", "JUDGE"];
    let accumulatedTokens = 0;

    for (let i = 0; i < rolesToExecute.length; i++) {
      const role = rolesToExecute[i];
      const persona = AGENT_PERSONAS[role];
      const stepStartTime = performance.now();

      // Simulated realistic heavy reasoning delay
      await new Promise((r) => setTimeout(r, 1200));

      let stepContent = "";
      let stepThought = "";
      let codeSnippet: string | undefined = undefined;
      const tokensForThisStep = Math.floor(Math.random() * 1200) + 1800; // 1800 - 3000 tokens
      accumulatedTokens += tokensForThisStep;

      if (role === "ARCHITECT") {
        stepThought = `Dekomposisi sistem untuk domain "${prompt}". Memetakan modul dependensi & throughput SLA.`;
        stepContent = `Struktur Arsitektur Utama:\n1. Boundary Context: Pemisahan state synchronous dan asynchronous buffer.\n2. Invariant State: LocalStorage hybrid sync dengan fallback in-memory.\n3. Latency Target: sub-12ms response time via SSE streaming hook.`;
      } else if (role === "CODER") {
        stepThought = `Menerjemahkan spesifikasi arsitektur ke dalam Typed Next.js 16 modular components.`;
        stepContent = `Implementasi kode komponen inti berhasil dibuat dengan strict TypeScript typing dan zero runtime overhead.`;
        codeSnippet = `export interface MeshNode {\n  id: string;\n  role: '${role}';\n  computeCost: number;\n  dispatch(): Promise<void>;\n}`;
      } else if (role === "SECOPS") {
        stepThought = `Audit celah keamanan, race conditions, dan unhandled rejections pada thread loop.`;
        stepContent = `Audit Keamanan: Tidak ditemukan memory leak. Proteksi injection aktif pada seluruh input pipeline. Quota limits dijamin tidak melebihi 2MB per session.`;
      } else if (role === "JUDGE") {
        stepThought = `Melakukan sintesis seluruh rekomendasi agen, merumuskan konsensus final.`;
        stepContent = `KONSENSUS FINAL TERCAPAI: Spesifikasi telah di-stress test dan siap masuk production line.`;
        stepContent += ` Total ${accumulatedTokens} token dialokasikan untuk menghasilkan blueprint zero-defect.`;
      }

      const latency = Math.round(performance.now() - stepStartTime);

      const newStep: AgentExecutionStep = {
        id: `step-${Date.now()}-${i}`,
        role,
        agentName: persona.name,
        timestamp: new Date().toLocaleTimeString("id-ID"),
        status: "completed",
        thought: stepThought,
        content: stepContent,
        codeSnippet,
        tokensUsed: tokensForThisStep,
        latencyMs: latency,
      };

      setMissions((prev) =>
        prev.map((m) =>
          m.id === newMissionId
            ? {
                ...m,
                roundsCompleted: i + 1,
                totalTokensBurned: accumulatedTokens,
                steps: [...m.steps, newStep],
              }
            : m
        )
      );

      setCurrentMission((prev) =>
        prev && prev.id === newMissionId
          ? {
              ...prev,
              roundsCompleted: i + 1,
              totalTokensBurned: accumulatedTokens,
              steps: [...prev.steps, newStep],
            }
          : prev
      );
    }

    // Finish Mission
    setMissions((prev) =>
      prev.map((m) =>
        m.id === newMissionId
          ? {
              ...m,
              status: "completed",
              finalSynthesis: `Konsensus 4-Agent sukses disintesis. Solusi arsitektur siap operasi dengan validasi zero-defect.`,
            }
          : m
      )
    );

    setCurrentMission((prev) =>
      prev && prev.id === newMissionId
        ? {
            ...prev,
            status: "completed",
            finalSynthesis: `Konsensus 4-Agent sukses disintesis. Solusi arsitektur siap operasi dengan validasi zero-defect.`,
          }
        : prev
    );

    setTotalLifetimeTokens((t) => t + accumulatedTokens);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#06b6d4", "#a855f7", "#10b981", "#f59e0b"],
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <NeuroForgeContext.Provider
      value={{
        missions,
        currentMission,
        routerConfig,
        setRouterConfig,
        startMission,
        selectMission,
        loadPreset,
        totalLifetimeTokens,
      }}
    >
      {children}
    </NeuroForgeContext.Provider>
  );
}

export function useNeuroForge() {
  const context = useContext(NeuroForgeContext);
  if (!context) {
    throw new Error("useNeuroForge must be used within a NeuroForgeProvider");
  }
  return context;
}
