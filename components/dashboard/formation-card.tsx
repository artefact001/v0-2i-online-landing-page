"use client"

import Image from "next/image"
import { Edit, Trash2, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FormationCardProps {
  formation: {
    id: string
    titre: string
    description?: string
    image?: string
    niveau?: string
    duree?: string
    prix: number
    statut: "en ligne" | "presentiel" | "hybride"
    nb_inscrit?: number
  }
  onEdit: () => void
  onDelete: () => void
}

const statutLabel: Record<string, string> = {
  "en ligne": "En ligne",
  presentiel: "Présentiel",
  hybride: "Hybride",
}

/**
 * Reprend le design de la carte formation de la landing page
 * (components/courses-section.tsx) — même bannière image, dégradé,
 * badge, hover — mais avec des actions modifier/supprimer côté dashboard
 * au lieu du lien "Détails" public.
 */
export function FormationCard({ formation, onEdit, onDelete }: FormationCardProps) {
  return (
    <div className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(201,162,39,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] h-full flex flex-col">
      {/* Bannière image */}
      <div className="h-[140px] relative overflow-hidden bg-[#0d0d1a]">
        {formation.image ? (
          <Image
            src={formation.image}
            alt={formation.titre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[rgba(255,255,255,0.15)]">
            <Users className="w-10 h-10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] via-[rgba(8,15,30,0.3)] to-transparent" />

        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm border border-[rgba(201,162,39,0.4)] text-[#E8C050] text-[9px] font-bold tracking-[1.5px] uppercase rounded-full px-2.5 py-1">
            {statutLabel[formation.statut] || formation.statut}
          </span>
        </div>

        {formation.duree && (
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 bg-[rgba(0,0,0,0.6)] backdrop-blur-sm text-white text-[10px] font-medium rounded-full px-2.5 py-1">
              <Clock className="w-3 h-3" />
              {formation.duree}
            </span>
          </div>
        )}
      </div>

      {/* Corps */}
      <div className="p-5 flex flex-col flex-1">
        {formation.niveau && (
          <span className="text-[10px] font-semibold tracking-[1px] text-[#C9A227] mb-1.5 uppercase">
            {formation.niveau}
          </span>
        )}
        <h3 className="font-serif text-lg font-semibold text-white leading-tight mb-2 group-hover:text-[#C9A227] transition-colors">
          {formation.titre}
        </h3>
        {formation.description && (
          <p className="text-sm text-[#d0daf0] leading-relaxed mb-4 line-clamp-2">{formation.description}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)] mt-auto">
          <div>
            <span className="text-[9px] text-[rgba(255,255,255,0.3)] uppercase tracking-wider">Prix</span>
            <div className="font-serif text-lg font-bold text-[#C9A227]">
              {Number(formation.prix).toLocaleString()} F
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[rgba(255,255,255,0.4)] text-xs">
              <Users className="w-3.5 h-3.5" />
              {formation.nb_inscrit ?? 0}
            </span>
            <Button size="icon" variant="outline" onClick={onEdit} title="Modifier" className="border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.05)] h-8 w-8">
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button size="icon" variant="outline" onClick={onDelete} title="Supprimer" className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-8 w-8">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
