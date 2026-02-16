# OurArk.io

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🎯 Overview

OurArk is an intelligent AI workspace platform with integrated BrowserOS functionality and a 3-tier architecture for autonomous agent execution. It provides a sophisticated interface for interacting with multiple AI models, managing skills, and orchestrating automated tasks.

## 🏗️ Architecture

### Tier 1: Frontend (Light Mode)
- **Purpose:** User-facing interface for human interaction
- **Features:** Chat UI, Skills Builder, Connectors, Dashboards
- **Technology:** Next.js 16, React 19, Tailwind CSS
- **Directory:** `app/`, `components/`

### Tier 2: Agents (Dark Mode)
- **Purpose:** Autonomous task execution in the background
- **Features:** 
  - BrowserOS Integration (automatic web navigation)
  - Automated research & data collection
  - Skill execution pipeline
  - Task orchestration
- **Technology:** TypeScript Agents, Browser Automation
- **Directory:** `lib/agents/`

### Tier 3: Backend (Pure Code)
- **Purpose:** Server-side logic & data processing
- **Features:** API Routes, Model Orchestration, Worker Tasks
- **Technology:** Next.js API Routes, Cloudflare Workers
- **Directory:** `app/api/`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm 10.7.0 or higher (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MasterPlayspots/ourark.io.git
cd ourark.io

# Install dependencies
pnpm install
# or
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and configuration

# Start development server
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Create production build
pnpm build

# Start production server
pnpm start

# Analyze bundle size
pnpm analyze
```

## 🔑 Environment Variables

Create a `.env.local` file in the root directory (see `.env.example` for template):

```env
# API Configuration (Server-only - NOT exposed to client)
API_UPSTREAM=https://cf-ai-workspace.ourark.workers.dev

# OpenRouter API Key
# Get your key from: https://openrouter.ai/keys
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Upstash Redis (for Rate Limiting)
# Get from: https://console.upstash.com
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Optional: Override upstream URL for development
# API_UPSTREAM=http://localhost:8787
```

### Required Environment Variables

- `OPENROUTER_API_KEY`: Your OpenRouter API key for AI model access
- `UPSTASH_REDIS_REST_URL`: Upstash Redis URL for rate limiting
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis authentication token

### Optional Environment Variables

- `API_UPSTREAM`: Override the default API upstream URL (useful for local development)

## 📦 Features

- **Multi-Model Chat Interface** – Interact with various AI models via OpenRouter
- **Conversation Management** – Create, load, and delete chat histories
- **Skills System** – Multi-step execution pipelines (UI ready, execution stubbed)
- **Connectors Framework** – Integration with external services (settings UI, OAuth pending)
- **3-Tier Architecture** – Clean separation of concerns (Frontend / Agents / Backend)
- **Dark Mode Tasks** – Agent dashboard UI for autonomous task execution
- **BrowserOS Integration** – Orchestrator stubbed for automated web research
- **Security Hardening** – CORS, Rate-Limiting (Upstash), CSP, AES-256-GCM credential encryption
- **Input Validation** – Zod schemas for all API request bodies
- **Testing** – 62 tests passing (~82% coverage) with Vitest
- **CI/CD** – GitHub Actions pipeline (lint, typecheck, test, build)

## 🛠️ Agent System

The agent system enables autonomous task execution across multiple domains.

### Task Types

- `browser-automation` - Navigate, scrape, and interact with web pages
- `research` - Automated information gathering and analysis
- `data-processing` - Data transformation and processing pipelines
- `skill-execution` - Multi-step skill pipelines
- `file-organization` - Automated file management
- `api-integration` - Connector synchronization and API calls

### Usage Example

```typescript
import { taskOrchestrator } from "@/lib/agents/orchestrator";

// Create a research task
const task = taskOrchestrator.createTask(
  "research",
  "Research current AI developments",
  {
    darkMode: true,
    autonomous: true,
  }
);

// Monitor task completion
taskOrchestrator.onComplete((task) => {
  console.log("Task completed:", task.result);
});
```

## 📁 Project Structure

```
ourark.io/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes (Backend Layer)
│   │   ├── chat/               # Chat endpoints
│   │   ├── conversations/      # Conversation management
│   │   └── models/             # Model configuration
│   ├── globals.css             # Global styles and CSS variables
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main application
│
├── components/                  # React Components (Frontend Layer)
│   ├── tabs/                   # Right sidebar tab components
│   │   ├── agents-tab.tsx     # Agent dashboard
│   │   ├── browser-tab.tsx    # Browser panel
│   │   ├── calendar-tab.tsx   # Calendar integration
│   │   ├── messages-tab.tsx   # Unified messaging
│   │   └── ...                # Other tabs
│   ├── ui/                     # shadcn/ui components
│   ├── chat-*.tsx              # Chat-related components
│   ├── sidebar.tsx             # Left sidebar navigation
│   ├── right-sidebar.tsx       # Right sidebar shell
│   ├── skills-page.tsx         # Skills management
│   ├── connectors-page.tsx     # Connector settings
│   ├── analyse-page.tsx        # Data analysis tools
│   ├── dark-mode-tasks.tsx     # Agent dashboard
│   └── console-dashboard.tsx   # Developer console
│
├── lib/                         # Shared Libraries
│   ├── agents/                 # Agent System (Agent Layer)
│   │   ├── browser-agent.ts   # Browser automation
│   │   └── orchestrator.ts    # Task orchestration
│   ├── architecture.ts         # 3-tier architecture definitions
│   ├── skills.ts               # Skills system
│   └── types.ts                # TypeScript type definitions
│
├── hooks/                       # Custom React hooks
├── styles/                      # Additional styles
├── public/                      # Static assets
├── test/                        # Test files
│
├── .env.example                # Environment variables template
├── .env.local                  # Local environment (gitignored)
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
└── tailwind.config.ts          # Tailwind CSS configuration
```

See [STRUCTURE.md](STRUCTURE.md) for detailed interface structure documentation.

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript type checking

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Generate coverage report

# Analysis
pnpm analyze          # Analyze bundle size
```

### Testing

The project uses [Vitest](https://vitest.dev/) for unit testing with React Testing Library.

```bash
# Run all tests
pnpm test:run

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Linting and Type Checking

```bash
# Check for linting errors
pnpm lint

# Check TypeScript types
pnpm typecheck
```

## 🎨 Design System

- **Dark Mode First:** Optimized for extended work sessions
- **LED Indicators:** Live status displays
- **Responsive:** Mobile-first design approach
- **Component Library:** Built with shadcn/ui and Radix UI
- **Styling:** Tailwind CSS with custom design tokens

### Design Tokens

The application uses CSS variables for consistent theming. Key variables are defined in `app/globals.css`:

- Layout dimensions (sidebar widths, header height)
- Brand colors (customizable for different deployments)
- Neutral colors (background, foreground, borders)
- Spacing scale
- Border radius
- Shadows and transitions

See [STRUCTURE.md](STRUCTURE.md) for complete CSS variable documentation.

## 🔒 Security

- ✅ Server-only environment variables (no `NEXT_PUBLIC_` for API keys)
- ✅ AES-256-GCM credential encryption (master key in sessionStorage)
- ✅ TypeScript strict mode enabled
- ✅ Input validation using Zod schemas
- ✅ CORS headers (allowed origins: ourark.io, localhost, Vercel previews)
- ✅ Rate limiting with Upstash Redis (10 req/10s chat, 30 req/60s API)
- ✅ Content Security Policy (CSP) headers
- ✅ Security headers (X-Frame-Options, HSTS, X-Content-Type-Options)

**Security Score:** 8/10

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## 📊 Performance

- **React 19 Server Components** - Improved server-side rendering
- **Next.js 16 App Router** - Enhanced routing and caching
- **Optimized Bundle Size** - Code splitting and tree shaking
- **Lazy Loading** - Components loaded on demand
- **Bundle Analysis** - Use `pnpm analyze` to inspect bundle size

## 🗂️ Documentation

- [STRUCTURE.md](STRUCTURE.md) – Interface and component structure
- [SECURITY.md](SECURITY.md) – Security implementation and guidelines
- [ROADMAP.md](ROADMAP.md) – Future plans and development roadmap

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   gh repo fork MasterPlayspots/ourark.io
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Run tests and linting**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test:run
   ```

5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues
   - Ensure CI checks pass

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Environment variables not loading**
- Ensure `.env.local` exists in the root directory
- Restart the development server after changing environment variables

**Type errors**
```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Framework:** [Next.js](https://nextjs.org/) by Vercel
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **AI Models:** [OpenRouter](https://openrouter.ai/)
- **Rate Limiting:** [Upstash Redis](https://upstash.com/)

## 🔗 Links

- [Repository](https://github.com/MasterPlayspots/ourark.io)
- [Documentation](https://github.com/MasterPlayspots/ourark.io/tree/main)
- [Issues](https://github.com/MasterPlayspots/ourark.io/issues)
- [Pull Requests](https://github.com/MasterPlayspots/ourark.io/pulls)

---

**Built with ❤️ for autonomous AI workflows**
