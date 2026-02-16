"use client"

import { Star, Eye, Play } from "lucide-react"

const templates = [
  { id: "p1", name: "Blog Post Generator", category: "Content", rating: 4.8, uses: 234, description: "Generiert SEO-optimierte Blogartikel" },
  { id: "p2", name: "Email Antwort", category: "Support", rating: 4.6, uses: 189, description: "Professionelle Kunden-Antworten" },
  { id: "p3", name: "Code Reviewer", category: "Development", rating: 4.9, uses: 156, description: "Detailliertes Code-Review mit Verbesserungen" },
  { id: "p4", name: "Social Media Post", category: "Marketing", rating: 4.3, uses: 312, description: "Multi-Platform Social Content" },
  { id: "p5", name: "Meeting Summary", category: "Productivity", rating: 4.7, uses: 98, description: "Strukturierte Meeting-Zusammenfassungen" },
  { id: "p6", name: "Product Description", category: "E-Commerce", rating: 4.5, uses: 267, description: "Uberzeugende Produkttexte" },
]

const categoryColors: Record<string, { bg: string; text: string }> = {
  Content: { bg: "rgba(124,58,237,0.1)", text: "var(--brand-purple)" },
  Support: { bg: "rgba(6,182,212,0.1)", text: "var(--info)" },
  Development: { bg: "rgba(34,197,94,0.1)", text: "var(--success)" },
  Marketing: { bg: "rgba(234,179,8,0.1)", text: "var(--warning)" },
  Productivity: { bg: "rgba(99,102,241,0.1)", text: "var(--brand-indigo)" },
  "E-Commerce": { bg: "rgba(239,68,68,0.1)", text: "var(--danger)" },
}

export default function PromptsView() {
  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Prompt Templates
      </h1>

      <div className="grid grid-cols-2 gap-4">
        {templates.map((t) => {
          const cat = categoryColors[t.category] ?? categoryColors.Content
          return (
            <div
              key={t.id}
              className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-px"
              style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <span
                    className="mb-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: cat.bg, color: cat.text }}
                  >
                    {t.category}
                  </span>
                  <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                    {t.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} fill="var(--warning)" style={{ color: "var(--warning)" }} />
                  <span className="text-[12px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    {t.rating}
                  </span>
                </div>
              </div>
              <p className="mb-4 text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {t.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {t.uses}x verwendet
                </span>
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
                    style={{ color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
                  >
                    <Eye size={12} /> Vorschau
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-all duration-150 active:scale-[0.97]"
                    style={{
                      backgroundColor: "rgba(124,58,237,0.12)",
                      color: "var(--brand-purple)",
                      border: "1px solid rgba(124,58,237,0.15)",
                    }}
                  >
                    <Play size={12} /> Verwenden
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
