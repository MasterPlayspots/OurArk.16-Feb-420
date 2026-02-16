# OurArk.io Interface Struktur

## 📐 Layout-Hierarchie

```
┌─────────────────────────────────────────────────────────────────────┐
│  APP CONTAINER (3-Column Layout)                                    │
│  ┌──────────────┬─────────────────────────┬────────────────────┐   │
│  │              │                         │                    │   │
│  │  LEFT        │  MAIN CONTENT           │  RIGHT             │   │
│  │  SIDEBAR     │                         │  SIDEBAR           │   │
│  │  280px       │  Flexible               │  400px / 56px      │   │
│  │              │                         │  (Gmail-Style)     │   │
│  │              │                         │                    │   │
│  └──────────────┴─────────────────────────┴────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Komponenten-Struktur

### **Root Level**
```
app/
├── page.tsx                 # Main App Logic & State Management
├── layout.tsx               # Root Layout (minimal)
└── globals.css              # CSS Variables für Branding
```

### **Core Layout Components**
```
components/
├── app-layout.tsx           # 3-Column Grid Container (NEU)
├── sidebar.tsx              # Left Sidebar (Navigation + Conversations)
├── chat-header.tsx          # Header mit Model Selector + Right Sidebar Toggle
├── right-sidebar.tsx        # Right Sidebar Shell (Gmail-Style)
└── theme-provider.tsx       # Dark/Light Theme Management
```

### **Main Content Views** (Full-Screen Pages)
```
components/
├── chat-view.tsx            # Chat Interface (NEU - extracted from page.tsx)
│   ├── welcome-screen.tsx   # Empty State
│   ├── chat-messages.tsx    # Message List
│   └── chat-input.tsx       # Input + Send
│
├── skills-page.tsx          # Skills Management (BEHALTEN)
├── connectors-page.tsx      # Connector Settings (BEHALTEN)
├── analyse-page.tsx         # Data Analysis Tools (BEHALTEN)
├── console-dashboard.tsx    # Dev Console (BEHALTEN)
└── dark-mode-tasks.tsx      # Agent Dashboard (BEHALTEN)
```

### **Right Sidebar Tabs** (Command Center)
```
components/tabs/
├── messages-tab.tsx         # Unified Messaging (Stub)
├── calendar-tab.tsx         # Calendar Integration (Stub)
├── storage-tab.tsx          # Cloud Storage (Stub)
├── video-tab.tsx            # Video Calls (Stub)
├── browser-tab.tsx          # Browser Panel (SIMPLIFIED - kein iframe)
├── projects-tab.tsx         # Project Management (Stub)
├── agents-tab.tsx           # Agent Dashboard (Wrapper)
└── stub-tab.tsx             # Reusable Stub Component
```

### **Utility Components**
```
components/
├── ourark-logo.tsx          # Logo Component (BEHALTEN)
├── markdown-content.tsx     # Markdown Renderer (BEHALTEN)
└── ui/                      # shadcn/ui Components (28 Components)
```

### **ENTFERNT aus Sidebar**
```
❌ components/metatrons-cube.tsx     # Überall entfernt (zu ornamental)
❌ components/analyse-panel.tsx      # Redundant zu analyse-page.tsx
❌ components/skill-panel.tsx        # Moved to skills-page.tsx only
❌ components/skill-chips.tsx        # Moved to chat-input.tsx only
```

---

## 🎨 CSS Variables (Branding Layer)

### **Design Tokens** (`app/globals.css`)
```css
:root {
  /* Layout */
  --sidebar-left-width: 280px;
  --sidebar-right-width: 400px;
  --sidebar-right-mini-width: 56px;
  --header-height: 60px;

  /* Colors - Employder Branding */
  --brand-primary: #7c3aed;           /* Placeholder */
  --brand-secondary: #3b82f6;         /* Placeholder */
  --brand-accent: #10b981;            /* Placeholder */
  
  /* Neutral Colors */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --border: #e4e4e7;
  
  /* Component Colors */
  --card-bg: #ffffff;
  --card-border: #e4e4e7;
  --input-bg: #ffffff;
  --input-border: #d4d4d8;
  
  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --font-mono: 'Courier New', monospace;
  
  /* Spacing Scale */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-base: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --muted: #1a1a1a;
  --muted-foreground: #a1a1aa;
  --border: #27272a;
  --card-bg: #0a0a0a;
  --card-border: #27272a;
  --input-bg: #1a1a1a;
  --input-border: #3f3f46;
}
```

---

## 🔀 State Management

### **App-Level State** (`app/page.tsx`)
```typescript
// Core Data
models: Model[]
selectedModel: string
user: User | null
conversations: Conversation[]
currentConversationId: string | null
messages: Message[]

// UI State
currentView: AppView  // "chat" | "skills" | "connectors" | "analyse" | "dark-mode" | "console"
leftSidebarOpen: boolean
rightSidebarOpen: boolean
rightSidebarMode: "closed" | "mini" | "full"

// Feature State
skills: Skill[]
connectors: Connector[]
activeSkillId: string | null
```

### **Props Drilling** (wird vereinfacht)
```typescript
// ALT: 10+ Props pro Component
<Sidebar
  conversations={...}
  currentConversationId={...}
  user={...}
  selectedModel={...}
  models={...}
  skills={...}
  connectors={...}
  currentView={...}
  onToggleSkill={...}
  onUpdateSkill={...}
  onSelectConversation={...}
  onNewChat={...}
  onDeleteConversation={...}
  onNavigate={...}
  isOpen={...}
  onClose={...}
/>

// NEU: Context API or Minimal Props
<Sidebar
  isOpen={leftSidebarOpen}
  onClose={() => setLeftSidebarOpen(false)}
/>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (max-width: 767px) {
  /* Left Sidebar: Overlay */
  /* Right Sidebar: Bottom Sheet or Full Screen */
  /* Main Content: Full Width */
}

@media (min-width: 768px) and (max-width: 1023px) {
  /* Tablet: Left Sidebar bleibt, Right Sidebar optional */
}

@media (min-width: 1024px) {
  /* Desktop: 3-Column Layout */
  /* Left + Main immer sichtbar */
  /* Right optional */
}

@media (min-width: 1536px) {
  /* Large Desktop: Alle 3 Columns nebeneinander */
}
```

---

## ⚙️ Keyboard Shortcuts

| Shortcut | Action | Status |
|----------|--------|--------|
| `Ctrl+Shift+H` | Toggle Right Sidebar | ✅ Implementiert |
| `Ctrl+Shift+L` | Toggle Left Sidebar | – |
| `Ctrl+Shift+M` | Right Sidebar Mini Mode | – |
| `Ctrl+K` | Command Palette | – |
| `Ctrl+N` | New Chat | – |
| `Ctrl+1-6` | Switch Views | – |
| `Escape` | Close Modals/Sidebars | – |

---

## 🚫 Was wurde ENTFERNT

### **Dekorative Elemente**
- ❌ Metatron's Cube Background (in 8+ Components)
- ❌ Sacred Geometry Animations
- ❌ Ambient LED Glow Effects
- ❌ Gradient Backgrounds
- ❌ Purple Light Effects

### **Redundante Features**
- ❌ Analyse Panel in Sidebar (verwende analyse-page.tsx)
- ❌ Skill Panel in Sidebar (verwende skills-page.tsx)
- ❌ Skill Chips unter Chat Input (zu komplex)

### **Problematische Features**
- ❌ Browser-Tab iframe (CSP-Fehler, Security-Risk)
- ❌ Hardcoded API URLs (jetzt env vars)

---

## ✅ Was bleibt (Simplified)

### **Core Features**
- ✅ Chat Interface (Messages, Input, Model Selector)
- ✅ Conversations List (Left Sidebar)
- ✅ Navigation zu 6 Views
- ✅ Right Sidebar mit 7 Tabs (als Stubs)
- ✅ Skills Management (Page)
- ✅ Connectors Settings (Page)
- ✅ Data Analysis Tools (Page)
- ✅ Agent Dashboard (Page)
- ✅ Dev Console (Page)

### **Key Interactions**
- ✅ Send Message
- ✅ Switch Model
- ✅ Create New Chat
- ✅ Delete Conversation
- ✅ Navigate Between Views
- ✅ Toggle Sidebars

---

**Stand:** Februar 2026
