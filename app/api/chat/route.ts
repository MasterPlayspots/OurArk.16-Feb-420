import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// OpenRouter model ID mapping
const MODEL_MAP: Record<string, string> = {
  "gpt-4o": "openai/gpt-4o",
  "claude-3.5": "anthropic/claude-3.5-sonnet",
  "gpt-4o-mini": "openai/gpt-4o-mini",
  "mistral-large": "mistralai/mistral-large-latest",
}

const chatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string().min(1).max(32000),
    })
  ).min(1).max(100),
  model: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured. Set OPENROUTER_API_KEY in .env.local" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const parsed = chatRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { messages, model } = parsed.data
    const openRouterModel = MODEL_MAP[model] ?? model

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://ourark.io",
        "X-Title": "OurArk AI Workspace",
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("OpenRouter error:", response.status, errorText)
      return NextResponse.json(
        { error: "AI model request failed", status: response.status },
        { status: 502 }
      )
    }

    const data = await response.json()
    const choice = data.choices?.[0]

    return NextResponse.json({
      content: choice?.message?.content ?? "",
      model: data.model ?? openRouterModel,
      usage: {
        input: data.usage?.prompt_tokens ?? 0,
        output: data.usage?.completion_tokens ?? 0,
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
