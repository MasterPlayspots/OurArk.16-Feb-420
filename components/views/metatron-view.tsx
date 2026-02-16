"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Hexagon, Bot, DollarSign, Loader2, Sparkles, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { classifyTaskForAgent } from "@/lib/agents/executor"

interface MasterMessage {
  id: string
  role: "user" | "master" | "agent"
  content: string
  agentName?: string
  model?: string
  cost?: number
  routingReason?: string
}

export default function MetatronView() {
  const { agents, navigateTo, updateAgentStatus } = useAppStore()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<MasterMessage[]>([
    {
      id: "welcome",
      role: "master",
      content:
        "Ich bin Metatron, dein Master Agent. Ich analysiere deine Anfragen, wahle den besten Agenten und das kosteneffizienteste Modell aus. Stell mir eine Aufgabe!",
    },
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  const statusColor = (s: string) => {
    if (s === "online") return "var(--success)"
    if (s === "busy") return "var(--warning)"
    if (s === "learning") return "var(--info)"
    if (s === "error") return "var(--danger)"
    return "var(--text-muted)"
  }

  const handleSend = useCallback(async () => {
    if (!input.trim() || isProcessing) return
    const userInput = input.trim()
    setInput("")

    const userMsg: MasterMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userInput,
    }
    setMessages((prev: MasterMessage[]) => [...prev, userMsg])
    setIsProcessing(true)

    // Step 1: Master Agent classifies the task
    const classification = classifyTaskForAgent(userInput, agents)
    const targetAgent = agents.find((a) => a.id === classification.agentId)

    const routingMsg: MasterMessage = {
      id: `msg-${Date.now()}-routing`,
      role: "master",
      content: `**Analyse:** ${classification.reason}\n\nLeite an **${targetAgent?.name ?? "Agent"}** weiter...`,
      routingReason: classification.reason,
    }
    setMessages((prev: MasterMessage[]) => [...prev, routingMsg])

    if (targetAgent) {
      updateAgentStatus(targetAgent.id, "busy")
    }

    try {
      // Step 2: Execute via the agent
      const res = await fetch("/api/agents/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: targetAgent?.id ?? "agent-metatron",
          input: userInput,
          systemPrompt: targetAgent?.systemPrompt ?? "Du bist ein hilfreicher Assistent.",
          preferredModel: targetAgent?.preferredModel ?? "auto",
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      const agentResponse: MasterMessage = {
        id: `msg-${Date.now()}-response`,
        role: "agent",
        content: data.content,
        agentName: targetAgent?.name ?? "Agent",
        model: data.model,
        cost: data.cost,
        routingReason: data.routingReason,
      }
      setMessages((prev: MasterMessage[]) => [...prev, agentResponse])
    } catch (error) {
      const errorMsg: MasterMessage = {
        id: `msg-${Date.now()}-error`,
        role: "master",
        content: `Fehler bei der Ausfuehrung: ${error instanceof Error ? error.message : "Unbekannter Fehler"}. Pruefe deine OPENROUTER_API_KEY.`,
      }
      setMessages((prev: MasterMessage[]) => [...prev, errorMsg])
    } finally {
      if (targetAgent) {
        updateAgentStatus(targetAgent.id, "online")
      }
      setIsProcessing(false)
    }
  }, [input, isProcessing, agents, updateAgentStatus])

  // Hexagon positions for agents around center
  const positions = [
    { x: 50, y: 12 },
    { x: 85, y: 30 },
    { x: 85, y: 65 },
    { x: 50, y: 83 },
    { x: 15, y: 65 },
    { x: 15, y: 30 },
  ]

  const subAgents = agents.filter((a) => !a.ismaster)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg animate-orb-glow"
            style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
          >
            <Hexagon size={16} style={{ color: "var(--brand-purple)" }} />
          </div>
          <div>
            <h1 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Metatron - Master Agent
            </h1>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {subAgents.filter((a) => a.status === "online" || a.status === "busy").length}/{subAgents.length} Agenten online
            </p>
          </div>
        </div>
        <button
          onClick={() => navigateTo("agent-builder")}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all duration-150"
          style={{
            backgroundColor: "rgba(124,58,237,0.12)",
            color: "var(--brand-purple)",
            border: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          <Image src="/oa-logo.svg" alt="OurArk" width={32} height={32} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Agent Network Visualization */}
        <div className="w-[320px] flex-shrink-0 overflow-y-auto p-4" style={{ borderRight: "1px solid var(--border-default)" }}>
          {/* Hex visualization */}
          <div
            className="relative mb-4 overflow-hidden rounded-xl"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-default)",
              height: 240,
            }}
          >
            {/* Center node (Metatron) */}
            <div
              className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl animate-orb-glow"
              style={{
                backgroundColor: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.3)",
              }}
            >
              <Hexagon size={22} style={{ color: "var(--brand-purple)" }} />
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.3 }}>
              {subAgents.slice(0, 6).map((_, i) => {
                const pos = positions[i]
                if (!pos) return null
                return (
                  <line
                    key={i}
                    x1="50%"
                    y1="50%"
                    x2={`${pos.x}%`}
                    y2={`${pos.y}%`}
                    stroke="var(--brand-purple)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                )
              })}
            </svg>

            {/* Agent nodes */}
            {subAgents.slice(0, 6).map((agent, i) => {
              const pos = positions[i]
              if (!pos) return null
              return (
                <div
                  key={agent.id}
                  className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                >
                  <div
                    className="mb-0.5 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: `${statusColor(agent.status)}15`,
                      border: `1px solid ${statusColor(agent.status)}30`,
                    }}
                  >
                    <Bot size={14} style={{ color: statusColor(agent.status) }} />
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {agent.name}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Agent list */}
          <div className="space-y-1">
            {agents.map((a) => (
              <div
                key={a.id}
                className="transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <div className="relative mr-2.5 flex-shrink-0">
                  {a.ismaster ? <Hexagon size={14} style={{ color: "var(--brand-purple)" }} /> : <Bot size={14} style={{ color: "var(--text-muted)" }} />}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: statusColor(a.status), border: "1px solid var(--ground)" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {a.name} {a.ismaster && <span className="text-[10px]" style={{ color: "var(--brand-purple)" }}>MASTER</span>}
                  </p>
                  <p className="truncate text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {a.description}
                  </p>
                </div>
                <div className="ml-2 text-right">
                  <span
                    className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                    style={{ backgroundColor: `${statusColor(a.status)}15`, color: statusColor(a.status) }}
                  >
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Master Agent Chat */}
        <div className="flex flex-1 flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="mx-auto max-w-[600px] space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex animate-fade-slide-in",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role !== "user" && (
                    <div
                      className="mr-2 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: msg.role === "master" ? "rgba(124,58,237,0.15)" : "rgba(34,197,94,0.15)",
                      }}
                    >
                      {msg.role === "master" ? (
                        <Hexagon size={10} style={{ color: "var(--brand-purple)" }} />
                      ) : (
                        <Bot size={10} style={{ color: "var(--success)" }} />
                      )}
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3",
                      msg.role === "user" ? "max-w-[75%] rounded-br-md" : "max-w-[85%] rounded-bl-md"
                    )}
                    style={{
                      backgroundColor:
                        msg.role === "user"
                          ? "rgba(124,58,237,0.12)"
                          : msg.role === "master"
                            ? "var(--surface)"
                            : "rgba(34,197,94,0.06)",
                    }}
                  >
                    {msg.agentName && (
                      <p className="mb-1 text-[10px] font-medium" style={{ color: "var(--success)" }}>
                        {msg.agentName} {msg.model && `via ${msg.model}`}
                      </p>
                    )}
                    {msg.role === "master" && !msg.agentName && (
                      <p className="mb-1 text-[10px] font-medium" style={{ color: "var(--brand-purple)" }}>
                        Metatron
                      </p>
                    )}
                    <div
                      className="whitespace-pre-wrap text-[13px] leading-relaxed"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {msg.content}
                    </div>
                    {msg.cost != null && msg.cost > 0 && (
                      <p className="mt-1.5 flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                        <DollarSign size={9} />
                        {"\u20AC"}{msg.cost.toFixed(4)}
                        {msg.routingReason && ` · ${msg.routingReason}`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 animate-fade-slide-in">
                  <div
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                  >
                    <Loader2 size={10} className="animate-spin" style={{ color: "var(--brand-purple)" }} />
                  </div>
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Agent arbeitet...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="px-6 pb-4">
            <div
              className="mx-auto max-w-[600px] rounded-xl px-4 py-3"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-default)",
              }}
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Gib Metatron eine Aufgabe... (z.B. 'Schreib einen Blog-Post ueber KI')"
                rows={1}
                className="max-h-[100px] w-full resize-none bg-transparent text-[13px] outline-none placeholder:text-[var(--text-muted)]"
                style={{ color: "var(--text-primary)" }}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                  <Sparkles size={10} />
                  Smart Routing aktiv - Aufgaben werden automatisch verteilt
                </span>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isProcessing}
                  className="flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150 disabled:opacity-30"
                  style={{
                    backgroundColor: input.trim() ? "var(--brand-purple)" : "rgba(124,58,237,0.2)",
                    color: "#fff",
                  }}
                >
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
