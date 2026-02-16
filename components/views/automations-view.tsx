"use client"

import { Zap, Clock, GitBranch, Webhook, Calendar, Play } from "lucide-react"
import type { Automation } from "@/lib/types"

const stats = [
  { label: "Active", value: 5, color: "var(--success)" },
  { label: "Paused", value: 1, color: "var(--warning)" },
  { label: "Errors", value: 0, color: "var(--danger)" },
  { label: "Total Runs", value: 847, color: "var(--info)" },
]

const automations: Automation[] = [
  { id: "a1", name: "Daily Content Generation", trigger: "Cron", status: "Active", lastRun: "vor 2 Std", runs: 342 },
  { id: "a2", name: "Support Ticket Routing", trigger: "Condition", status: "Active", lastRun: "vor 15 Min", runs: 186 },
  { id: "a3", name: "API Webhook Handler", trigger: "Webhook", status: "Active", lastRun: "vor 1 Min", runs: 89 },
  { id: "a4", name: "New User Onboarding", trigger: "Event", status: "Active", lastRun: "vor 45 Min", runs: 67 },
  { id: "a5", name: "Report Generator", trigger: "Manual", status: "Paused", lastRun: "vor 3 Tagen", runs: 163 },
]

function TriggerIcon({ trigger }: { trigger: Automation["trigger"] }) {
  switch (trigger) {
    case "Cron": return <Clock size={13} />
    case "Condition": return <GitBranch size={13} />
    case "Webhook": return <Webhook size={13} />
    case "Event": return <Zap size={13} />
    case "Manual": return <Play size={13} />
  }
}

export default function AutomationsView() {
  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Automations
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
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                Workflow
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                Trigger
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                Status
              </th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                Last Run
              </th>
              <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                Runs
              </th>
            </tr>
          </thead>
          <tbody>
            {automations.map((a) => (
              <tr
                key={a.id}
                className="transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <td className="px-4 py-3">
                  <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {a.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium"
                    style={{ backgroundColor: "rgba(100,116,139,0.1)", color: "var(--text-secondary)" }}
                  >
                    <TriggerIcon trigger={a.trigger} />
                    {a.trigger}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                    style={{
                      backgroundColor: a.status === "Active" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                      color: a.status === "Active" ? "var(--success)" : "var(--warning)",
                    }}
                  >
                    {a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {a.lastRun}
                </td>
                <td className="px-4 py-3 text-right text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {a.runs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
