"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import type { EventLog } from "@/lib/types"

const events: EventLog[] = [
  { id: "e1", timestamp: "14:23:01", category: "Agent", severity: "INFO", message: "Aria completed content generation task", source: "agent-service" },
  { id: "e2", timestamp: "14:22:45", category: "API", severity: "WARN", message: "OpenRouter response time >2s", source: "api-gateway" },
  { id: "e3", timestamp: "14:21:30", category: "System", severity: "DEBUG", message: "Cache invalidation completed for 23 keys", source: "cache-manager" },
  { id: "e4", timestamp: "14:20:15", category: "Budget", severity: "WARN", message: "Daily budget at 76.8% utilization", source: "budget-monitor" },
  { id: "e5", timestamp: "14:18:00", category: "Auth", severity: "INFO", message: "User Noah authenticated via SSO", source: "auth-service" },
  { id: "e6", timestamp: "14:15:22", category: "Connector", severity: "ERROR", message: "WhatsApp webhook delivery failed (retry 2/3)", source: "connector-whatsapp" },
  { id: "e7", timestamp: "14:12:00", category: "Agent", severity: "INFO", message: "Nova started code review task #847", source: "agent-service" },
  { id: "e8", timestamp: "14:10:33", category: "System", severity: "CRITICAL", message: "Rate limit exceeded for IP 192.168.1.x", source: "rate-limiter" },
]

const severityStyles: Record<string, { bg: string; color: string }> = {
  DEBUG: { bg: "rgba(100,116,139,0.1)", color: "var(--text-muted)" },
  INFO: { bg: "rgba(6,182,212,0.1)", color: "var(--info)" },
  WARN: { bg: "rgba(234,179,8,0.1)", color: "var(--warning)" },
  ERROR: { bg: "rgba(239,68,68,0.1)", color: "var(--danger)" },
  CRITICAL: { bg: "rgba(239,68,68,0.15)", color: "var(--danger)" },
}

export default function EventLogView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL")

  const filtered = events.filter((e) => {
    const matchesSearch = e.message.toLowerCase().includes(searchQuery.toLowerCase()) || e.source.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = filterSeverity === "ALL" || e.severity === filterSeverity
    return matchesSearch && matchesSeverity
  })

  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Event Log
      </h1>

      {/* Filters */}
      <div className="mb-4 flex gap-3">
        <div
          className="flex flex-1 items-center rounded-lg px-3 py-2"
          style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} className="mr-2" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--text-muted)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex gap-1.5">
          {["ALL", "DEBUG", "INFO", "WARN", "ERROR", "CRITICAL"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className="rounded-md px-2.5 py-2 text-[11px] font-medium transition-all duration-150"
              style={{
                backgroundColor: filterSeverity === sev ? "rgba(124,58,237,0.1)" : "var(--surface)",
                color: filterSeverity === sev ? "var(--brand-purple)" : "var(--text-muted)",
                border: filterSeverity === sev ? "1px solid rgba(124,58,237,0.15)" : "1px solid var(--border-default)",
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Time", "Severity", "Category", "Message", "Source"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => {
              const sev = severityStyles[e.severity] ?? severityStyles.DEBUG
              return (
                <tr
                  key={e.id}
                  className="transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                  style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <td className="px-4 py-3 font-mono text-[12px]" style={{ color: "var(--text-muted)" }}>
                    {e.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold"
                      style={{ backgroundColor: sev.bg, color: sev.color }}
                    >
                      {e.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    {e.category}
                  </td>
                  <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-primary)" }}>
                    {e.message}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {e.source}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
