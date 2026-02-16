"use client"

import {
  Users,
  Bell,
  Bot,
  PanelRightClose,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

export default function RightSidebar() {
  const { rightSidebarOpen, toggleRightSidebar, teamMembers, agents } = useAppStore()

  if (!rightSidebarOpen) {
    return (
      <div
        className="flex h-full w-[60px] flex-col items-center py-4 glass"
        style={{ borderLeft: "1px solid var(--border-default)" }}
      >
        <button
          onClick={toggleRightSidebar}
          className="mb-4 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <PanelRightClose size={18} className="rotate-180" />
        </button>
        <div className="relative mb-3">
          <Users size={18} style={{ color: "var(--text-muted)" }} />
          <span
            className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold"
            style={{
              backgroundColor: "var(--success)",
              color: "var(--void)",
            }}
          >
            {teamMembers.filter((m) => m.status === "online").length}
          </span>
        </div>
        <div className="relative mb-3">
          <Bell size={18} style={{ color: "var(--text-muted)" }} />
          <span
            className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold"
            style={{
              backgroundColor: "var(--danger)",
              color: "#fff",
            }}
          >
            3
          </span>
        </div>
        <Bot size={18} style={{ color: "var(--text-muted)" }} />
      </div>
    )
  }

  const onlineMembers = teamMembers.filter((m) => m.status === "online")
  const offlineMembers = teamMembers.filter((m) => m.status !== "online")
  const activeAgents = agents.filter((a) => a.status === "online" || a.status === "busy")

  return (
    <div
      className="flex h-full w-[288px] flex-col glass"
      style={{ borderLeft: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Team & Actions
        </span>
        <button
          onClick={toggleRightSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "var(--text-muted)" }}
        >
          <PanelRightClose size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {/* Online Team */}
        <div className="mb-4">
          <p
            className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.05em]"
            style={{ color: "var(--text-muted)" }}
          >
            Online - {onlineMembers.length}
          </p>
          <div className="space-y-1">
            {onlineMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center rounded-lg px-3 py-2 transition-all duration-150 hover:bg-[rgba(255,255,255,0.03)]"
              >
                <div className="relative mr-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: "rgba(124, 58, 237, 0.15)",
                      color: "var(--brand-purple)",
                    }}
                  >
                    {member.name[0]}
                  </div>
                  <Circle
                    size={8}
                    fill="var(--success)"
                    className="absolute -bottom-0.5 -right-0.5"
                    style={{ color: "var(--success)" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px]" style={{ color: "var(--text-primary)" }}>
                    {member.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offline */}
        <div className="mb-4">
          <p
            className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.05em]"
            style={{ color: "var(--text-muted)" }}
          >
            Offline - {offlineMembers.length}
          </p>
          <div className="space-y-1">
            {offlineMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center rounded-lg px-3 py-2 transition-all duration-150 hover:bg-[rgba(255,255,255,0.03)]"
              >
                <div className="relative mr-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold opacity-50"
                    style={{
                      backgroundColor: "rgba(100, 116, 139, 0.15)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {member.name[0]}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] opacity-60" style={{ color: "var(--text-secondary)" }}>
                    {member.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {member.status === "away" ? "Abwesend" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Agents */}
        <div className="mb-4">
          <p
            className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.05em]"
            style={{ color: "var(--text-muted)" }}
          >
            Active Agents - {activeAgents.length}
          </p>
          <div className="space-y-1">
            {activeAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center rounded-lg px-3 py-2 transition-all duration-150 hover:bg-[rgba(255,255,255,0.03)]"
              >
                <div className="relative mr-2.5">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[11px]"
                    style={{
                      backgroundColor:
                        agent.status === "online"
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(234, 179, 8, 0.1)",
                      color: agent.status === "online" ? "var(--success)" : "var(--warning)",
                    }}
                  >
                    <Bot size={14} />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px]" style={{ color: "var(--text-primary)" }}>
                    {agent.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {agent.description} &middot; {agent.tasks} Tasks
                  </p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor:
                      agent.status === "online"
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(234, 179, 8, 0.1)",
                    color: agent.status === "online" ? "var(--success)" : "var(--warning)",
                  }}
                >
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-4">
          <p
            className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.05em]"
            style={{ color: "var(--text-muted)" }}
          >
            Notifications
          </p>
          <div className="space-y-1.5">
            {[
              { text: "Aria hat 3 Artikel fertiggestellt", time: "vor 5 Min", type: "success" as const },
              { text: "OpenRouter API: Hohe Latenz", time: "vor 12 Min", type: "warning" as const },
              { text: "Budget-Limit bei 80% erreicht", time: "vor 1 Std", type: "danger" as const },
            ].map((notif, i) => (
              <div
                key={i}
                className="rounded-lg px-3 py-2.5 transition-all duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ backgroundColor: "var(--surface)" }}
              >
                <div className="flex items-start">
                  <span
                    className="mr-2 mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        notif.type === "success"
                          ? "var(--success)"
                          : notif.type === "warning"
                            ? "var(--warning)"
                            : "var(--danger)",
                    }}
                  />
                  <div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {notif.text}
                    </p>
                    <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {notif.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
