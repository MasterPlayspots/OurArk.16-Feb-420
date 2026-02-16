"use client"

import { useState } from "react"
import {
  Bot,
  Plus,
  Wand2,
  Save,
  ArrowLeft,
  Sparkles,
  Code,
  FileText,
  Languages,
  Share2,
  Search,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { AGENT_TEMPLATES } from "@/lib/agents/registry"
import { AVAILABLE_MODELS } from "@/lib/llm-router"
import type { Agent } from "@/lib/types"

const CAPABILITY_OPTIONS = [
  "content-creation", "copywriting", "seo", "social-media",
  "coding", "code-review", "debugging", "architecture",
  "research", "data-analysis", "reporting", "summarization",
  "customer-support", "communication", "email", "faq",
  "strategy", "planning", "consulting", "translation",
]

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  bot: <Bot size={20} />,
  languages: <Languages size={20} />,
  share2: <Share2 size={20} />,
  code: <Code size={20} />,
}

export default function AgentBuilderView() {
  const { addAgent, navigateTo } = useAppStore()
  const [step, setStep] = useState<"templates" | "editor">("templates")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [systemPrompt, setSystemPrompt] = useState("")
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([])
  const [selectedModel, setSelectedModel] = useState("auto")
  const [isSaving, setIsSaving] = useState(false)

  const loadTemplate = (templateId: string) => {
    const tpl = AGENT_TEMPLATES.find((t) => t.id === templateId)
    if (!tpl) return
    if (tpl.id !== "tpl-blank") {
      setName(tpl.name)
      setDescription(tpl.description)
      setSystemPrompt(tpl.systemPrompt)
      setSelectedCapabilities(tpl.capabilities)
      setSelectedModel(tpl.suggestedModel)
    }
    setStep("editor")
  }

  const toggleCapability = (cap: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    )
  }

  const handleSave = async () => {
    if (!name.trim() || !systemPrompt.trim()) return
    setIsSaving(true)

    const newAgent: Agent = {
      id: `agent-custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || name.trim(),
      systemPrompt: systemPrompt.trim(),
      capabilities: selectedCapabilities,
      model: selectedModel,
      preferredModel: selectedModel,
      status: "online",
      tasks: 0,
      isBuiltIn: false,
      maxConcurrentTasks: 5,
      totalTokensUsed: 0,
      totalCost: 0,
      createdAt: new Date().toISOString(),
    }

    addAgent(newAgent)

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 300))
    setIsSaving(false)
    navigateTo("metatron")
  }

  if (step === "templates") {
    return (
      <div className="mx-auto max-w-[800px] p-8 animate-fade-slide-in">
        <div className="mb-8">
          <h1 className="mb-2 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
            Neuen Agent erstellen
          </h1>
          <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
            Wahle ein Template oder starte von Null
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {AGENT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => loadTemplate(tpl.id)}
              className="group flex flex-col items-start rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                style={{ backgroundColor: "rgba(124,58,237,0.1)", color: "var(--brand-purple)" }}
              >
                {TEMPLATE_ICONS[tpl.icon] ?? <Bot size={20} />}
              </div>
              <h3 className="mb-1 text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {tpl.name}
              </h3>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {tpl.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[800px] p-8 animate-fade-slide-in">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setStep("templates")}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
            Agent konfigurieren
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={!name.trim() || !systemPrompt.trim() || isSaving}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-150 disabled:opacity-40"
          style={{ backgroundColor: "var(--brand-purple)", color: "#fff" }}
        >
          {isSaving ? <Zap size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? "Wird erstellt..." : "Agent erstellen"}
        </button>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Name & Description */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Content Writer"
              maxLength={50}
              className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)]"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
              Beschreibung
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Was macht dieser Agent?"
              maxLength={200}
              className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none transition-all duration-200 placeholder:text-[var(--text-muted)]"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* System Prompt */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Definiere die Persoenlichkeit, Regeln und Faehigkeiten des Agents..."
            rows={8}
            maxLength={10000}
            className="w-full resize-none rounded-lg px-3 py-2.5 text-[13px] leading-relaxed outline-none transition-all duration-200 placeholder:text-[var(--text-muted)]"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
          />
          <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
            {systemPrompt.length}/10.000 Zeichen
          </p>
        </div>

        {/* Model Selection */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
            Bevorzugtes Modell
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "auto", name: "Auto (Smart)", desc: "Waehlt automatisch" },
              ...AVAILABLE_MODELS.slice(0, 5).map((m) => ({ id: m.id, name: m.name, desc: m.provider })),
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-left transition-all duration-150",
                  selectedModel === m.id ? "ring-1" : ""
                )}
                style={{
                  backgroundColor: selectedModel === m.id ? "rgba(124,58,237,0.1)" : "var(--surface)",
                  border: `1px solid ${selectedModel === m.id ? "rgba(124,58,237,0.4)" : "var(--border-default)"}`,
                  color: selectedModel === m.id ? "var(--brand-purple)" : "var(--text-secondary)",
                }}
              >
                <p className="text-[12px] font-medium">{m.name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{m.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
            Faehigkeiten
          </label>
          <div className="flex flex-wrap gap-2">
            {CAPABILITY_OPTIONS.map((cap) => (
              <button
                key={cap}
                onClick={() => toggleCapability(cap)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-medium transition-all duration-150",
                  selectedCapabilities.includes(cap)
                    ? ""
                    : "hover:bg-[rgba(255,255,255,0.05)]"
                )}
                style={{
                  backgroundColor: selectedCapabilities.includes(cap) ? "rgba(124,58,237,0.15)" : "var(--surface)",
                  border: `1px solid ${selectedCapabilities.includes(cap) ? "rgba(124,58,237,0.3)" : "var(--border-default)"}`,
                  color: selectedCapabilities.includes(cap) ? "var(--brand-purple)" : "var(--text-muted)",
                }}
              >
                {cap}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
