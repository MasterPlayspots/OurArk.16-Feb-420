"use client"

import {
  MessageSquare,
  Coins,
  DollarSign,
  Bot,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Zap,
  Plug,
  FileText,
  DollarSign as Dollar,
  BookTemplate,
  Hexagon,
  ScrollText,
  Users,
  Send,
  Settings,
  Search,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import type { AppView } from "@/lib/types"

const kpis = [
  {
    label: "Gesprache",
    value: "23",
    trend: 5,
    trendLabel: "+5 heute",
    icon: "MessageSquare",
    color: "var(--brand-purple)",
    bg: "rgba(124, 58, 237, 0.1)",
  },
  {
    label: "Tokens",
    value: "1.2M",
    trend: 12,
    trendLabel: "+12% diese Woche",
    icon: "Coins",
    color: "var(--info)",
    bg: "rgba(6, 182, 212, 0.1)",
  },
  {
    label: "Kosten",
    value: "\u20AC4.82",
    trend: -8,
    trendLabel: "-8% vs gestern",
    icon: "DollarSign",
    color: "var(--success)",
    bg: "rgba(34, 197, 94, 0.1)",
  },
  {
    label: "Bots",
    value: "4/6",
    trend: 0,
    trendLabel: "4 aktiv",
    icon: "Bot",
    color: "var(--warning)",
    bg: "rgba(234, 179, 8, 0.1)",
  },
]

const quicklinks: { id: AppView; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, color: "var(--brand-purple)", bg: "rgba(124,58,237,0.1)" },
  { id: "chat", label: "Neuer Chat", icon: <MessageSquare size={18} />, color: "var(--brand-indigo)", bg: "rgba(99,102,241,0.1)" },
  { id: "automations", label: "Automations", icon: <Zap size={18} />, color: "var(--warning)", bg: "rgba(234,179,8,0.1)" },
  { id: "connectors", label: "Connectors", icon: <Plug size={18} />, color: "var(--success)", bg: "rgba(34,197,94,0.1)" },
  { id: "documents", label: "Documents", icon: <FileText size={18} />, color: "var(--info)", bg: "rgba(6,182,212,0.1)" },
  { id: "budgets", label: "Budgets", icon: <Dollar size={18} />, color: "var(--success)", bg: "rgba(34,197,94,0.1)" },
  { id: "prompts", label: "Prompts", icon: <BookTemplate size={18} />, color: "var(--brand-purple)", bg: "rgba(124,58,237,0.1)" },
  { id: "metatron", label: "Metatron", icon: <Hexagon size={18} />, color: "var(--brand-indigo)", bg: "rgba(99,102,241,0.1)" },
  { id: "eventlog", label: "Event Log", icon: <ScrollText size={18} />, color: "var(--text-muted)", bg: "rgba(100,116,139,0.1)" },
  { id: "workspace", label: "Team", icon: <Users size={18} />, color: "var(--info)", bg: "rgba(6,182,212,0.1)" },
  { id: "telegram", label: "Telegram", icon: <Send size={18} />, color: "var(--brand-indigo)", bg: "rgba(99,102,241,0.1)" },
  { id: "settings", label: "Settings", icon: <Settings size={18} />, color: "var(--text-muted)", bg: "rgba(100,116,139,0.1)" },
]

function KPIIcon({ name, size = 20 }: { name: string; size?: number }) {
  switch (name) {
    case "MessageSquare": return <MessageSquare size={size} />
    case "Coins": return <Coins size={size} />
    case "DollarSign": return <DollarSign size={size} />
    case "Bot": return <Bot size={size} />
    default: return <LayoutDashboard size={size} />
  }
}

export default function DashboardView() {
  const { navigateTo } = useAppStore()

  const now = new Date()
  const dateStr = now.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.02em]" style={{ color: "var(--text-primary)" }}>
          {"Willkommen zuruck, Noah"}
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "var(--text-muted)" }}>
          {dateStr}
        </p>
      </div>

      {/* KPIs */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl p-5 transition-all duration-200 hover:-translate-y-px"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: kpi.bg, color: kpi.color }}
              >
                <KPIIcon name={kpi.icon} size={18} />
              </div>
              {kpi.trend !== 0 && (
                <div
                  className="flex items-center text-[12px] font-medium animate-fade-slide-in"
                  style={{
                    color: kpi.trend > 0 ? "var(--success)" : "var(--danger)",
                    animationDelay: `${i * 100 + 400}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  {kpi.trend > 0 ? <TrendingUp size={13} className="mr-1" /> : <TrendingDown size={13} className="mr-1" />}
                  {kpi.trendLabel}
                </div>
              )}
            </div>
            <p className="text-[24px] font-bold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
              {kpi.value}
            </p>
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
              {kpi.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quicklinks */}
      <div>
        <h2 className="mb-4 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Schnellzugriff
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quicklinks.map((link) => (
            <button
              key={link.id}
              onClick={() => navigateTo(link.id)}
              className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:-translate-y-px active:scale-[0.97]"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div
                className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: link.bg, color: link.color }}
              >
                {link.icon}
              </div>
              <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
                {link.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
