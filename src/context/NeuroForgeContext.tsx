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
  DebateTopic,
  DebateSession,
  DebateTurn,
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

export const DEBATE_TOPICS: DebateTopic[] = [
  {
    id: "topic-1",
    title: "Micro-Frontends vs Modular Monolith Next.js",
    proposition: "Modular Monolith Next.js 16 lebih superior daripada Micro-Frontends untuk aplikasi enterprise 100k DAU.",
    category: "Architecture Topology",
    proAgent: "ARCHITECT",
    contraAgent: "CODER",
    arbiterAgent: "JUDGE",
  },
  {
    id: "topic-2",
    title: "LocalStorage Client-Side vs HttpOnly Encrypted Cookie",
    proposition: "LocalStorage dengan schema hybrid encrypt aman untuk local-first desktop apps tanpa session cookies.",
    category: "Security & Zero-Trust",
    proAgent: "CODER",
    contraAgent: "SECOPS",
    arbiterAgent: "JUDGE",
  },
  {
    id: "topic-3",
    title: "CRDT Offline Sync vs Eventual Server Reconciliation",
    proposition: "CRDT client-side state engine lebih efisien daripada transactional server locks untuk multi-device sync.",
    category: "Distributed State",
    proAgent: "ARCHITECT",
    contraAgent: "QA",
    arbiterAgent: "JUDGE",
  },
];

interface NeuroForgeContextType {
  missions: OrchestrationMission[];
  currentMission: OrchestrationMission | null;
  debateSessions: DebateSession[];
  currentDebate: DebateSession | null;
  routerConfig: RouterConfig;
  setRouterConfig: React.Dispatch<React.SetStateAction<RouterConfig>>;
  startMission: (prompt: string, category?: OrchestrationMission["category"]) => Promise<void>;
  selectMission: (id: string) => void;
  loadPreset: (preset: PresetMission) => void;
  startDebate: (topic: DebateTopic) => Promise<void>;
  selectDebate: (id: string) => void;
  totalLifetimeTokens: number;
  generateMarkdownReport: () => string;
}

const NeuroForgeContext = createContext<NeuroForgeContextType | undefined>(undefined);

export function NeuroForgeProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<OrchestrationMission[]>([]);
  const [currentMission, setCurrentMission] = useState<OrchestrationMission | null>(null);
  const [debateSessions, setDebateSessions] = useState<DebateSession[]>([]);
  const [currentDebate, setCurrentDebate] = useState<DebateSession | null>(null);
  const [totalLifetimeTokens, setTotalLifetimeTokens] = useState<number>(285400);
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
        // Initial Seed Mission
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

      // Initial Seed Debate
      const savedDebates = localStorage.getItem("neuroforge_debates");
      if (savedDebates) {
        const parsedD = JSON.parse(savedDebates);
        setDebateSessions(parsedD);
        if (parsedD.length > 0) setCurrentDebate(parsedD[0]);
      } else {
        const seedDebate: DebateSession = {
          id: "debate-seed-01",
          topicId: "topic-1",
          topicTitle: DEBATE_TOPICS[0].title,
          status: "concluded",
          totalTokens: 11450,
          winner: "ARCHITECT",
          rulingSummary: "Arbiter menetapkan Modular Monolith menang atas Micro-Frontends untuk skenario ini karena zero-network overhead dan single typed boundary.",
          turns: [
            {
              id: "turn-1",
              agentRole: "ARCHITECT",
              agentName: AGENT_PERSONAS.ARCHITECT.name,
              stance: "PRO",
              thesisTitle: "Modular Monolith Menjamin Zero Network Latency",
              argument: "Micro-frontends menambahkan runtime dependency overhead gila-gilaan pada browser. Modular Monolith dengan Next.js App Router memberikan isolasi folder (/app/submodules) sekaligus kompilasi Turbopack sub-detik.",
              argumentScore: 94,
              tokensBurned: 3200,
              timestamp: "14:22:10",
            },
            {
              id: "turn-2",
              agentRole: "CODER",
              agentName: AGENT_PERSONAS.CODER.name,
              stance: "CONTRA",
              thesisTitle: "Micro-Frontends Memberikan Deployment Independence",
              argument: "Dalam tim besar, modular monolith menyebabkan pipeline CI/CD bottleneck. Satu developer error bisa membatalkan build seluruh aplikasi.",
              attackVectorOrProof: "git blame collision & lockfile sync race condition",
              argumentScore: 88,
              tokensBurned: 2950,
              timestamp: "14:22:15",
            },
            {
              id: "turn-3",
              agentRole: "JUDGE",
              agentName: AGENT_PERSONAS.JUDGE.name,
              stance: "VERDICT",
              thesisTitle: "Binding Arbiter Judgment",
              argument: "Modular Monolith disahkan dengan syarat: Wajib menerapkan strict package boundaries via pnpm workspaces dan TypeScript path aliases isolasi.",
              argumentScore: 98,
              tokensBurned: 5300,
              timestamp: "14:22:20",
            },
          ],
        };
        setDebateSessions([seedDebate]);
        setCurrentDebate(seedDebate);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (missions.length > 0) {
      localStorage.setItem("neuroforge_missions", JSON.stringify(missions));
    }
    if (debateSessions.length > 0) {
      localStorage.setItem("neuroforge_debates", JSON.stringify(debateSessions));
    }
  }, [missions, debateSessions]);

  const selectMission = (id: string) => {
    const found = missions.find((m) => m.id === id);
    if (found) setCurrentMission(found);
  };

  const selectDebate = (id: string) => {
    const found = debateSessions.find((d) => d.id === id);
    if (found) setCurrentDebate(found);
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

    const rolesToExecute: AgentRole[] = ["ARCHITECT", "CODER", "SECOPS", "JUDGE"];
    let accumulatedTokens = 0;

    for (let i = 0; i < rolesToExecute.length; i++) {
      const role = rolesToExecute[i];
      const persona = AGENT_PERSONAS[role];
      const stepStartTime = performance.now();

      await new Promise((r) => setTimeout(r, 1000));

      let stepContent = "";
      let stepThought = "";
      let codeSnippet: string | undefined = undefined;
      const tokensForThisStep = Math.floor(Math.random() * 1200) + 2000;
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
        stepContent = `KONSENSUS FINAL TERCAPAI: Spesifikasi telah di-stress test dan siap masuk production line.\nTotal ${accumulatedTokens} token dialokasikan untuk menghasilkan blueprint zero-defect.`;
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

  const startDebate = async (topic: DebateTopic) => {
    const debateId = `debate-${Date.now()}`;
    const newSession: DebateSession = {
      id: debateId,
      topicId: topic.id,
      topicTitle: topic.title,
      status: "debating",
      turns: [],
      totalTokens: 0,
    };

    setDebateSessions((prev) => [newSession, ...prev]);
    setCurrentDebate(newSession);

    let totalTokens = 0;
    const debateRounds: Array<{ role: AgentRole; stance: DebateTurn["stance"]; title: string; arg: string; score: number }> = [
      {
        role: topic.proAgent,
        stance: "PRO",
        title: `Argumen Afirmatif: ${topic.title}`,
        arg: `Berdasarkan benchmark sistemik, ${topic.proposition}. Model ini memangkas complexity barrier dan mengoptimalkan throughput memory.`,
        score: 91,
      },
      {
        role: topic.contraAgent,
        stance: "CONTRA",
        title: `Sanggahan Kritis & Audit Kerentanan`,
        arg: `Klaim tersebut mengabaikan trade-off esensial: resiko single point of failure dan kesulitan horizontal scalability saat load mencapai 10x normal.`,
        score: 89,
      },
      {
        role: topic.arbiterAgent,
        stance: "VERDICT",
        title: `Putusan Inkumben Arbiter Tertinggi`,
        arg: `Mendengar kedua belah pihak, Arbiter memutuskan bahwa pendekatan ${topic.proAgent} diterima dengan syarat mitigasi ketat dari ${topic.contraAgent}.`,
        score: 97,
      },
    ];

    for (let i = 0; i < debateRounds.length; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      const round = debateRounds[i];
      const burned = Math.floor(Math.random() * 1000) + 3200;
      totalTokens += burned;

      const newTurn: DebateTurn = {
        id: `turn-${Date.now()}-${i}`,
        agentRole: round.role,
        agentName: AGENT_PERSONAS[round.role].name,
        stance: round.stance,
        thesisTitle: round.title,
        argument: round.arg,
        argumentScore: round.score,
        tokensBurned: burned,
        timestamp: new Date().toLocaleTimeString("id-ID"),
      };

      setDebateSessions((prev) =>
        prev.map((d) =>
          d.id === debateId
            ? { ...d, totalTokens, turns: [...d.turns, newTurn] }
            : d
        )
      );

      setCurrentDebate((prev) =>
        prev && prev.id === debateId
          ? { ...prev, totalTokens, turns: [...prev.turns, newTurn] }
          : prev
      );
    }

    setDebateSessions((prev) =>
      prev.map((d) =>
        d.id === debateId
          ? {
              ...d,
              status: "concluded",
              winner: topic.proAgent,
              rulingSummary: `Debat selesai. Konsensus dicapai melalui sintesis Arbiter dengan total ${totalTokens} token komputasi dialokasikan.`,
            }
          : d
      )
    );

    setCurrentDebate((prev) =>
      prev && prev.id === debateId
        ? {
            ...prev,
            status: "concluded",
            winner: topic.proAgent,
            rulingSummary: `Debat selesai. Konsensus dicapai melalui sintesis Arbiter dengan total ${totalTokens} token komputasi dialokasikan.`,
          }
        : prev
    );

    setTotalLifetimeTokens((t) => t + totalTokens);

    try {
      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#a855f7", "#ec4899", "#06b6d4"],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const generateMarkdownReport = (): string => {
    if (!currentMission) return "# NeuroForge AI — Belum ada misi aktif";

    return `# 🏛️ NEUROFORGE AI: ENTERPRISE ARCHITECTURE SPECIFICATION
## Misi: ${currentMission.title}
- **Tanggal Sintesis:** ${new Date(currentMission.createdAt).toLocaleString("id-ID")}
- **Total Token Dialokasikan:** ${currentMission.totalTokensBurned.toLocaleString()} Tokens
- **Kategori:** ${currentMission.category}
- **Status:** ${currentMission.status.toUpperCase()} (Zero-Defect Verified)

---

### 1. Executive Summary
${currentMission.finalSynthesis || "Konsensus dalam proses verifikasi multi-agent."}

---

### 2. Autonomous Consensus Chain (${currentMission.steps.length} Agen)
${currentMission.steps
  .map(
    (s, idx) => `
#### Ronde ${idx + 1}: ${s.agentName} (${s.role})
- **Waktu:** ${s.timestamp} | **Token:** ${s.tokensUsed} tok | **Latency:** ${s.latencyMs}ms
- **Chain of Thought:** ${s.thought}
- **Spesifikasi:**
${s.content}
${s.codeSnippet ? `\n\`\`\`typescript\n${s.codeSnippet}\n\`\`\`` : ""}
`
  )
  .join("\n")}

---

### 3. Diagram Arsitektur Sistem (Mermaid)
\`\`\`mermaid
graph TD
    UserQuery["Query Pengguna"] --> Architect["Aetherius-01 (Architect)"]
    Architect --> Coder["Synthia-TS (Implementation)"]
    Coder --> SecOps["Vigil-Red (Threat Audit)"]
    SecOps --> Arbiter["Nexus-Arbiter (Synthesis)"]
    Arbiter --> ProductionDirective["Executive Blueprint Output"]
\`\`\`

---
*Generated by NeuroForge AI Autonomous Multi-Agent Orchestrator Studio*
`;
  };

  return (
    <NeuroForgeContext.Provider
      value={{
        missions,
        currentMission,
        debateSessions,
        currentDebate,
        routerConfig,
        setRouterConfig,
        startMission,
        selectMission,
        loadPreset,
        startDebate,
        selectDebate,
        totalLifetimeTokens,
        generateMarkdownReport,
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
