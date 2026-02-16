"use client"

import { Send, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const commands = [
  { cmd: "/start", description: "Bot starten & Willkommensnachricht" },
  { cmd: "/help", description: "Hilfe & verfugbare Befehle" },
  { cmd: "/chat", description: "Neue Chat-Session starten" },
  { cmd: "/model", description: "AI-Modell wechseln" },
  { cmd: "/status", description: "Bot-Status & Statistiken" },
  { cmd: "/history", description: "Chat-Verlauf anzeigen" },
  { cmd: "/clear", description: "Chat-Verlauf loschen" },
  { cmd: "/settings", description: "Einstellungen anpassen" },
  { cmd: "/budget", description: "Budget-Ubersicht" },
  { cmd: "/export", description: "Chat als PDF exportieren" },
  { cmd: "/invite", description: "Team-Mitglied einladen" },
]

export default function TelegramView() {
  const [showToken, setShowToken] = useState(false)

  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Telegram Bot
      </h1>

      {/* Bot Config */}
      <div
        className="mb-8 rounded-xl p-5"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "var(--brand-indigo)" }}
          >
            <Send size={20} />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>OurArk Bot</h3>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>@ourark_ai_bot</p>
          </div>
          <span
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: "rgba(34,197,94,0.1)", color: "var(--success)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            Online
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
              Bot Token
            </label>
            <div className="flex items-center gap-2">
              <code
                className="flex-1 rounded-md px-3 py-2 font-mono text-[12px]"
                style={{ backgroundColor: "var(--elevated)", color: "var(--text-secondary)" }}
              >
                {showToken ? "7234567890:AAF1kL3..." : "••••••••••:•••••••..."}
              </code>
              <button
                onClick={() => setShowToken(!showToken)}
                className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-150 hover:bg-[rgba(255,255,255,0.05)]"
                style={{ color: "var(--text-muted)" }}
              >
                {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
              Webhook URL
            </label>
            <code
              className="block rounded-md px-3 py-2 font-mono text-[12px]"
              style={{ backgroundColor: "var(--elevated)", color: "var(--text-secondary)" }}
            >
              https://ourark.io/api/telegram/webhook
            </code>
          </div>
        </div>
      </div>

      {/* Commands */}
      <h2 className="mb-3 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
        Bot Commands
      </h2>
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Command", "Description"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commands.map((c) => (
              <tr
                key={c.cmd}
                className="transition-colors duration-150 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <td className="px-4 py-3">
                  <code className="rounded-md px-2 py-0.5 font-mono text-[12px]" style={{ backgroundColor: "var(--elevated)", color: "var(--brand-purple)" }}>
                    {c.cmd}
                  </code>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  {c.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
