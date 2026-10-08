"use client"

import { useEffect, useRef, useState } from "react"
import { apiClient } from "@/lib/api/client"

interface Partner {
  name: string
  domain?: string | null
  image: string
}

// Affichage de repli tant que l'admin n'a ajouté aucun logo (ou si l'API
// est injoignable) : la section ne reste jamais vide.
const fallbackPartners: Partner[] = [
  {
    name: "OFII (Office Français de l'Immigration et de l'Intégration)",
    domain: "Coopération Internationale",
    image: "/images/ofii-logo.png",
  },
  {
    name: "Force N",
    domain: "Formation Professionnelle",
    image: "/images/1000769413.jpg",
  },
  {
    name: "Ambassade de France",
    domain: "Coopération Internationale",
    image: "/images/1000797646.jpg",
  },
  {
    name: "DER/FJ",
    domain: "Entrepreneuriat des Femmes et des Jeunes",
    image: "/images/1000797760.jpg",
  },
  {
    name: "MEFPT",
    domain: "Emploi et Formation Professionnelle",
    image: "/images/FB_IMG_1776855096946.jpg",
  },
  {
    name: "KaNora Services",
    domain: "Inclusion Sociale",
    image: "/images/IMG-20250425-WA0017.jpg",
  },
  {
    name: "Mairie de Bargny",
    domain: "Collectivité Territoriale",
    image: "/images/logo mairie bargny.jpg",
  },
  {
    name: "ADEPME",
    domain: "Développement des PME",
    image: "/images/1000917129.jpg",
  },
]

export function PartnersSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [partners, setPartners] = useState<Partner[]>(fallbackPartners)

  useEffect(() => {
    let cancelled = false
    apiClient<{ nom: string; domaine?: string | null; logo: string }[]>("/partenaire-logos")
      .then((res) => {
        const list = res.data ?? []
        if (!cancelled && list.length > 0) {
          setPartners(list.map((p) => ({ name: p.nom, domain: p.domaine, image: p.logo })))
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // On répète la liste jusqu'à remplir l'écran, puis on la double pour une
  // boucle continue sans coupure (translation de -50%).
  const base = partners.length >= 8 ? partners : Array.from({ length: Math.ceil(8 / partners.length) }, () => partners).flat()
  const track = [...base, ...base]
  const duration = Math.max(25, base.length * 5)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("visible")
              }, index * 100)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="partenaires"
      ref={sectionRef}
      className="relative py-24 px-6 md:px-10 overflow-hidden bg-[#080F1E]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.12),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-20">
          <p className="reveal opacity-0 translate-y-6 transition-all duration-700 text-xs tracking-[5px] uppercase text-[#C9A227] font-semibold">
            Ils nous font confiance
          </p>

          <h2 className="reveal opacity-0 translate-y-6 transition-all duration-700 mt-4 font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
            Nos <span className="text-[#C9A227] italic font-light">Partenaires</span>
          </h2>

          <p className="reveal opacity-0 translate-y-6 transition-all duration-700 mt-6 text-[#D5DCEC] max-w-2xl mx-auto leading-8">
            Nous collaborons avec des institutions publiques, entreprises, organisations et
            partenaires engagés pour offrir une formation professionnelle de qualité et favoriser
            l'insertion des jeunes.
          </p>
        </div>

        {/* Défilement automatique (pause au survol) */}
        <div
          className="partners-marquee relative overflow-hidden"
          style={{
            ["--partners-duration" as string]: `${duration}s`,
            maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div className="partners-marquee-track gap-6 py-4">
            {track.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                aria-hidden={index >= base.length}
                className="group w-60 shrink-0 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-[#C9A227] hover:bg-white/10 transition-colors duration-500 p-8"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.image}
                      alt={partner.name}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>

                <h3 className="text-center text-white font-semibold text-base leading-6 line-clamp-3">
                  {partner.name}
                </h3>

                {partner.domain && (
                  <p className="mt-3 text-center text-[#C9A227] text-sm leading-6 line-clamp-2">
                    {partner.domain}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <div className="reveal opacity-0 translate-y-6 transition-all duration-700 mt-20 text-center">
          <p className="text-[#9AA5BF] text-lg">
            Ensemble, nous développons des compétences et créons des opportunités pour la
            jeunesse africaine.
          </p>
        </div>
      </div>
    </section>
  )
}
