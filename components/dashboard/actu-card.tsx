"use client"

import Image from "next/image"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActuCardProps {
  actu: {
    id: string
    titre: string
    description?: string
    contenu_html: string
    image?: string
    type: "actualite" | "evenement" | "communique" | "blog"
    date_publication: string
    statut: "brouillon" | "publie" | "archive"
  }
  onEdit: () => void
  onDelete: () => void
}

const typeLabel: Record<string, string> = {
  actualite: "Actualité",
  evenement: "Événement",
  communique: "Communiqué",
  blog: "Blog",
}

const typeColor: Record<string, string> = {
  actualite: "bg-[#C9A227]/20 text-[#C9A227]",
  evenement: "bg-blue-500/20 text-blue-400",
  communique: "bg-emerald-500/20 text-emerald-400",
  blog: "bg-rose-500/20 text-rose-400",
}

const statutStyle: Record<string, string> = {
  brouillon: "bg-gray-500/20 text-gray-400",
  publie: "bg-green-500/20 text-green-400",
  archive: "bg-amber-500/20 text-amber-400",
}

const statutLabel: Record<string, string> = {
  brouillon: "Brouillon",
  publie: "Publié",
  archive: "Archivé",
}

function stripHtml(html: string, maxLength = 100): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text
}

/**
 * Reprend le design des cartes de la landing page (actualites-content.tsx)
 * — image, badge type, dégradé — avec modifier/supprimer côté dashboard.
 */
export function ActuCard({ actu, onEdit, onDelete }: ActuCardProps) {
  return (
    <div className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(201,162,39,0.4)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] h-full flex flex-col">
      <div className="h-[140px] relative overflow-hidden bg-[#0d0d1a]">
        {actu.image ? (
          <Image
            src={actu.image}
            alt={actu.titre}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d0d1a] to-[#1a1a2e]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] via-[rgba(8,15,30,0.3)] to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[1.5px] uppercase ${typeColor[actu.type]}`}>
            {typeLabel[actu.type]}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[1.5px] uppercase ${statutStyle[actu.statut]}`}>
            {statutLabel[actu.statut]}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-lg font-semibold text-white leading-tight mb-2 group-hover:text-[#C9A227] transition-colors line-clamp-2">
          {actu.titre}
        </h3>
        <p className="text-sm text-[#d0daf0] leading-relaxed mb-4 line-clamp-2 flex-1">
          {actu.description || stripHtml(actu.contenu_html)}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)] mt-auto">
          <span className="text-xs text-[rgba(255,255,255,0.4)]">
            {new Date(actu.date_publication).toLocaleDateString("fr-FR")}
          </span>
          <div className="flex items-center gap-2">
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
