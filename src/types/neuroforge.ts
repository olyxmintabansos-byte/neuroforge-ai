export type AgentRole = "ARCHITECT" | "CODER" | "SECOPS" | "QA" | "JUDGE";

export interface AgentPersona {
  role: AgentRole;
  name: string;
  title: string;
  avatarColor: string;
  badgeBorder: string;
  systemPrompt: string;
  specialty: string;
}

export interface AgentExecutionStep {
  id: string;
  role: AgentRole;
  agentName: string;
  timestamp: string;
  status: "pending" | "running" | "completed" | "flagged";
  thought: string;
  content: string;
  codeSnippet?: string;
  critiqueTarget?: AgentRole;
  tokensUsed: number;
  latencyMs: number;
}

export interface OrchestrationMission {
  id: string;
  title: string;
  prompt: string;
  category: "SYSTEM_DESIGN" | "SECURITY_AUDIT" | "PERFORMANCE_STRESS" | "FULLSTACK_SYNTHESIS";
  status: "idle" | "running" | "completed" | "error";
  roundsCompleted: number;
  maxRounds: number;
  totalTokensBurned: number;
  steps: AgentExecutionStep[];
  finalSynthesis?: string;
  createdAt: string;
}

export interface DebateTurn {
  id: string;
  agentRole: AgentRole;
  agentName: string;
  stance: "PRO" | "CONTRA" | "CRITIQUE" | "VERDICT";
  thesisTitle: string;
  argument: string;
  attackVectorOrProof?: string;
  argumentScore: number;
  tokensBurned: number;
  timestamp: string;
}

export interface DebateTopic {
  id: string;
  title: string;
  proposition: string;
  category: string;
  proAgent: AgentRole;
  contraAgent: AgentRole;
  arbiterAgent: AgentRole;
}

export interface DebateSession {
  id: string;
  topicId: string;
  topicTitle: string;
  status: "idle" | "debating" | "concluded";
  turns: DebateTurn[];
  winner?: AgentRole;
  rulingSummary?: string;
  totalTokens: number;
}

export interface RouterConfig {
  endpoint: string;
  model: string;
  temperature: number;
  autoStreaming: boolean;
  isOnline: boolean;
}

export interface PresetMission {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: OrchestrationMission["category"];
}
