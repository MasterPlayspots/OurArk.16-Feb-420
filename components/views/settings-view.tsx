"use client"

import { Settings, Globe, Bell, Shield, Palette } from "lucide-react"

export default function SettingsView() {
  const sections = [
    {
      title: "Allgemein",
      icon: <Settings size={16} />,
      items: [
        { label: "Sprache", value: "Deutsch" },
        { label: "Zeitzone", value: "Europe/Berlin (CET)" },
        { label: "Datumsformat", value: "DD.MM.YYYY" },
      ],
    },
    {
      title: "Benachrichtigungen",
      icon: <Bell size={16} />,
      items: [
        { label: "E-Mail Notifications", value: "Aktiviert" },
        { label: "Desktop Notifications", value: "Deaktiviert" },
        { label: "Agent-Alerts", value: "Nur Fehler" },
      ],
    },
    {
      title: "Sicherheit",
      icon: <Shield size={16} />,
      items: [
        { label: "2-Faktor-Auth", value: "Aktiviert" },
        { label: "Session Timeout", value: "30 Minuten" },
        { label: "IP Whitelist", value: "Nicht konfiguriert" },
      ],
    },
    {
      title: "Erscheinungsbild",
      icon: <Palette size={16} />,
      items: [
        { label: "Theme", value: "Dark" },
        { label: "Sidebar Position", value: "Links" },
        { label: "Kompakte Ansicht", value: "Deaktiviert" },
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Settings
      </h1>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span style={{ color: "var(--text-muted)" }}>{section.icon}</span>
              <h2 className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {section.title}
              </h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg px-4 py-3"
                  style={{ backgroundColor: "var(--elevated)" }}
                >
                  <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                    {item.label}
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
