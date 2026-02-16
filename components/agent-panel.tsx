"use client"

import { useState, useCallback } from "react"
import { X, Bot, ArrowUp, CheckCircle2, Loader2, XCircle, Sparkles } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { classifyTaskForAgent } from "@/lib/agents/executor"

interface PanelTask {
  id: string
  description: string
  status: "running" | "done" | "error"
}

export default function AgentPanel() {
  const { agentPanelOpen, toggleAgentPanel, agents, updateAgentStatus } = useAppStore()
  const [agentInput, setAgentInput] = useState("")
  const [tasks, setTasks] = useState<PanelTask[]>([])
  const [messages, setMessages] = useState<{ role: string; text: string; agent?: string }[]>([
    { role: "agent", text: "Hallo! Ich bin bereit Aufgaben entgegenzunehmen. Was soll ich tun?" },
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSend = useCallback(async () => {
    if (!agentInput.trim() || isProcessing) return
    const userText = agentInput.trim()
    setAgentInput("")
    setMessages((prev) => [...prev, { role: "user", text: userText }])
    setIsProcessing(true)

    // Classify which agent should handle this
    const classification = classifyTaskForAgent(userText, agents)
    const targetAgent = agents.find((a) => a.id === classification.agentId)

    const taskId = `task-${Date.now()}`
    setTasks((prev) => [...prev, { id: taskId, description: userText, status: "running" }])

    if (targetAgent) {
      updateAgentStatus(targetAgent.id, "busy")
    }

    try {
      const res = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: targetAgent?.id ?? "agent-aria",
          input: userText,
          systemPrompt: targetAgent?.systemPrompt ?? "Du bist ein hilfreicher Assistent. Antworte kurz und praegnant.",
          preferredModel: targetAgent?.preferredModel ?? "auto",
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: data.content, agent: targetAgent?.name },
      ])
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "done" } : t))
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", text: "Fehler bei der Ausfuehrung. Pruefe deine OPENROUTER_API_KEY." },
      ])
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: "error" } : t))
    } finally {
      if (targetAgent) {
        updateAgentStatus(targetAgent.id, "online")
      }
      setIsProcessing(false)
    }
  }, [agentInput, isProcessing, agents, updateAgentStatus])

  if (!agentPanelOpen) return null

  const activeAgent = agents.find((a) => a.status === "online" || a.status === "busy")
  const onlineCount = agents.filter((a) => a.status === "online" || a.status === "busy").length

  return (
    <div
      className="flex h-full w-80 flex-col"
      style={{
        backgroundColor: "var(--ground)",
        borderLeft: "1px solid var(--border-default)",
        animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
          >
            <Bot size={12} style={{ color: "var(--brand-purple)" }} />
          </div>
          <div>
            <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Agent Panel
            </span>
            <span className="ml-2 text-[10px]" style={{ color: "var(--success)" }}>
              {onlineCount} online
            </span>
          </div>
        </div>
        <button
          onClick={toggleAgentPanel}
          className="flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "var(--text-muted)" }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border-default)" }}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
            Tasks
          </p>
          <div className="space-y-1">
            {tasks.slice(-5).map((task) => (
              <div key={task.id} className="flex items-center gap-2 rounded-md px-2 py-1.5">
                {task.status === "running" ? (
                  <Loader2 size={12} className="animate-spin flex-shrink-0" style={{ color: "var(--warning)" }} />
                ) : task.status === "done" ? (
                  <CheckCircle2 size={12} className="flex-shrink-0" style={{ color: "var(--success)" }} />
                ) : (
                  <XCircle size={12} className="flex-shrink-0" style={{ color: "var(--danger)" }} />
                )}
                <span className="truncate text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  {task.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                  msg.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                }`}
                style={{
                  backgroundColor: msg.role === "user" ? "rgba(124,58,237,0.12)" : "var(--surface)",
                  color: "var(--text-primary)",
                }}
              >
                {msg.agent && (
                  <p className="mb-0.5 text-[10px] font-medium" style={{ color: "var(--brand-purple)" }}>
                    {msg.agent}
                  </p>
                )}
                <span className="whitespace-pre-wrap">{msg.text}</span>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" style={{ color: "var(--brand-purple)" }} />
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Agent arbeitet...</span>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center rounded-xl px-3 py-2"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
        >
          <input
            type="text"
            value={agentInput}
            onChange={(e) => setAgentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && agentInput.trim()) {
                handleSend()
              }
            }}
            placeholder="Agent beauftragen..."
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--text-muted)]"
            style={{ color: "var(--text-primary)" }}
          />
          <button
            onClick={handleSend}
            disabled={!agentInput.trim() || isProcessing}
            className="ml-2 flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150 disabled:opacity-30"
            style={{ backgroundColor: "var(--brand-purple)", color: "#fff" }}
          >
            <ArrowUp size={13} />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
