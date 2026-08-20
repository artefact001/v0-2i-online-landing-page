import { Construction } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface ComingSoonProps {
  message?: string
}

/**
 * Placeholder honnête pour les pages dashboard pas encore connectées à
 * de vraies données Laravel. Volontairement affiché plutôt que des
 * statistiques ou listes inventées, pour ne jamais induire un vrai
 * utilisateur en erreur avec de fausses données.
 */
export function ComingSoon({ message }: ComingSoonProps) {
  return (
    <div className="p-8">
      <Card className="bg-[#0d0d1a] border-[rgba(255,255,255,0.05)]">
        <CardContent className="py-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#C9A227]/10 flex items-center justify-center mb-6">
            <Construction className="w-8 h-8 text-[#C9A227]" />
          </div>
          <h3 className="text-white font-serif text-xl mb-2">Bientôt disponible</h3>
          <p className="text-[rgba(255,255,255,0.5)] text-sm max-w-md">
            {message || "Cette section est en cours de finalisation. Elle affichera bientôt tes vraies données."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
