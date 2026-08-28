"use client"

import { Edit, Trash2, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OpportuniteCardProps {
  opportunite: {
    id: string
    titre: string
    type: "stage" | "emploi" | "formation" | "bourse" | "partenariat"
    description: string
    date_fin: string
    ville: string
    pays: string
    entreprise?: string
    statut: "ouvert" | "ferme" | "en cours"
  }
  onEdit: () => void
  onDelete: () => void
  onViewCandidatures?: () => void
}

const typeLabel: Record<string, string> = {
  stage: "Stage",
  emploi: "Emploi",
  formation: "Formation",
  bourse: "Bourse",
  partenariat: "Partenariat",
}

const typeColor: Record<string, string> = {
  stage: "bg-blue-500/20 text-blue-400",
  emploi: "bg-[#C9A227]/20 text-[#C9A227]",
  formation: "bg-purple-500/20 text-purple-400",
  bourse: "bg-emerald-500/20 text-emerald-400",
  partenariat: "bg-rose-500/20 text-rose-400",
}

const statutStyle: Record<string, string> = {
  ouvert: "bg-green-500/20 text-green-400",
  ferme: "bg-red-500/20 text-red-400",
  "en cours": "bg-amber-500/20 text-amber-400",
}

const statutLabel: Record<string, string> = {
  ouvert: "Ouvert",
  ferme: "Fermé",
  "en cours": "En cours",
}

/**
 * Reprend le design des cartes opportunité de la landing page
 * (actualites-content.tsx) — badge type + tags + date limite — avec
 * modifier/supprimer côté dashboard.
 */
export function OpportuniteCard({ opportunite, onEdit, onDelete, onViewCandidatures }: OpportuniteCardProps) {
  return (
    <div className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(201,162,39,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-3">
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[1.5px] uppercase ${typeColor[opportunite.type]}`}>
          {typeLabel[opportunite.type]}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[1.5px] uppercase ${statutStyle[opportunite.statut]}`}>
          {statutLabel[opportunite.statut]}
        </span>
      </div>

      <h3 className="font-serif text-lg font-semibold text-white leading-tight mb-1 group-hover:text-[#C9A227] transition-colors">
        {opportunite.titre}
      </h3>
      {opportunite.entreprise && <p className="text-[#C9A227] text-sm mb-2">{opportunite.entreprise}</p>}

      <div className="flex items-center gap-1.5 text-[rgba(255,255,255,0.5)] text-xs mb-3">
        <MapPin className="w-3.5 h-3.5" />
        {opportunite.ville}, {opportunite.pays}
      </div>

      <p className="text-sm text-[#d0daf0] leading-relaxed mb-4 line-clamp-2 flex-1">{opportunite.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)] mt-auto">
        <span className="text-xs text-[rgba(255,255,255,0.4)]">
          Limite : {new Date(opportunite.date_fin).toLocaleDateString("fr-FR")}
        </span>
        <div className="flex items-center gap-2">
          {onViewCandidatures && (
            <Button size="icon" variant="outline" onClick={onViewCandidatures} title="Voir les candidatures" className="border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 h-8 w-8">
              <Users className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button size="icon" variant="outline" onClick={onEdit} title="Modifier" className="border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.05)] h-8 w-8">
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button size="icon" variant="outline" onClick={onDelete} title="Supprimer" className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-8 w-8">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
