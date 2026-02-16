import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { routeToModel, AVAILABLE_MODELS } from "@/lib/llm-router"

const executeSchema = z.object({
  agentId: z.string(),
  input: z.string().min(1).max(32000),
  systemPrompt: z.string().min(1).max(10000),
  conversationHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ).optional().default([]),
  preferredModel: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const parsed = executeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { input, systemPrompt, conversationHistory, preferredModel } = parsed.data

    // Smart model routing
    const routing = routeToModel(
      input,
      conversationHistory.length,
      preferredModel === "auto" ? undefined : preferredModel
    )

    // Build message chain
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-20),
      { role: "user" as const, content: input },
    ]

    const startTime = Date.now()

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://ourark.io",
        "X-Title": "OurArk AI Workspace",
      },
      body: JSON.stringify({
        model: routing.model.openRouterId,
        messages,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Agent execution error:", response.status, errorText)
      return NextResponse.json(
        { error: "Agent execution failed", status: response.status },
        { status: 502 }
      )
    }

    const data = await response.json()
    const choice = data.choices?.[0]
    const duration = Date.now() - startTime
    const usage = {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    }

    const modelInfo = AVAILABLE_MODELS.find((m) => m.openRouterId === routing.model.openRouterId)
    const cost = modelInfo
      ? (usage.input / 1000) * modelInfo.costPer1kInput +
        (usage.output / 1000) * modelInfo.costPer1kOutput
      : 0

    return NextResponse.json({
      content: choice?.message?.content ?? "",
      model: routing.model.name,
      modelId: routing.model.id,
      usage,
      cost,
      duration,
      routingReason: routing.reason,
    })
  } catch (error) {
    console.error("Agent execution error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
