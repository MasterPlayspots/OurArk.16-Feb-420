import { NextResponse } from "next/server"
import { getDb, isDbConfigured } from "@/lib/db"

// Schema migration statements (IF NOT EXISTS = safe to re-run)
const MIGRATIONS = [
  `CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT 'Neuer Chat',
    last_message TEXT NOT NULL DEFAULT '',
    model TEXT NOT NULL DEFAULT 'auto',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(updated_at DESC)`,
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    model TEXT,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cost REAL NOT NULL DEFAULT 0,
    agent_id TEXT,
    routing_reason TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at ASC)`,
  `CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    system_prompt TEXT NOT NULL DEFAULT '',
    preferred_model TEXT NOT NULL DEFAULT 'auto',
    capabilities TEXT NOT NULL DEFAULT '[]',
    is_built_in INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'online',
    total_tokens_used INTEGER NOT NULL DEFAULT 0,
    total_cost REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS usage_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    model TEXT NOT NULL,
    agent_id TEXT,
    request_count INTEGER NOT NULL DEFAULT 0,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_cost REAL NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS idx_usage_date ON usage_stats(date DESC)`,
]

export async function POST() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: "D1 not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN in .env.local" },
      { status: 500 }
    )
  }

  const db = getDb()
  const results: { sql: string; success: boolean; error?: string }[] = []

  for (const sql of MIGRATIONS) {
    try {
      await db.execute(sql)
      results.push({ sql: sql.slice(0, 60) + "...", success: true })
    } catch (error) {
      results.push({
        sql: sql.slice(0, 60) + "...",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const allSuccess = results.every((r) => r.success)

  return NextResponse.json({
    success: allSuccess,
    message: allSuccess
      ? "All migrations applied successfully"
      : "Some migrations failed",
    results,
  })
}

export async function GET() {
  return NextResponse.json({
    configured: isDbConfigured(),
    message: isDbConfigured()
      ? "D1 is configured. POST to this endpoint to run migrations."
      : "D1 not configured. Set environment variables first.",
  })
}
