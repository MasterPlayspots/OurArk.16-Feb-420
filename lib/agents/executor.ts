// ============================================================
// Agent Executor - Runs agent tasks against LLM APIs
// ============================================================

import type { Agent, AgentTask, AgentExecutionResult } from "../types"
import { routeToModel, AVAILABLE_MODELS } from "../llm-router"

interface ExecuteOptions {
  agent: Agent
  input: string
  conversationHistory?: { role: string; content: string }[]
  preferredModel?: string
}

export async function executeAgentTask(options: ExecuteOptions): Promise<AgentExecutionResult> {
  const { agent, input, conversationHistory = [], preferredModel } = options
  const startTime = Date.now()

  // Smart model routing: use agent's preferred model or auto-route
  const modelToUse = preferredModel ?? agent.preferredModel ?? "auto"
  const routing = routeToModel(
    input,
    conversationHistory.length,
    modelToUse === "auto" ? undefined : modelToUse
  )

  // Build messages array with system prompt + conversation history + new input
  const messages: { role: string; content: string }[] = [
    { role: "system", content: agent.systemPrompt },
    ...conversationHistory.slice(-20), // Last 20 messages for context
    { role: "user", content: input },
  ]

  // Call the internal API
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages,
      model: routing.model.id,
      agentId: agent.id,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }))
    throw new Error(err.error ?? `Agent execution failed: HTTP ${response.status}`)
  }

  const data = await response.json()
  const duration = Date.now() - startTime

  return {
    taskId: `task-${Date.now()}`,
    agentId: agent.id,
    output: data.content,
    model: data.model ?? routing.model.name,
    tokens: data.usage ?? { input: 0, output: 0 },
    cost: data.cost ?? routing.estimatedCost,
    duration,
  }
}

// Master Agent: analyzes input and decides which agent should handle it
export function classifyTaskForAgent(
  input: string,
  agents: Agent[]
): { agentId: string; reason: string } {
  const lower = input.toLowerCase()

  // Keyword-based classification
  const rules: { keywords: RegExp[]; capabilities: string[] }[] = [
    {
      keywords: [/code|programmier|implement|debug|refactor|typescript|react|api|function|class|bug/i],
      capabilities: ["coding", "code-review", "debugging"],
    },
    {
      keywords: [/text|schreib|artikel|blog|content|marketing|seo|post|email|newsletter/i],
      capabilities: ["content-creation", "copywriting", "social-media"],
    },
    {
      keywords: [/analys|daten|report|zusammenfass|recherch|statistik|vergleich/i],
      capabilities: ["research", "data-analysis", "reporting"],
    },
    {
      keywords: [/support|kunde|faq|antwort|beschwerde|hilfe|problem/i],
      capabilities: ["customer-support", "communication"],
    },
    {
      keywords: [/strateg|plan|business|markt|entscheid|budget|roi|okr/i],
      capabilities: ["strategy", "planning", "consulting"],
    },
    {
      keywords: [/uebersetz|translat|sprach|englisch|deutsch/i],
      capabilities: ["translation"],
    },
  ]

  for (const rule of rules) {
    if (rule.keywords.some((re) => re.test(lower))) {
      const matched = agents.find(
        (a) => !a.ismaster && a.status !== "offline" &&
          a.capabilities.some((c) => rule.capabilities.includes(c))
      )
      if (matched) {
        return {
          agentId: matched.id,
          reason: `Aufgabe passt zu ${matched.name} (${matched.description})`,
        }
      }
    }
  }

  // Default: use the first non-master online agent, or master itself
  const fallback = agents.find((a) => !a.ismaster && a.status !== "offline") ?? agents[0]
  return {
    agentId: fallback.id,
    reason: `Allgemeine Anfrage → ${fallback.name}`,
  }
}
