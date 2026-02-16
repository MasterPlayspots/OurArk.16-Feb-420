"use client"

const models = [
  { name: "GPT-4o", cost: 18.20, percentage: 47, color: "var(--brand-purple)" },
  { name: "Claude 3.5", cost: 12.40, percentage: 32, color: "var(--brand-indigo)" },
  { name: "GPT-4o-mini", cost: 5.60, percentage: 15, color: "var(--info)" },
  { name: "Mistral Large", cost: 2.20, percentage: 6, color: "var(--warning)" },
]

export default function BudgetsView() {
  const spent = 38.40
  const budget = 50.00
  const percentage = (spent / budget) * 100
  const threshold = 80

  return (
    <div className="mx-auto max-w-[900px] p-8 animate-fade-slide-in">
      <h1 className="mb-6 text-[20px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text-primary)" }}>
        Budgets
      </h1>

      {/* Main budget bar */}
      <div
        className="mb-8 rounded-xl p-6"
        style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <span className="text-[32px] font-bold" style={{ color: "var(--text-primary)" }}>
              {"\u20AC"}{spent.toFixed(2)}
            </span>
            <span className="ml-2 text-[16px]" style={{ color: "var(--text-muted)" }}>
              / {"\u20AC"}{budget.toFixed(2)}
            </span>
          </div>
          <span
            className="text-[14px] font-semibold"
            style={{ color: percentage >= threshold ? "var(--warning)" : "var(--success)" }}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>

        <div className="relative h-3 overflow-hidden rounded-full" style={{ backgroundColor: "var(--elevated)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, var(--success), var(--warning))`,
            }}
          />
          {/* Threshold line */}
          <div
            className="absolute top-0 h-full w-px"
            style={{
              left: `${threshold}%`,
              borderLeft: "2px dashed var(--text-muted)",
              opacity: 0.4,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
          <span>{"\u20AC"}0</span>
          <span>{threshold}% Threshold</span>
          <span>{"\u20AC"}{budget.toFixed(2)}</span>
        </div>
      </div>

      {/* Cost breakdown */}
      <h2 className="mb-4 text-[16px] font-semibold" style={{ color: "var(--text-primary)" }}>
        Kosten nach Modell
      </h2>
      <div className="space-y-3">
        {models.map((m) => (
          <div
            key={m.name}
            className="card-hover flex items-center rounded-xl px-5 py-4"
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border-default)" }}
          >
            <div className="mr-4 w-[120px]">
              <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{m.name}</p>
            </div>
            <div className="flex-1">
              <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--elevated)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${m.percentage}%`, backgroundColor: m.color }}
                />
              </div>
            </div>
            <div className="ml-4 w-[80px] text-right">
              <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {"\u20AC"}{m.cost.toFixed(2)}
              </span>
            </div>
            <div className="ml-3 w-[40px] text-right">
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {m.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
