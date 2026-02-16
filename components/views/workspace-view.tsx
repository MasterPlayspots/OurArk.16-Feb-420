"use client"

import { useAppStore } from "@/lib/store"
import { Eye, EyeOff, Key } from "lucide-react"
import { useState } from "react"

const apiKeys = [
  { id: "k1", name: "OpenRouter Production", key: "sk-or-v1-****...3f8a", created: "12. Jan 2026", status: "Active" },
  { id: "k2", name: "Telegram Bot Token", key: "7234****...9xQ", created: "5. Feb 2026", status: "Active" },
  { id: "k3", name: "Workers AI (Staging)", key: "cf-ai-****...b2e1", created: "28. Jan 2026", status: "Active" },
]

export default function WorkspaceView() {
  const { teamMembers } = useAppStore()
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const roleColors: Record<string, { bg: string; color: string }> = {
    Admin: { bg: "rgba(124,58,237,0.1)", color: "var(--brand-purple)" },
    Editor: { bg: "rgba(6,182,212,0.1)", color: "var(--info)" },
    Viewer: { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)" },
  }

  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Workspace
      </h1>

      {/* Team */}
      <h2 className="mb-3 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
        Team Members
      </h2>
      <div
        className="mb-8 overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Member", "Role", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m) => {
              const rc = roleColors[m.role] ?? roleColors.Viewer
              return (
                <tr
                  key={m.id}
                  className="transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div
                        className="mr-3 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold"
                        style={{ backgroundColor: "rgba(124,58,237,0.15)", color: "var(--brand-purple)" }}
                      >
                        {m.name[0]}
                      </div>
                      <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: rc.bg, color: rc.color }}>
                      {m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor:
                            m.status === "online" ? "var(--success)" : m.status === "away" ? "var(--warning)" : "var(--text-muted)",
                        }}
                      />
                      <span className="text-[12px] capitalize" style={{ color: "var(--text-secondary)" }}>
                        {m.status}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* API Keys */}
      <h2 className="mb-3 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
        API Keys
      </h2>
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Name", "Key", "Created", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((k) => (
              <tr
                key={k.id}
                className="transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Key size={13} className="mr-2" style={{ color: "var(--text-muted)" }} />
                    <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{k.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <code className="text-[12px] font-mono" style={{ color: "var(--text-muted)" }}>
                      {showKeys[k.id] ? k.key.replace(/\*/g, "x") : k.key}
                    </code>
                    <button
                      onClick={() => setShowKeys((p) => ({ ...p, [k.id]: !p[k.id] }))}
                      className="flex h-5 w-5 items-center justify-center rounded transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {showKeys[k.id] ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>{k.created}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "var(--success)" }}>
                    {k.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
