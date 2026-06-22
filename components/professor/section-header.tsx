import type { ReactNode } from 'react'

interface SectionHeaderProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function SectionHeader({ icon, title, description, action }: SectionHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[rgba(201,162,39,0.25)] bg-gradient-to-br from-[#1a1a2e] to-[#15152a] p-6 md:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#C9A227]/10 blur-3xl"
      />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#C9A227]/15 text-[#C9A227] ring-1 ring-[#C9A227]/30">
            {icon}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white md:text-3xl text-balance">{title}</h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-[rgba(255,255,255,0.55)] text-pretty">
              {description}
            </p>
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: ReactNode
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a2e] p-4 transition-colors hover:border-[rgba(201,162,39,0.35)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10 text-[#C9A227]">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold leading-none text-white">{value}</p>
        <p className="mt-1 text-xs text-[rgba(255,255,255,0.5)]">{label}</p>
      </div>
    </div>
  )
}

interface FormationPillsProps {
  formations: { id: string; name: string }[]
  selected: string
  onSelect: (id: string) => void
}

export function FormationPills({ formations, selected, onSelect }: FormationPillsProps) {
  if (formations.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {formations.map((f) => {
        const active = f.id === selected
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            className={
              active
                ? 'rounded-full bg-[#C9A227] px-4 py-2 text-sm font-medium text-[#0a0a1a] transition-colors'
                : 'rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm font-medium text-[rgba(255,255,255,0.7)] transition-colors hover:border-[rgba(201,162,39,0.4)] hover:text-white'
            }
          >
            {f.name}
          </button>
        )
      })}
    </div>
  )
}
