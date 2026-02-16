"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  MessageSquare,
  LayoutDashboard,
  Zap,
  Plug,
  FileText,
  DollarSign,
  BookTemplate,
  Hexagon,
  ScrollText,
  Users,
  Send,
  Settings,
  ChevronDown,
  ChevronRight,
  Trash2,
  PanelLeftClose,
  Bot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import type { AppView } from "@/lib/types"

interface NavItem {
  id: AppView
  label: string
  icon: React.ReactNode
}

const navSections: { title: string; defaultOpen: boolean; items: NavItem[] }[] = [
  {
    title: "Conversations",
    defaultOpen: true,
    items: [],
  },
  {
    title: "Agents",
    defaultOpen: true,
    items: [],
  },
  {
    title: "Workspace",
    defaultOpen: false,
    items: [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
      { id: "automations", label: "Automations", icon: <Zap size={16} /> },
      { id: "connectors", label: "Connectors", icon: <Plug size={16} /> },
      { id: "documents", label: "Documents", icon: <FileText size={16} /> },
      { id: "budgets", label: "Budgets", icon: <DollarSign size={16} /> },
      { id: "prompts", label: "Prompts", icon: <BookTemplate size={16} /> },
    ],
  },
  {
    title: "System",
    defaultOpen: false,
    items: [
      { id: "metatron", label: "Metatron", icon: <Hexagon size={16} /> },
      { id: "eventlog", label: "Event Log", icon: <ScrollText size={16} /> },
      { id: "workspace", label: "Team", icon: <Users size={16} /> },
      { id: "telegram", label: "Telegram", icon: <Send size={16} /> },
      { id: "settings", label: "Settings", icon: <Settings size={16} /> },
    ],
  },
]

function SidebarSection({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] transition-colors duration-150"
        style={{ color: "var(--text-muted)" }}
      >
        {open ? <ChevronDown size={12} className="mr-1.5" /> : <ChevronRight size={12} className="mr-1.5" />}
        {title}
      </button>
      {open && <div className="mt-0.5">{children}</div>}
    </div>
  )
}

export default function LeftSidebar() {
  const {
    leftSidebarOpen,
    toggleLeftSidebar,
    currentView,
    navigateTo,
    conversations,
    currentConversationId,
    setCurrentConversation,
    deleteConversation,
    agents,
  } = useAppStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredConv, setHoveredConv] = useState<string | null>(null)

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!leftSidebarOpen) {
    return (
      <div
        className="flex h-full w-[60px] flex-col items-center py-4 glass"
        style={{ borderRight: "1px solid var(--border-default)" }}
      >
        <button
          onClick={toggleLeftSidebar}
          className="mb-4 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <PanelLeftClose size={18} className="rotate-180" />
        </button>
        <button
          onClick={() => navigateTo("dashboard")}
          className={cn(
            "mb-2 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150",
            currentView === "dashboard"
              ? "bg-[rgba(124,58,237,0.1)]"
              : "hover:bg-[rgba(255,255,255,0.05)]"
          )}
          style={{ color: currentView === "dashboard" ? "var(--brand-purple)" : "var(--text-secondary)" }}
        >
          <LayoutDashboard size={18} />
        </button>
        <button
          onClick={() => navigateTo("chat")}
          className={cn(
            "mb-2 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150",
            currentView === "chat"
              ? "bg-[rgba(124,58,237,0.1)]"
              : "hover:bg-[rgba(255,255,255,0.05)]"
          )}
          style={{ color: currentView === "chat" ? "var(--brand-purple)" : "var(--text-secondary)" }}
        >
          <MessageSquare size={18} />
        </button>
        <button
          onClick={() => navigateTo("automations")}
          className={cn(
            "mb-2 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150",
            currentView === "automations"
              ? "bg-[rgba(124,58,237,0.1)]"
              : "hover:bg-[rgba(255,255,255,0.05)]"
          )}
          style={{ color: currentView === "automations" ? "var(--brand-purple)" : "var(--text-secondary)" }}
        >
          <Zap size={18} />
        </button>
        <button
          onClick={() => navigateTo("connectors")}
          className={cn(
            "mb-2 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150",
            currentView === "connectors"
              ? "bg-[rgba(124,58,237,0.1)]"
              : "hover:bg-[rgba(255,255,255,0.05)]"
          )}
          style={{ color: currentView === "connectors" ? "var(--brand-purple)" : "var(--text-secondary)" }}
        >
          <Plug size={18} />
        </button>
        <button
          onClick={() => navigateTo("metatron")}
          className={cn(
            "mb-2 flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150",
            currentView === "metatron"
              ? "bg-[rgba(124,58,237,0.1)]"
              : "hover:bg-[rgba(255,255,255,0.05)]"
          )}
          style={{ color: currentView === "metatron" ? "var(--brand-purple)" : "var(--text-secondary)" }}
        >
          <Hexagon size={18} />
        </button>
      </div>
    )
  }

  return (
    <div
      className="flex h-full w-[260px] flex-col glass"
      style={{ borderRight: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <Hexagon size={20} style={{ color: "var(--brand-purple)" }} className="mr-2" />
          <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
            OurArk
          </span>
        </div>
        <button
          onClick={toggleLeftSidebar}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "var(--text-muted)" }}
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div
          className="flex items-center rounded-lg px-3 py-2 transition-all duration-200"
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border-default)",
          }}
        >
          <Search size={14} style={{ color: "var(--text-muted)" }} className="mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--text-muted)]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => {
            navigateTo("chat")
            setCurrentConversation(null)
          }}
          className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 active:scale-[0.97]"
          style={{
            backgroundColor: "rgba(124, 58, 237, 0.12)",
            color: "var(--brand-purple)",
            border: "1px solid rgba(124, 58, 237, 0.15)",
          }}
        >
          <Plus size={15} className="mr-1.5" />
          Neuer Chat
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-1.5">
        {/* Conversations */}
        <SidebarSection title="Conversations" defaultOpen={true}>
          <div className="space-y-0.5">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onMouseEnter={() => setHoveredConv(conv.id)}
                onMouseLeave={() => setHoveredConv(null)}
                onClick={() => {
                  setCurrentConversation(conv.id)
                  navigateTo("chat")
                }}
                className={cn(
                  "group relative flex cursor-pointer items-center rounded-lg px-3 py-2 transition-all duration-150",
                  currentConversationId === conv.id
                    ? "border-l-2"
                    : "border-l-2 border-transparent hover:bg-[rgba(255,255,255,0.03)]"
                )}
                style={
                  currentConversationId === conv.id
                    ? {
                        backgroundColor: "rgba(124, 58, 237, 0.1)",
                        borderLeftColor: "var(--brand-purple)",
                      }
                    : undefined
                }
              >
                <MessageSquare
                  size={14}
                  className="mr-2.5 flex-shrink-0"
                  style={{
                    color:
                      currentConversationId === conv.id
                        ? "var(--brand-purple)"
                        : "var(--text-muted)",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate text-[13px] font-medium"
                    style={{
                      color:
                        currentConversationId === conv.id
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {conv.title}
                  </p>
                  <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {conv.timestamp}
                  </p>
                </div>
                {conv.unread && (
                  <span
                    className="ml-2 h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: "var(--brand-purple)" }}
                  />
                )}
                {hoveredConv === conv.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteConversation(conv.id)
                    }}
                    className="ml-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded transition-colors duration-150 hover:bg-[rgba(239,68,68,0.1)]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </SidebarSection>

        {/* Agents */}
        <SidebarSection title="Agents" defaultOpen={true}>
          <div className="space-y-0.5">
            {agents.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                className="flex cursor-pointer items-center rounded-lg px-3 py-2 transition-all duration-150 hover:bg-[rgba(255,255,255,0.03)]"
              >
                <div className="relative mr-2.5 flex-shrink-0">
                  <Bot size={14} style={{ color: "var(--text-muted)" }} />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border"
                    style={{
                      backgroundColor:
                        agent.status === "online"
                          ? "var(--success)"
                          : agent.status === "busy"
                            ? "var(--warning)"
                            : agent.status === "learning"
                              ? "var(--info)"
                              : "var(--text-muted)",
                      borderColor: "var(--ground)",
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    {agent.name}
                  </p>
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color:
                      agent.status === "online"
                        ? "var(--success)"
                        : agent.status === "busy"
                          ? "var(--warning)"
                          : "var(--text-muted)",
                  }}
                >
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </SidebarSection>

        {/* Nav sections */}
        {navSections.slice(2).map((section) => (
          <SidebarSection key={section.title} title={section.title} defaultOpen={section.defaultOpen}>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-[13px] transition-all duration-150",
                    currentView === item.id
                      ? "border-l-2 font-medium"
                      : "border-l-2 border-transparent hover:bg-[rgba(255,255,255,0.03)]"
                  )}
                  style={
                    currentView === item.id
                      ? {
                          backgroundColor: "rgba(124, 58, 237, 0.1)",
                          borderLeftColor: "var(--brand-purple)",
                          color: "var(--text-primary)",
                        }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  <span className="mr-2.5">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </SidebarSection>
        ))}
      </div>

      {/* User section */}
      <div
        className="flex items-center px-4 py-3"
        style={{ borderTop: "1px solid var(--border-default)" }}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold"
          style={{
            backgroundColor: "rgba(124, 58, 237, 0.15)",
            color: "var(--brand-purple)",
          }}
        >
          N
        </div>
        <div className="ml-2.5 min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
            Noah
          </p>
          <p className="truncate text-[11px]" style={{ color: "var(--text-muted)" }}>
            Admin
          </p>
        </div>
        <button
          onClick={() => navigateTo("settings")}
          className="flex h-7 w-7 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "var(--text-muted)" }}
        >
          <Settings size={14} />
        </button>
      </div>
    </div>
  )
}
