"use client"

import { useState, useEffect } from "react"
import { X, Bot, ArrowUp, CheckCircle2, Loader2, XCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface AgentTask {
  id: string
  description: string
  status: "running" | "done" | "error"
}

const demoTasks: AgentTask[] = [
  { id: "t1", description: "Analyzing input data...", status: "done" },
  { id: "t2", description: "Generating content draft...", status: "done" },
  { id: "t3", description: "Running quality check...", status: "running" },
]

export default function AgentPanel() {
  const { agentPanelOpen, toggleAgentPanel, agents } = useAppStore()
  const [agentInput, setAgentInput] = useState("")
  const [tasks, setTasks] = useState<AgentTask[]>(demoTasks)
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "agent", text: "Hallo! Ich bin Aria, dein Content-Agent. Was soll ich fur dich erstellen?" },
  ])

  // Auto-complete running tasks (demo)
  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.status === "running" ? { ...t, status: "done" } : t
        )
      )
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  if (!agentPanelOpen) return null

  const activeAgent = agents.find((a) => a.status === "online" || a.status === "busy") ?? agents[0]

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
              {activeAgent?.name ?? "Agent"}
            </span>
            <span className="ml-2 text-[10px]" style={{ color: "var(--success)" }}>
              online
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
      <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
          Tasks
        </p>
        <div className="space-y-1">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2 rounded-md px-2 py-1.5">
              {task.status === "running" ? (
                <Loader2 size={12} className="animate-spin flex-shrink-0" style={{ color: "var(--warning)" }} />
              ) : task.status === "done" ? (
                <CheckCircle2 size={12} className="flex-shrink-0" style={{ color: "var(--success)" }} />
              ) : (
                <XCircle size={12} className="flex-shrink-0" style={{ color: "var(--danger)" }} />
              )}
              <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                {task.description}
              </span>
            </div>
          ))}
        </div>
      </div>

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
                {msg.text}
              </div>
            </div>
          ))}
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
                setMessages((prev) => [...prev, { role: "user", text: agentInput.trim() }])
                const userText = agentInput.trim()
                setAgentInput("")
                setTimeout(() => {
                  setMessages((prev) => [
                    ...prev,
                    { role: "agent", text: `Ich arbeite an "${userText}". Einen Moment bitte...` },
                  ])
                }, 800)
              }
            }}
            placeholder="Agent beauftragen..."
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--text-muted)]"
            style={{ color: "var(--text-primary)" }}
          />
          <button
            disabled={!agentInput.trim()}
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
