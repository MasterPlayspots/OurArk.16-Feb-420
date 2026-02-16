"use client"

import { Component, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex h-full flex-col items-center justify-center p-8">
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(239,68,68,0.1)" }}
          >
            <AlertTriangle size={28} style={{ color: "var(--danger)" }} />
          </div>
          <h2
            className="mb-2 text-[16px] font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Etwas ist schiefgelaufen
          </h2>
          <p
            className="mb-4 max-w-md text-center text-[13px]"
            style={{ color: "var(--text-muted)" }}
          >
            {this.state.error?.message ?? "Ein unerwarteter Fehler ist aufgetreten."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium transition-all duration-150"
            style={{
              backgroundColor: "var(--brand-purple)",
              color: "#fff",
            }}
          >
            <RefreshCw size={14} />
            Erneut versuchen
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
