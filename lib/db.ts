// ============================================================
// Cloudflare D1 Database Client (HTTP REST API)
// ============================================================
// Works from Next.js API Routes without Wrangler bindings.
// Requires: CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN
//
// Get these from: Cowork Dashboard → Workers & Pages → D1 → Your Database
// Or: https://dash.cloudflare.com → Workers & Pages → D1

interface D1Result<T = Record<string, unknown>> {
  results: T[]
  success: boolean
  meta: {
    changes: number
    last_row_id: number
    duration: number
  }
}

interface D1Response<T = Record<string, unknown>> {
  result: D1Result<T>[]
  success: boolean
  errors: { code: number; message: string }[]
}

class D1Client {
  private accountId: string
  private databaseId: string
  private apiToken: string
  private baseUrl: string

  constructor() {
    this.accountId = process.env.CLOUDFLARE_ACCOUNT_ID ?? ""
    this.databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID ?? ""
    this.apiToken = process.env.CLOUDFLARE_API_TOKEN ?? ""
    this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}`
  }

  get isConfigured(): boolean {
    return !!(this.accountId && this.databaseId && this.apiToken)
  }

  async query<T = Record<string, unknown>>(
    sql: string,
    params: unknown[] = []
  ): Promise<D1Result<T>> {
    if (!this.isConfigured) {
      throw new Error(
        "D1 not configured. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, CLOUDFLARE_API_TOKEN in .env.local"
      )
    }

    const response = await fetch(`${this.baseUrl}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("D1 query error:", response.status, text)
      throw new Error(`D1 query failed: ${response.status}`)
    }

    const data: D1Response<T> = await response.json()

    if (!data.success || data.errors?.length > 0) {
      throw new Error(`D1 error: ${data.errors?.[0]?.message ?? "Unknown error"}`)
    }

    return data.result[0]
  }

  async execute(sql: string, params: unknown[] = []): Promise<{ changes: number }> {
    const result = await this.query(sql, params)
    return { changes: result.meta.changes }
  }

  async batch(statements: { sql: string; params?: unknown[] }[]): Promise<D1Result[]> {
    if (!this.isConfigured) {
      throw new Error("D1 not configured")
    }

    // D1 HTTP API doesn't support batch natively, execute sequentially
    const results: D1Result[] = []
    for (const stmt of statements) {
      const result = await this.query(stmt.sql, stmt.params ?? [])
      results.push(result)
    }
    return results
  }
}

// Singleton instance
let _db: D1Client | null = null

export function getDb(): D1Client {
  if (!_db) {
    _db = new D1Client()
  }
  return _db
}

export function isDbConfigured(): boolean {
  return getDb().isConfigured
}

// ============================================================
// Database helpers for common operations
// ============================================================

export interface DbConversation {
  id: string
  title: string
  last_message: string
  model: string
  created_at: string
  updated_at: string
}

export interface DbMessage {
  id: string
  conversation_id: string
  role: "user" | "assistant" | "system"
  content: string
  model: string | null
  input_tokens: number
  output_tokens: number
  cost: number
  agent_id: string | null
  routing_reason: string | null
  created_at: string
}

export interface DbAgent {
  id: string
  name: string
  description: string
  system_prompt: string
  preferred_model: string
  capabilities: string // JSON array
  is_built_in: number // SQLite boolean
  status: string
  total_tokens_used: number
  total_cost: number
  created_at: string
}

// Conversation operations
export async function listConversations(limit = 50): Promise<DbConversation[]> {
  const db = getDb()
  const result = await db.query<DbConversation>(
    "SELECT * FROM conversations ORDER BY updated_at DESC LIMIT ?",
    [limit]
  )
  return result.results
}

export async function getConversation(id: string): Promise<DbConversation | null> {
  const db = getDb()
  const result = await db.query<DbConversation>(
    "SELECT * FROM conversations WHERE id = ?",
    [id]
  )
  return result.results[0] ?? null
}

export async function createConversation(
  id: string,
  title: string,
  model: string
): Promise<void> {
  const db = getDb()
  await db.execute(
    "INSERT INTO conversations (id, title, last_message, model, created_at, updated_at) VALUES (?, ?, '', ?, datetime('now'), datetime('now'))",
    [id, title, model]
  )
}

export async function updateConversation(
  id: string,
  updates: { title?: string; last_message?: string }
): Promise<void> {
  const db = getDb()
  const sets: string[] = ["updated_at = datetime('now')"]
  const params: unknown[] = []

  if (updates.title !== undefined) {
    sets.push("title = ?")
    params.push(updates.title)
  }
  if (updates.last_message !== undefined) {
    sets.push("last_message = ?")
    params.push(updates.last_message)
  }

  params.push(id)
  await db.execute(
    `UPDATE conversations SET ${sets.join(", ")} WHERE id = ?`,
    params
  )
}

export async function deleteConversation(id: string): Promise<void> {
  const db = getDb()
  await db.execute("DELETE FROM messages WHERE conversation_id = ?", [id])
  await db.execute("DELETE FROM conversations WHERE id = ?", [id])
}

// Message operations
export async function listMessages(
  conversationId: string,
  limit = 200
): Promise<DbMessage[]> {
  const db = getDb()
  const result = await db.query<DbMessage>(
    "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?",
    [conversationId, limit]
  )
  return result.results
}

export async function createMessage(msg: {
  id: string
  conversationId: string
  role: string
  content: string
  model?: string
  inputTokens?: number
  outputTokens?: number
  cost?: number
  agentId?: string
  routingReason?: string
}): Promise<void> {
  const db = getDb()
  await db.execute(
    `INSERT INTO messages (id, conversation_id, role, content, model, input_tokens, output_tokens, cost, agent_id, routing_reason, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      msg.id,
      msg.conversationId,
      msg.role,
      msg.content,
      msg.model ?? null,
      msg.inputTokens ?? 0,
      msg.outputTokens ?? 0,
      msg.cost ?? 0,
      msg.agentId ?? null,
      msg.routingReason ?? null,
    ]
  )

  // Update conversation last_message
  await updateConversation(msg.conversationId, {
    last_message: msg.content.slice(0, 200),
  })
}

// Agent operations
export async function listAgents(): Promise<DbAgent[]> {
  const db = getDb()
  const result = await db.query<DbAgent>(
    "SELECT * FROM agents ORDER BY created_at ASC"
  )
  return result.results
}

export async function upsertAgent(agent: {
  id: string
  name: string
  description: string
  systemPrompt: string
  preferredModel: string
  capabilities: string[]
  isBuiltIn: boolean
}): Promise<void> {
  const db = getDb()
  await db.execute(
    `INSERT INTO agents (id, name, description, system_prompt, preferred_model, capabilities, is_built_in, status, total_tokens_used, total_cost, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'online', 0, 0, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       description = excluded.description,
       system_prompt = excluded.system_prompt,
       preferred_model = excluded.preferred_model,
       capabilities = excluded.capabilities`,
    [
      agent.id,
      agent.name,
      agent.description,
      agent.systemPrompt,
      agent.preferredModel,
      JSON.stringify(agent.capabilities),
      agent.isBuiltIn ? 1 : 0,
    ]
  )
}

export async function deleteAgent(id: string): Promise<void> {
  const db = getDb()
  await db.execute("DELETE FROM agents WHERE id = ? AND is_built_in = 0", [id])
}
