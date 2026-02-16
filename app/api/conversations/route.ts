import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  isDbConfigured,
  listConversations,
  createConversation,
  deleteConversation,
  listMessages,
  createMessage,
} from "@/lib/db"

// GET /api/conversations - List all conversations
// GET /api/conversations?id=conv-123 - Get messages for a conversation
export async function GET(request: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured", fallback: true }, { status: 200 })
  }

  const { searchParams } = request.nextUrl
  const conversationId = searchParams.get("id")

  try {
    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await listMessages(conversationId)
      return NextResponse.json({ messages })
    }

    // List all conversations
    const conversations = await listConversations()
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Conversations GET error:", error)
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}

const createConvSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(200),
  model: z.string().default("auto"),
})

const createMsgSchema = z.object({
  conversationId: z.string().min(1),
  message: z.object({
    id: z.string().min(1),
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1),
    model: z.string().optional(),
    inputTokens: z.number().optional(),
    outputTokens: z.number().optional(),
    cost: z.number().optional(),
    agentId: z.string().optional(),
    routingReason: z.string().optional(),
  }),
})

// POST /api/conversations - Create conversation or save message
export async function POST(request: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured", fallback: true }, { status: 200 })
  }

  try {
    const body = await request.json()

    // Determine if this is a conversation creation or message save
    if (body.message) {
      const parsed = createMsgSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid message", details: parsed.error.flatten() },
          { status: 400 }
        )
      }
      await createMessage({ ...parsed.data.message, conversationId: parsed.data.conversationId })
      return NextResponse.json({ success: true })
    }

    const parsed = createConvSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid conversation", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    await createConversation(parsed.data.id, parsed.data.title, parsed.data.model)
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Conversations POST error:", error)
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    )
  }
}

const deleteSchema = z.object({
  id: z.string().min(1),
})

// DELETE /api/conversations - Delete a conversation and its messages
export async function DELETE(request: NextRequest) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured", fallback: true }, { status: 200 })
  }

  try {
    const body = await request.json()
    const parsed = deleteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await deleteConversation(parsed.data.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Conversations DELETE error:", error)
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    )
  }
}
