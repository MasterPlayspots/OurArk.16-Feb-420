import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Agent CRUD API
// Note: In production this should use a database.
// For now, agents are managed client-side in Zustand store.
// This endpoint handles agent validation and serves as the API contract.

const createAgentSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  systemPrompt: z.string().min(10).max(10000),
  capabilities: z.array(z.string()).max(10),
  preferredModel: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createAgentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid agent definition", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const agent = {
      id: `agent-custom-${Date.now()}`,
      ...parsed.data,
      status: "online" as const,
      model: parsed.data.preferredModel ?? "auto",
      tasks: 0,
      isBuiltIn: false,
      maxConcurrentTasks: 5,
      totalTokensUsed: 0,
      totalCost: 0,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ agent }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  // Return available capabilities and model options for agent builder UI
  return NextResponse.json({
    availableCapabilities: [
      "content-creation", "copywriting", "seo", "social-media",
      "coding", "code-review", "debugging", "architecture",
      "research", "data-analysis", "reporting", "summarization",
      "customer-support", "communication", "email", "faq",
      "strategy", "planning", "consulting", "decision-support",
      "translation", "task-routing", "agent-coordination",
    ],
    availableModels: [
      { id: "auto", name: "Auto (Smart Routing)", description: "Automatische Modellwahl basierend auf Aufgabe" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Schnell & guenstig fuer einfache Aufgaben" },
      { id: "claude-3.5-haiku", name: "Claude 3.5 Haiku", description: "Schnell, gut fuer Code" },
      { id: "gpt-4o", name: "GPT-4o", description: "Allrounder, kreativ" },
      { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", description: "Beste Code-Qualitaet" },
      { id: "claude-sonnet-4", name: "Claude Sonnet 4", description: "Frontier - komplexe Aufgaben" },
      { id: "mistral-large", name: "Mistral Large", description: "Gut fuer Europa/Mehrsprachig" },
    ],
  })
}
