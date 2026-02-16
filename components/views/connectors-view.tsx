"use client"

import type { Connector } from "@/lib/types"

const stats = [
  { label: "Active", value: 3, color: "var(--success)" },
  { label: "Warning", value: 1, color: "var(--warning)" },
  { label: "Expired", value: 1, color: "var(--danger)" },
]

const connectors: Connector[] = [
  { id: "c1", name: "Telegram Bot", type: "Messaging", status: "Active", health: 98, lastSync: "vor 1 Min" },
  { id: "c2", name: "OpenRouter API", type: "AI Provider", status: "Active", health: 95, lastSync: "vor 30 Sek" },
  { id: "c3", name: "Workers AI", type: "AI Provider", status: "Active", health: 100, lastSync: "vor 2 Min" },
  { id: "c4", name: "WhatsApp", type: "Messaging", status: "Warning", health: 72, lastSync: "vor 15 Min" },
  { id: "c5", name: "Slack", type: "Messaging", status: "Expired", health: 0, lastSync: "vor 7 Tagen" },
]

function healthColor(h: number): string {
  if (h >= 90) return "var(--success)"
  if (h >= 70) return "var(--warning)"
  return "var(--danger)"
}

export default function ConnectorsView() {
  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Connectors
      </h1>

      {/* Stats */}
      <div className="mb-6 flex gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stat.color }} />
            <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{stat.label}</span>
            <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Connector", "Type", "Status", "Health", "Last Sync"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {connectors.map((c) => (
              <tr
                key={c.id}
                className="transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <td className="px-4 py-3 text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {c.name}
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {c.type}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      backgroundColor:
                        c.status === "Active"
                          ? "rgba(34,197,94,0.1)"
                          : c.status === "Warning"
                            ? "rgba(234,179,8,0.1)"
                            : "rgba(239,68,68,0.1)",
                      color:
                        c.status === "Active"
                          ? "var(--success)"
                          : c.status === "Warning"
                            ? "var(--warning)"
                            : "var(--danger)",
                    }}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: healthColor(c.health) }}>
                  {c.health}%
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {c.lastSync}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
