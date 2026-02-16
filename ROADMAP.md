# 🗺️ OurArk.io – Roadmap

**Stand:** Februar 2026  
**Version:** 0.1.0 (Pre-Production)

---

## 📊 Aktueller Status

**Production-Readiness:** ~85%  
**Security-Score:** 8/10  
**Test-Coverage:** ~82% (62 Tests, 3 Suites)

---

## 🔴 P0 – Vor Production-Launch

### Backend & Security
- [ ] Backend-Credential-Storage Migration (Cloudflare KV mit Encryption statt localStorage)
- [ ] API-Route Integration-Tests (Chat, Conversations Endpoints)
- [ ] npm audit – Radix UI Dependency-Updates (Minor/Patch)

### Testing
- [ ] E2E-Tests mit Playwright für kritische User-Flows
- [ ] Component-Tests für UI-Komponenten
- [ ] Performance-Tests (Load-Testing für Rate-Limiting)

---

## 🟠 P1 – Sprint 1 (1-2 Wochen)

### Code-Refactoring
- [ ] SPLIT `console-dashboard.tsx` (1.440 LOC → 4× ~350 LOC)
- [ ] SPLIT `analyse-page.tsx` (1.339 LOC → 3× ~450 LOC)
- [ ] SPLIT `skills-page.tsx` (1.329 LOC → 3× ~450 LOC)
- [ ] Shared `PageLayout` Component extrahieren (-120 LOC)
- [ ] Shared Icon-Map extrahieren (-80 LOC)

### State-Management
- [ ] Zustand für Global State einführen (User, Skills, Connectors)
- [ ] State-Persistence bei Browser-Refresh
- [ ] Props-Drilling durch Context API reduzieren

### API-Optimierung
- [ ] Conversations-Cache (localStorage, -60% API-Calls)
- [ ] Debounce Conversation-Updates (5s)

### UI-Komponenten (v0.dev)
- [ ] Error-Boundary Component (graceful Error-Handling)
- [ ] Loading-Skeletons (Chat, Sidebar, Models)
- [ ] Toast-Notification-System (Sonner Integration)
- [ ] Empty-State Components (Chat, Conversations, Skills, Connectors)
- [ ] Confirmation-Dialog für Delete-Aktionen
- [ ] Verbesserter Model-Selector Dropdown

---

## 🟡 P2 – Sprint 2 (2-4 Wochen)

### Feature-Completion
- [ ] Agent-Orchestrator TODOs implementieren:
  - [ ] Skill-Execution Pipeline
  - [ ] Data-Processing Pipeline
  - [ ] File-Organization Logic
- [ ] OAuth Connector-Aktivierung
- [ ] Real Browser-Automation (Puppeteer/Playwright)
- [ ] Real-time Task-Monitoring

### Performance
- [ ] Bundle-Size-Optimierung (Tree-Shaking, Code-Splitting)
- [ ] Dynamic Imports für Skills/Analyse/Console Pages (-60 KB)
- [ ] Individual Lucide-Icon Imports (-30 KB)
- [ ] Streaming-Response-Caching (Duplicate Prevention)

### UI-Verbesserungen
- [ ] Command-Palette (Cmd+K) mit cmdk
- [ ] Chat-Input Enhancements (Multiline, Shortcuts, Auto-Resize)
- [ ] Conversation-Sidebar: Suche, Datum-Gruppen, Quick-Actions
- [ ] Settings-Page mit Tabs (General, API, Connectors, Advanced)

---

## 🟢 P3 – Langfristig (1-3 Monate)

### Internationalisierung
- [ ] i18n-Support mit next-intl (Deutsch/Englisch)
- [ ] UI-String-Externalisierung

### Developer Experience
- [ ] Storybook für UI-Components
- [ ] Component-Templates (Plop.js Generators)
- [ ] Component-Library-Dokumentation

### Infrastruktur
- [ ] Prompt-Compression (30% Token-Reduktion)
- [ ] Response-Caching via Cloudflare KV
- [ ] WebWorker für Orchestrator
- [ ] Service-Worker für Offline-Support

### Backend (n8n + Cloudflare)
- [ ] n8n Workflow-Integration für Backend-Automatisierung
- [ ] Cloudflare D1 Database-Schema (Users, Conversations, Messages, Skills)
- [ ] Scheduled Database-Cleanup (90-Tage Retention)
- [ ] User-Data-Export Workflow

### UI-Polish
- [ ] Framer-Motion für Tab-Transitions
- [ ] Chat-Message-Animationen (Typing-Indicator)
- [ ] Right-Sidebar Responsive (Mobile: Full-Screen-Overlay)
- [ ] Accessibility (ARIA, Keyboard-Navigation)
- [ ] Lighthouse-Audit & Fixes

---

## 💰 Erwartete Verbesserungen

| Metrik | Aktuell | Nach P1 | Nach P2 |
|--------|---------|---------|---------|
| **LOC** | ~11.400 | ~9.800 | ~9.500 |
| **Bundle-Size** | ~380 KB | ~300 KB | ~225 KB |
| **API-Calls/Tag** | ~100 | ~40 | ~30 |
| **Test-Coverage** | 82% | 85% | 90% |
| **Production-Ready** | 85% | 90% | 95% |

---

**Zuletzt aktualisiert:** Februar 2026
