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
}

export interface Agent {
  id: string
  name: string
  status: "online" | "busy" | "offline" | "learning"
  model: string
  tasks: number
  description: string
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
