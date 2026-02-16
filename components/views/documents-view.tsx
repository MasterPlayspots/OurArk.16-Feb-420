"use client"

import { FileText, Loader2, CheckCircle2, XCircle } from "lucide-react"

const collections = [
  { name: "Wissensbasis", docs: 48, size: "2.4 GB", progress: 92 },
  { name: "Support-Tickets", docs: 156, size: "890 MB", progress: 78 },
  { name: "Produkt-Docs", docs: 23, size: "340 MB", progress: 100 },
]

const documents = [
  { id: "d1", name: "Onboarding Guide v3.pdf", collection: "Wissensbasis", status: "Ready" as const, size: "4.2 MB", updated: "vor 2 Std" },
  { id: "d2", name: "API Reference.md", collection: "Produkt-Docs", status: "Ready" as const, size: "1.8 MB", updated: "vor 1 Tag" },
  { id: "d3", name: "FAQ Deutsch.docx", collection: "Support-Tickets", status: "Processing" as const, size: "890 KB", updated: "vor 5 Min" },
  { id: "d4", name: "Pricing Page Copy.txt", collection: "Produkt-Docs", status: "Ready" as const, size: "12 KB", updated: "vor 3 Tagen" },
  { id: "d5", name: "Training Data Batch 7.csv", collection: "Wissensbasis", status: "Error" as const, size: "15 MB", updated: "vor 1 Std" },
]

function StatusIcon({ status }: { status: "Ready" | "Processing" | "Error" }) {
  if (status === "Ready") return <CheckCircle2 size={14} style={{ color: "var(--success)" }} />
  if (status === "Processing") return <Loader2 size={14} className="animate-spin" style={{ color: "var(--warning)" }} />
  return <XCircle size={14} style={{ color: "var(--danger)" }} />
}

export default function DocumentsView() {
  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Documents
      </h1>

      {/* Collections */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {collections.map((col) => (
          <div
            key={col.name}
            className="card-hover rounded-xl p-5"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{col.name}</span>
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{col.docs} Docs</span>
            </div>
            <div className="mb-2 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--elevated)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${col.progress}%`,
                  backgroundColor: col.progress === 100 ? "var(--success)" : "var(--brand-purple)",
                }}
              />
            </div>
            <div className="flex justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
              <span>{col.progress}% indexed</span>
              <span>{col.size}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Documents table */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              {["Document", "Collection", "Status", "Size", "Updated"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {documents.map((d) => (
              <tr
                key={d.id}
                className="transition-colors duration-200 hover:bg-[rgba(255,255,255,0.02)]"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <FileText size={14} className="mr-2" style={{ color: "var(--text-muted)" }} />
                    <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{d.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>{d.collection}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <StatusIcon status={d.status} />
                    <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{d.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>{d.size}</td>
                <td className="px-4 py-3 text-[13px]" style={{ color: "var(--text-muted)" }}>{d.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
