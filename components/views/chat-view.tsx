"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import {
  Send,
  Paperclip,
  Mic,
  ArrowUp,
  ChevronDown,
  Share2,
  Pin,
  Settings,
  Bot,
  Thermometer,
  Coins,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import type { Message } from "@/lib/types"

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "claude-3.5", name: "Claude 3.5 Sonnet", provider: "Anthropic" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI" },
  { id: "mistral-large", name: "Mistral Large", provider: "Mistral" },
]

const welcomeMessages = [
  "Wie kann ich dir heute helfen?",
  "Stelle eine Frage oder wahle einen Prompt-Template.",
  "Du kannst auch einen Agenten beauftragen.",
]

export default function ChatView() {
  const { messages, addMessage, currentConversationId, toggleAgentPanel } = useAppStore()
  const [input, setInput] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
    }
    addMessage(userMsg)
    setInput("")

    // Simulate assistant response
    setIsTyping(true)
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: `Das ist eine Demo-Antwort auf deine Nachricht. In der Produktionsversion wurde hier die echte KI-Antwort von ${models.find((m) => m.id === selectedModel)?.name ?? selectedModel} erscheinen.`,
        timestamp: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
        model: selectedModel,
        tokens: { input: 42, output: 87 },
        cost: 0.003,
      }
      addMessage(assistantMsg)
      setIsTyping(false)
    }, 1500)
  }, [input, selectedModel, addMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const currentModel = models.find((m) => m.id === selectedModel)

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div
        className="flex h-[48px] items-center justify-between px-4"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-200 hover:bg-[rgba(255,255,255,0.03)]"
              style={{ color: "var(--text-primary)" }}
            >
              {currentModel?.name}
              <ChevronDown size={13} style={{ color: "var(--text-muted)" }} />
            </button>
            {showModelSelector && (
              <div
                className="absolute left-0 top-full z-50 mt-1 min-w-[200px] rounded-xl py-1.5"
                style={{
                  backgroundColor: "var(--elevated)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m.id)
                      setShowModelSelector(false)
                    }}
                    className={cn(
                      "flex w-full items-center px-3 py-2 text-left text-[13px] transition-all duration-200",
                      selectedModel === m.id
                        ? "bg-[rgba(124,58,237,0.1)]"
                        : "hover:bg-[rgba(255,255,255,0.03)]"
                    )}
                    style={{
                      color: selectedModel === m.id ? "var(--brand-purple)" : "var(--text-secondary)",
                    }}
                  >
                    <span className="flex-1">{m.name}</span>
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {m.provider}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1">
              <Thermometer size={11} /> 0.7
            </span>
            <span className="flex items-center gap-1">
              <Coins size={11} /> {messages.reduce((a, m) => a + (m.tokens?.input ?? 0) + (m.tokens?.output ?? 0), 0)} tok
            </span>
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "var(--success)" }}
            >
              <DollarSign size={10} />
              {"\u20AC"}{messages.reduce((a, m) => a + (m.cost ?? 0), 0).toFixed(3)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleAgentPanel}
            className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)]"
            style={{ color: "var(--text-muted)" }}
          >
            <Bot size={15} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)]" style={{ color: "var(--text-muted)" }}>
            <Share2 size={15} />
          </button>
          <button className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)]" style={{ color: "var(--text-muted)" }}>
            <Pin size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex h-full flex-col items-center justify-center animate-fade-slide-in">
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl animate-orb-glow"
              style={{ backgroundColor: "rgba(124,58,237,0.1)" }}
            >
              <Image src="/oa-logo.svg" alt="OurArk" width={36} height={36} />
            </div>
            <h2 className="mb-2 text-[20px] font-semibold" style={{ color: "var(--text-primary)" }}>
              Neuer Chat
            </h2>
            <div className="space-y-1.5 text-center">
              {welcomeMessages.map((msg, i) => (
                <p key={i} className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                  {msg}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-[700px] space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex animate-fade-slide-in",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div
                    className="mr-2 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                  >
                    <Bot size={11} style={{ color: "var(--brand-purple)" }} />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3",
                    msg.role === "user"
                      ? "max-w-[75%] rounded-br-md"
                      : "max-w-[85%] rounded-bl-md"
                  )}
                  style={{
                    backgroundColor:
                      msg.role === "user"
                        ? "rgba(124, 58, 237, 0.12)"
                        : "var(--surface)",
                  }}
                >
                  {msg.role === "assistant" && msg.model && (
                    <p className="mb-1 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                      {msg.model}
                    </p>
                  )}
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {msg.content}
                  </p>
                  <p className="mt-1.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {msg.timestamp}
                    {msg.tokens && (
                      <span className="ml-2">
                        {msg.tokens.input + msg.tokens.output} tok
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div
                  className="mr-2 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "rgba(124,58,237,0.15)" }}
                >
                  <Bot size={11} style={{ color: "var(--brand-purple)" }} />
                </div>
                <div className="flex gap-1 rounded-2xl rounded-bl-md px-4 py-3" style={{ backgroundColor: "var(--surface)" }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: "var(--text-muted)",
                        animation: `typingDot 1.4s infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4">
        <div
          className="mx-auto max-w-[700px] rounded-xl px-4 py-3 transition-all duration-200"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht eingeben..."
            rows={1}
            className="max-h-[120px] w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[var(--text-muted)]"
            style={{ color: "var(--text-primary)" }}
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)]"
                style={{ color: "var(--text-muted)" }}
              >
                <Paperclip size={15} />
              </button>
              <button
                className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200 hover:bg-[rgba(255,255,255,0.05)]"
                style={{ color: "var(--text-muted)" }}
              >
                <Mic size={15} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Enter zum Senden &middot; Shift+Enter neue Zeile
              </span>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-30 active:scale-95"
                style={{
                  background: input.trim() ? "linear-gradient(135deg, #7c3aed, #6366f1)" : "rgba(124,58,237,0.2)",
                  color: "#fff",
                }}
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
