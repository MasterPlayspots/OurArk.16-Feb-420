// ============================================================
// Smart LLM Router - Cost-efficient model selection
// ============================================================
// Analyzes task complexity and routes to the cheapest model
// that can handle the job well. Saves 40-70% on API costs.

import type { LLMModel, TaskComplexity, RoutingDecision } from "./types"

// Available models with pricing (per 1k tokens, USD)
export const AVAILABLE_MODELS: LLMModel[] = [
  {
    id: "gpt-4o-mini",
    openRouterId: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    costPer1kInput: 0.00015,
    costPer1kOutput: 0.0006,
    maxTokens: 128000,
    strengths: ["schnell", "guenstig", "einfache-aufgaben", "uebersetzung", "zusammenfassung"],
    speed: "fast",
    quality: "good",
  },
  {
    id: "claude-3.5-haiku",
    openRouterId: "anthropic/claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    costPer1kInput: 0.0008,
    costPer1kOutput: 0.004,
    maxTokens: 200000,
    strengths: ["schnell", "code", "analyse", "instruktionen"],
    speed: "fast",
    quality: "good",
  },
  {
    id: "gpt-4o",
    openRouterId: "openai/gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
    maxTokens: 128000,
    strengths: ["allrounder", "kreativ", "reasoning", "code", "multimodal"],
    speed: "medium",
    quality: "excellent",
  },
  {
    id: "claude-3.5-sonnet",
    openRouterId: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    maxTokens: 200000,
    strengths: ["code", "analyse", "langer-kontext", "instruktionen", "reasoning"],
    speed: "medium",
    quality: "excellent",
  },
  {
    id: "claude-sonnet-4",
    openRouterId: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    maxTokens: 200000,
    strengths: ["code", "reasoning", "planung", "architektur", "komplexe-aufgaben"],
    speed: "medium",
    quality: "frontier",
  },
  {
    id: "mistral-large",
    openRouterId: "mistralai/mistral-large-latest",
    name: "Mistral Large",
    provider: "Mistral",
    costPer1kInput: 0.002,
    costPer1kOutput: 0.006,
    maxTokens: 128000,
    strengths: ["mehrsprachig", "code", "reasoning", "europa"],
    speed: "medium",
    quality: "excellent",
  },
]

// Keyword patterns that indicate task complexity
const COMPLEXITY_SIGNALS: Record<TaskComplexity, RegExp[]> = {
  trivial: [
    /^(hi|hallo|hey|danke|ok|ja|nein)\b/i,
    /^was ist .{3,20}\??$/i,
    /^(uebersetze|translate)/i,
  ],
  simple: [
    /zusammenfass/i,
    /erklaer/i,
    /schreib.*kurz/i,
    /liste.*auf/i,
    /was bedeutet/i,
    /formatier/i,
  ],
  moderate: [
    /schreib.*artikel/i,
    /erstell.*email/i,
    /marketing.*text/i,
    /blog.*post/i,
    /analysier/i,
    /vergleich/i,
  ],
  complex: [
    /implementier/i,
    /programmier/i,
    /code.*schreib/i,
    /architektur/i,
    /debug/i,
    /refactor/i,
    /strategie.*entwickl/i,
    /business.*plan/i,
  ],
  expert: [
    /system.*design/i,
    /multi.*agent/i,
    /pipeline.*bau/i,
    /vollstaendig.*implementier/i,
    /komplexe.*analyse/i,
    /security.*audit/i,
  ],
}

export function analyzeComplexity(input: string, messageCount: number): TaskComplexity {
  // Short messages are usually simple
  if (input.length < 20) return "trivial"
  if (input.length < 60 && messageCount < 3) return "simple"

  // Check patterns from expert down to trivial
  const levels: TaskComplexity[] = ["expert", "complex", "moderate", "simple", "trivial"]
  for (const level of levels) {
    if (COMPLEXITY_SIGNALS[level].some((re) => re.test(input))) {
      return level
    }
  }

  // Heuristics based on length and conversation depth
  if (input.length > 500 || messageCount > 15) return "complex"
  if (input.length > 200 || messageCount > 8) return "moderate"
  if (input.length > 80) return "simple"
  return "trivial"
}

const COMPLEXITY_TO_QUALITY: Record<TaskComplexity, LLMModel["quality"][]> = {
  trivial: ["basic", "good"],
  simple: ["good", "excellent"],
  moderate: ["good", "excellent"],
  complex: ["excellent", "frontier"],
  expert: ["excellent", "frontier"],
}

export function routeToModel(
  input: string,
  messageCount: number,
  preferredModel?: string,
  taskType?: string
): RoutingDecision {
  // If user explicitly selected a model, respect that
  if (preferredModel && preferredModel !== "auto") {
    const model = AVAILABLE_MODELS.find((m) => m.id === preferredModel)
    if (model) {
      return {
        model,
        reason: `Manuell gewahlt: ${model.name}`,
        estimatedCost: 0,
        confidence: 1.0,
      }
    }
  }

  const complexity = analyzeComplexity(input, messageCount)
  const acceptableQualities = COMPLEXITY_TO_QUALITY[complexity]

  // Filter models by acceptable quality level
  let candidates = AVAILABLE_MODELS.filter((m) =>
    acceptableQualities.includes(m.quality)
  )

  // If task type hint is given, prefer models with matching strengths
  if (taskType) {
    const matched = candidates.filter((m) =>
      m.strengths.some((s) => s.includes(taskType))
    )
    if (matched.length > 0) candidates = matched
  }

  // Sort by cost (cheapest first)
  candidates.sort((a, b) => a.costPer1kInput - b.costPer1kInput)

  const chosen = candidates[0] ?? AVAILABLE_MODELS[0]
  const estimatedInputTokens = Math.ceil(input.length / 4) + messageCount * 200
  const estimatedOutputTokens = Math.min(estimatedInputTokens * 2, 2000)
  const estimatedCost =
    (estimatedInputTokens / 1000) * chosen.costPer1kInput +
    (estimatedOutputTokens / 1000) * chosen.costPer1kOutput

  const reasons: Record<TaskComplexity, string> = {
    trivial: `Einfache Anfrage → ${chosen.name} (schnell & guenstig)`,
    simple: `Standard-Aufgabe → ${chosen.name} (gutes Preis/Leistung)`,
    moderate: `Mittlere Komplexitaet → ${chosen.name}`,
    complex: `Komplexe Aufgabe → ${chosen.name} (hohe Qualitaet)`,
    expert: `Experten-Aufgabe → ${chosen.name} (beste Qualitaet)`,
  }

  return {
    model: chosen,
    reason: reasons[complexity],
    estimatedCost,
    confidence: complexity === "trivial" ? 0.95 : complexity === "expert" ? 0.7 : 0.85,
  }
}

export function getModelById(id: string): LLMModel | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === id || m.openRouterId === id)
}

export function estimateCost(inputTokens: number, outputTokens: number, model: LLMModel): number {
  return (inputTokens / 1000) * model.costPer1kInput + (outputTokens / 1000) * model.costPer1kOutput
}
