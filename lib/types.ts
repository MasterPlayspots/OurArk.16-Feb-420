// ============================================================
// OurArk Type System
// ============================================================

export type AppView =
  | "chat"
  | "dashboard"
  | "automations"
  | "connectors"
  | "documents"
  | "budgets"
  | "prompts"
  | "metatron"
  | "eventlog"
  | "workspace"
  | "telegram"
  | "settings"
  | "agent-builder"

export interface Tab {
  id: string
  type: "browser" | "chat"
  title: string
  url: string
  active: boolean
  shared?: boolean
}

export interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: string
  model: string
  unread?: boolean
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  model?: string
  tokens?: { input: number; output: number }
  cost?: number
  agentId?: string
  routingReason?: string
}

export interface TeamMember {
  id: string
  name: string
  role: "Admin" | "Editor" | "Viewer"
  status: "online" | "away" | "offline"
  avatar?: string
}

export interface Automation {
  id: string
  name: string
  trigger: "Cron" | "Condition" | "Webhook" | "Event" | "Manual"
  status: "Active" | "Paused" | "Error"
  lastRun: string
  runs: number
}

export interface Connector {
  id: string
  name: string
  type: string
  status: "Active" | "Warning" | "Expired" | "Inactive"
  health: number
  lastSync: string
}

export interface Document {
  id: string
  name: string
  collection: string
  status: "Ready" | "Processing" | "Error"
  size: string
  updated: string
}

export interface EventLog {
  id: string
  timestamp: string
  category: string
  severity: "DEBUG" | "INFO" | "WARN" | "ERROR" | "CRITICAL"
  message: string
  source: string
}

export interface KPI {
  label: string
  value: string
  trend: number
  trendLabel: string
  icon: string
  color: string
}

// ============================================================
// LLM Router Types
// ============================================================

export type TaskComplexity = "trivial" | "simple" | "moderate" | "complex" | "expert"

export interface LLMModel {
  id: string
  openRouterId: string
  name: string
  provider: string
  costPer1kInput: number
  costPer1kOutput: number
  maxTokens: number
  strengths: string[]
  speed: "fast" | "medium" | "slow"
  quality: "basic" | "good" | "excellent" | "frontier"
}

export interface RoutingDecision {
  model: LLMModel
  reason: string
  estimatedCost: number
  confidence: number
}

// ============================================================
// Agent System Types
// ============================================================

export type AgentStatus = "online" | "busy" | "offline" | "learning" | "error"

export interface AgentCapability {
  id: string
  name: string
  description: string
}

export interface Agent {
  id: string
  name: string
  status: AgentStatus
  model: string
  preferredModel?: string
  tasks: number
  description: string
  systemPrompt: string
  capabilities: string[]
  isBuiltIn: boolean
  ismaster?: boolean
  maxConcurrentTasks: number
  totalTokensUsed: number
  totalCost: number
  lastActive?: string
  createdAt: string
}

export interface AgentTask {
  id: string
  agentId: string
  description: string
  status: "queued" | "running" | "done" | "error"
  input: string
  output?: string
  model?: string
  tokens?: { input: number; output: number }
  cost?: number
  startedAt?: string
  completedAt?: string
  subtasks?: AgentTask[]
}

export interface AgentExecutionRequest {
  agentId: string
  input: string
  conversationHistory?: { role: string; content: string }[]
  preferredModel?: string
}

export interface AgentExecutionResult {
  taskId: string
  agentId: string
  output: string
  model: string
  tokens: { input: number; output: number }
  cost: number
  duration: number
  subtasks?: AgentTask[]
}

// ============================================================
// Agent Builder Types
// ============================================================

export interface AgentTemplate {
  id: string
  name: string
  description: string
  icon: string
  systemPrompt: string
  capabilities: string[]
  suggestedModel: string
}
