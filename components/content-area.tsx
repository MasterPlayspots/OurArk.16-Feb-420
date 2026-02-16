"use client"

import { useAppStore } from "@/lib/store"
import TabBar from "./tab-bar"
import AgentPanel from "./agent-panel"
import DashboardView from "./views/dashboard-view"
import AutomationsView from "./views/automations-view"
import ConnectorsView from "./views/connectors-view"
import DocumentsView from "./views/documents-view"
import BudgetsView from "./views/budgets-view"
import PromptsView from "./views/prompts-view"
import MetatronView from "./views/metatron-view"
import EventLogView from "./views/eventlog-view"
import WorkspaceView from "./views/workspace-view"
import TelegramView from "./views/telegram-view"
import SettingsView from "./views/settings-view"
import ChatView from "./views/chat-view"

function ViewRouter() {
  const { currentView } = useAppStore()

  switch (currentView) {
    case "dashboard":
      return <DashboardView />
    case "automations":
      return <AutomationsView />
    case "connectors":
      return <ConnectorsView />
    case "documents":
      return <DocumentsView />
    case "budgets":
      return <BudgetsView />
    case "prompts":
      return <PromptsView />
    case "metatron":
      return <MetatronView />
    case "eventlog":
      return <EventLogView />
    case "workspace":
      return <WorkspaceView />
    case "telegram":
      return <TelegramView />
    case "settings":
      return <SettingsView />
    case "chat":
      return <ChatView />
    default:
      return <DashboardView />
  }
}

export default function ContentArea() {
  const { currentView } = useAppStore()
  const showTabBar = currentView !== "chat"

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden" style={{ backgroundColor: "var(--ground)" }}>
      <TabBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ViewRouter />
        </div>
        <AgentPanel />
      </div>
    </div>
  )
}
