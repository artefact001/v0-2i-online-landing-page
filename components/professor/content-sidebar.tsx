"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Layers, BookOpen, CheckCircle2, ChevronRight } from "lucide-react"

const professorContentLinks = [
  {
    href: "/dashboard/professor/modules",
    label: "Modules",
    description: "Organiser vos formations",
    icon: Layers,
  },
  {
    href: "/dashboard/professor/lessons",
    label: "Leçons",
    description: "Gérer vos leçons et PDFs",
    icon: BookOpen,
  },
  {
    href: "/dashboard/professor/exercises",
    label: "Exercices & Examens",
    description: "Créer des évaluations",
    icon: CheckCircle2,
  },
]

const adminContentLinks = [
  {
    href: "/dashboard/admin/formations",
    label: "Formations",
    description: "Gérer les formations",
    icon: Layers,
  },
  {
    href: "/dashboard/professor/modules",
    label: "Modules",
    description: "Organiser les modules",
    icon: BookOpen,
  },
  {
    href: "/dashboard/professor/exercises",
    label: "Exercices & Examens",
    description: "Évaluations interactives",
    icon: CheckCircle2,
  },
]

export function ContentSidebar({ role = "professor" }: { role?: "professor" | "admin" }) {
  const pathname = usePathname()
  const links = role === "admin" ? adminContentLinks : professorContentLinks

  return (
    <aside className="w-64 shrink-0 self-start sticky top-24">
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#12122a] overflow-hidden">
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
          <p className="text-xs font-semibold tracking-widest uppercase text-[rgba(255,255,255,0.4)]">
            Gestion du contenu
          </p>
        </div>
        <nav className="p-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${
                  isActive
                    ? "bg-[#C9A227]/15 border border-[#C9A227]/30"
                    : "hover:bg-[rgba(255,255,255,0.04)] border border-transparent"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? "bg-[#C9A227]/20 text-[#C9A227]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.5)] group-hover:text-[#C9A227]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${isActive ? "text-[#C9A227]" : "text-[rgba(255,255,255,0.8)]"}`}>
                    {link.label}
                  </p>
                  <p className="text-xs text-[rgba(255,255,255,0.35)] truncate">{link.description}</p>
                </div>
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                    isActive ? "text-[#C9A227]" : "text-[rgba(255,255,255,0.2)] group-hover:translate-x-0.5"
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Tips box */}
        <div className="mx-2 mb-2 rounded-lg bg-[rgba(201,162,39,0.06)] border border-[rgba(201,162,39,0.12)] p-3">
          <p className="text-xs font-medium text-[#C9A227] mb-1">Conseil</p>
          <p className="text-xs text-[rgba(255,255,255,0.4)] leading-relaxed">
            Créez d&apos;abord vos modules, puis ajoutez les leçons et exercices correspondants.
          </p>
        </div>
      </div>
    </aside>
  )
}
