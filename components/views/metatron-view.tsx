"use client"

import { Hexagon, Bot } from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function MetatronView() {
  const { agents } = useAppStore()

  // Hexagon positions for 6 agents around center
  const positions = [
    { x: 50, y: 15 },
    { x: 85, y: 32 },
    { x: 85, y: 68 },
    { x: 50, y: 85 },
    { x: 15, y: 68 },
    { x: 15, y: 32 },
  ]

  const statusColor = (s: string) => {
    if (s === "online") return "var(--success)"
    if (s === "busy") return "var(--warning)"
    if (s === "learning") return "var(--info)"
    return "var(--text-muted)"
  }

  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Metatron - Agent Network
      </h1>

      {/* Hexagon visualization */}
      <div
        className="relative mb-8 overflow-hidden rounded-xl"
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border-default)",
          height: 360,
        }}
      >
        {/* Center node */}
        <div
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl animate-orb-glow"
          style={{
            backgroundColor: "rgba(124, 58, 237, 0.15)",
            border: "1px solid rgba(124, 58, 237, 0.3)",
          }}
        >
          <Hexagon size={28} style={{ color: "var(--brand-purple)" }} />
        </div>

        {/* Connection lines */}
        <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.3 }}>
          {positions.map((pos, i) => (
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
          ))}
        </svg>

        {/* Agent nodes */}
        {agents.map((agent, i) => {
          const pos = positions[i]
          if (!pos) return null
          return (
            <div
              key={agent.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div
                className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: `${statusColor(agent.status)}15`,
                  border: `1px solid ${statusColor(agent.status)}30`,
                }}
              >
                <Bot size={18} style={{ color: statusColor(agent.status) }} />
              </div>
              <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                {agent.name}
              </span>
              <span className="text-[9px]" style={{ color: statusColor(agent.status) }}>
                {agent.status}
              </span>
            </div>
          )
        })}
      </div>

      {/* Agent table */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Agent", "Model", "Status", "Tasks", "Description"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr
                key={a.id}
                className="transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <td className="px-4 py-3 text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {a.name}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md px-2 py-0.5 text-[11px] font-mono" style={{ backgroundColor: "var(--elevated)", color: "var(--text-secondary)" }}>
                    {a.model}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      backgroundColor: `${statusColor(a.status)}15`,
                      color: statusColor(a.status),
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: statusColor(a.status) }} />
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  {a.tasks}
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {a.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
