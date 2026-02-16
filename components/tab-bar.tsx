"use client"

import { Globe, MessageSquare, X, Plus, Share2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

export default function TabBar() {
  const { tabs, activeTabId, setActiveTab, closeTab, addTab, currentView, navigateTo } = useAppStore()

  const activeTab = tabs.find((t) => t.id === activeTabId)

  const handleAddTab = () => {
    navigateTo("dashboard")
  }

  return (
    <div>
      {/* Tab strip */}
      <div
        className="flex h-[40px] items-end overflow-x-auto px-2"
        style={{
          backgroundColor: "var(--void)",
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id)
              // Parse view from URL
              const view = tab.url.replace("ourark://", "") as typeof currentView
              if (tab.url.startsWith("ourark://")) {
                useAppStore.getState().setCurrentView(view)
              }
            }}
            className={cn(
              "group relative flex h-[36px] max-w-[180px] cursor-pointer items-center rounded-t-lg px-3 transition-all duration-150",
              tab.active
                ? "bg-[var(--ground)]"
                : "hover:bg-[rgba(18,18,26,0.6)]"
            )}
          >
            {/* Active indicator */}
            {tab.active && (
              <div
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                style={{ backgroundColor: "var(--brand-purple)" }}
              />
            )}

            {/* Icon */}
            {tab.type === "browser" ? (
              <Globe
                size={13}
                className="mr-2 flex-shrink-0"
                style={{ color: tab.active ? "var(--text-primary)" : "var(--text-muted)" }}
              />
            ) : (
              <MessageSquare
                size={13}
                className="mr-2 flex-shrink-0"
                style={{ color: tab.active ? "var(--brand-purple)" : "var(--text-muted)" }}
              />
            )}

            {/* Title */}
            <span
              className="truncate text-[12px]"
              style={{ color: tab.active ? "var(--text-primary)" : "var(--text-muted)" }}
            >
              {tab.title}
            </span>

            {/* Shared icon */}
            {tab.shared && (
              <Share2 size={10} className="ml-1 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
            )}

            {/* Close button */}
            {tabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeTab(tab.id)
                }}
                className="ml-1.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded opacity-0 transition-all duration-150 hover:bg-[rgba(255,255,255,0.1)] group-hover:opacity-100"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={11} />
              </button>
            )}
          </div>
        ))}

        {/* New tab button */}
        <button
          onClick={handleAddTab}
          className="mb-1 ml-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
          style={{ color: "var(--text-muted)" }}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* URL Bar */}
      {activeTab?.type === "browser" && (
        <div
          className="flex h-[40px] items-center px-3"
          style={{
            backgroundColor: "var(--ground)",
            borderBottom: "1px solid var(--border-default)",
          }}
        >
          <div
            className="flex flex-1 items-center rounded-lg px-3 py-1.5"
            style={{
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border-default)",
            }}
          >
            {activeTab?.url.startsWith("ourark://") ? (
              <Lock size={12} className="mr-2 flex-shrink-0" style={{ color: "var(--success)" }} />
            ) : (
              <Globe size={12} className="mr-2 flex-shrink-0" style={{ color: "var(--text-muted)" }} />
            )}
            <span className="truncate text-[12px]" style={{ color: "var(--text-secondary)" }}>
              {activeTab?.url ?? ""}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
