import { create } from "zustand"
import type {
  AppView,
  Tab,
  Conversation,
  Message,
  Agent,
  TeamMember,
} from "./types"

interface AppState {
  // Navigation
  currentView: AppView
  setCurrentView: (view: AppView) => void

  // Tabs
  tabs: Tab[]
  activeTabId: string
  setActiveTab: (id: string) => void
  addTab: (tab: Tab) => void
  closeTab: (id: string) => void

  // Sidebars
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void

  // Conversations
  conversations: Conversation[]
  currentConversationId: string | null
  setCurrentConversation: (id: string | null) => void
  addConversation: (conv: Conversation) => void
  deleteConversation: (id: string) => void

  // Messages
  messages: Message[]
  addMessage: (msg: Message) => void
  clearMessages: () => void

  // Agents
  agents: Agent[]

  // Team
  teamMembers: TeamMember[]

  // Agent Panel
  agentPanelOpen: boolean
  toggleAgentPanel: () => void

  // Navigate to internal page
  navigateTo: (view: AppView) => void
}

// Demo data
const demoConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Marketing Strategie Q2",
    lastMessage: "Ich habe die Analyse fertig...",
    timestamp: "vor 5 Min",
    model: "gpt-4o",
    unread: true,
  },
  {
    id: "conv-2",
    title: "API Integration planen",
    lastMessage: "Die Endpoints sind dokumentiert",
    timestamp: "vor 23 Min",
    model: "claude-3.5",
  },
  {
    id: "conv-3",
    title: "Support Bot Training",
    lastMessage: "Neue Trainingsdaten hinzugefugt",
    timestamp: "vor 1 Std",
    model: "gpt-4o-mini",
  },
  {
    id: "conv-4",
    title: "Produktbeschreibungen",
    lastMessage: "Batch-Verarbeitung gestartet",
    timestamp: "vor 3 Std",
    model: "claude-3.5",
  },
]

const demoAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Aria",
    status: "online",
    model: "gpt-4o",
    tasks: 3,
    description: "Content & Marketing",
  },
  {
    id: "agent-2",
    name: "Nova",
    status: "busy",
    model: "claude-3.5",
    tasks: 1,
    description: "Code Review & QA",
  },
  {
    id: "agent-3",
    name: "Atlas",
    status: "online",
    model: "gpt-4o-mini",
    tasks: 0,
    description: "Data Analysis",
  },
  {
    id: "agent-4",
    name: "Echo",
    status: "learning",
    model: "mistral-large",
    tasks: 2,
    description: "Customer Support",
  },
  {
    id: "agent-5",
    name: "Sage",
    status: "offline",
    model: "gpt-4o",
    tasks: 0,
    description: "Research & Knowledge",
  },
  {
    id: "agent-6",
    name: "Bolt",
    status: "offline",
    model: "claude-3.5",
    tasks: 0,
    description: "Automation & Workflows",
  },
]

const demoTeamMembers: TeamMember[] = [
  { id: "tm-1", name: "Noah", role: "Admin", status: "online" },
  { id: "tm-2", name: "Lena", role: "Editor", status: "online" },
  { id: "tm-3", name: "Markus", role: "Editor", status: "away" },
  { id: "tm-4", name: "Sophie", role: "Viewer", status: "offline" },
  { id: "tm-5", name: "Jonas", role: "Viewer", status: "online" },
]

const defaultTabs: Tab[] = [
  {
    id: "tab-1",
    type: "browser",
    title: "Dashboard",
    url: "ourark://dashboard",
    active: true,
  },
]

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  currentView: "dashboard",
  setCurrentView: (view) => set({ currentView: view }),

  // Tabs
  tabs: defaultTabs,
  activeTabId: "tab-1",
  setActiveTab: (id) =>
    set((state) => ({
      activeTabId: id,
      tabs: state.tabs.map((t) => ({ ...t, active: t.id === id })),
    })),
  addTab: (tab) =>
    set((state) => ({
      tabs: [...state.tabs.map((t) => ({ ...t, active: false })), tab],
      activeTabId: tab.id,
    })),
  closeTab: (id) =>
    set((state) => {
      const filtered = state.tabs.filter((t) => t.id !== id)
      if (filtered.length === 0) return state
      const wasActive = state.activeTabId === id
      if (wasActive) {
        const last = filtered[filtered.length - 1]
        return {
          tabs: filtered.map((t) => ({
            ...t,
            active: t.id === last.id,
          })),
          activeTabId: last.id,
        }
      }
      return { tabs: filtered }
    }),

  // Sidebars
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  toggleLeftSidebar: () =>
    set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  toggleRightSidebar: () =>
    set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),

  // Conversations
  conversations: demoConversations,
  currentConversationId: null,
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  addConversation: (conv) =>
    set((state) => ({
      conversations: [conv, ...state.conversations],
    })),
  deleteConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      currentConversationId:
        state.currentConversationId === id
          ? null
          : state.currentConversationId,
    })),

  // Messages
  messages: [],
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),

  // Agents
  agents: demoAgents,

  // Team
  teamMembers: demoTeamMembers,

  // Agent Panel
  agentPanelOpen: false,
  toggleAgentPanel: () =>
    set((state) => ({ agentPanelOpen: !state.agentPanelOpen })),

  // Navigate
  navigateTo: (view) => {
    const state = get()
    const viewToUrl: Record<AppView, string> = {
      chat: "ourark://chat",
      dashboard: "ourark://dashboard",
      automations: "ourark://automations",
      connectors: "ourark://connectors",
      documents: "ourark://documents",
      budgets: "ourark://budgets",
      prompts: "ourark://prompts",
      metatron: "ourark://metatron",
      eventlog: "ourark://eventlog",
      workspace: "ourark://workspace",
      telegram: "ourark://telegram",
      settings: "ourark://settings",
    }

    const viewToTitle: Record<AppView, string> = {
      chat: "Neuer Chat",
      dashboard: "Dashboard",
      automations: "Automations",
      connectors: "Connectors",
      documents: "Documents",
      budgets: "Budgets",
      prompts: "Prompts",
      metatron: "Metatron",
      eventlog: "Event Log",
      workspace: "Workspace",
      telegram: "Telegram",
      settings: "Settings",
    }

    // Check if this view already has a tab
    const existing = state.tabs.find(
      (t) => t.url === viewToUrl[view]
    )
    if (existing) {
      set({
        currentView: view,
        activeTabId: existing.id,
        tabs: state.tabs.map((t) => ({
          ...t,
          active: t.id === existing.id,
        })),
      })
    } else {
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        type: view === "chat" ? "chat" : "browser",
        title: viewToTitle[view],
        url: viewToUrl[view],
        active: true,
      }
      set({
        currentView: view,
        activeTabId: newTab.id,
        tabs: [
          ...state.tabs.map((t) => ({ ...t, active: false })),
          newTab,
        ],
      })
    }
  },
}))
