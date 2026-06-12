import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { formations, getFormationBySlug } from "@/lib/formations-data"

export function generateStaticParams() {
  return formations.map((f) => ({ slug: f.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const formation = getFormationBySlug(slug)
  if (!formation) return { title: "Formation introuvable | 2I Online" }
  return {
    title: `${formation.name} | 2I Online`,
    description: formation.shortDesc,
  }
}

export default async function FormationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const formation = getFormationBySlug(slug)

  if (!formation) {
    notFound()
  }

  const related = formations.filter((f) => f.slug !== formation.slug).slice(0, 3)

  return (
    <main className="min-h-screen bg-[#080F1E] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6 md:px-[60px] overflow-hidden">
        <div className="absolute inset-0">
          <Image src={formation.image} alt={formation.name} fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,15,30,0.7)] via-[rgba(8,15,30,0.9)] to-[#080F1E]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Link
            href="/#formations"
            className="inline-flex items-center gap-2 text-[#E8C050] text-xs font-medium tracking-[1.5px] uppercase mb-8 transition-colors hover:text-[#C9A227]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour aux formations
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center bg-[#C9A227] text-[#0D2545] text-[10px] font-bold tracking-[2px] uppercase rounded-full px-4 py-1.5">
              {formation.badge}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#d0daf0] text-[10px] font-medium tracking-[1px] uppercase rounded-full px-4 py-1.5">
              {formation.mode}
            </span>
          </div>

          <h1 className="font-serif text-[clamp(36px,5vw,64px)] font-semibold text-balance mb-6">{formation.name}</h1>
          <p className="text-lg text-[#d0daf0] max-w-3xl leading-relaxed mb-8">{formation.longDesc}</p>

          <div className="flex flex-wrap items-center gap-8">
            <div>
              <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1">Duree</div>
              <div className="flex items-center gap-2 text-white font-medium">
                <svg className="w-5 h-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formation.duration}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[rgba(255,255,255,0.4)] uppercase tracking-wider mb-1">
                {formation.price ? "Tarif" : "Diplome"}
              </div>
              <div className="font-serif text-xl font-bold text-[#C9A227]">
                {formation.price ?? "Reconnu Etat"}
              </div>
            </div>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0D2545] text-xs font-bold tracking-[1.5px] uppercase px-7 py-4 rounded-lg transition-all duration-300 hover:bg-[#E8C050] hover:scale-105"
            >
              S&apos;inscrire a cette formation
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 md:px-[60px] pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main column */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            {/* Objectives */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white mb-6">Objectifs de la formation</h2>
              <ul className="flex flex-col gap-4">
                {formation.objectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-3 text-[#d0daf0] leading-relaxed">
                    <svg className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Program */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-white mb-6">Programme</h2>
              <div className="flex flex-col gap-3">
                {formation.program.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl px-5 py-4"
                  >
                    <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-[rgba(201,162,39,0.15)] text-[#E8C050] text-sm font-bold">
                      {i + 1}
                    </span>
                    <span className="text-[#d0daf0]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
              <h3 className="text-xs font-bold tracking-[2px] uppercase text-[#C9A227] mb-4">Informations</h3>
              <dl className="flex flex-col gap-4 text-sm">
                <div>
                  <dt className="text-[rgba(255,255,255,0.4)] mb-1">Modalite</dt>
                  <dd className="text-white">{formation.mode}</dd>
                </div>
                <div>
                  <dt className="text-[rgba(255,255,255,0.4)] mb-1">Duree</dt>
                  <dd className="text-white">{formation.duration}</dd>
                </div>
                <div>
                  <dt className="text-[rgba(255,255,255,0.4)] mb-1">Prerequis</dt>
                  <dd className="text-white">{formation.prerequisites}</dd>
                </div>
                <div>
                  <dt className="text-[rgba(255,255,255,0.4)] mb-1">Diplome / Certification</dt>
                  <dd className="text-white">{formation.diploma}</dd>
                </div>
              </dl>
              <Link
                href="/inscription"
                className="flex items-center justify-center gap-2 w-full mt-6 bg-[#C9A227] text-[#0D2545] text-xs font-bold tracking-[1.5px] uppercase px-5 py-3.5 rounded-lg transition-all duration-300 hover:bg-[#E8C050]"
              >
                S&apos;inscrire
              </Link>
            </div>
          </aside>
        </div>

        {/* Related formations */}
        <div className="max-w-5xl mx-auto mt-20">
          <h2 className="font-serif text-2xl font-semibold text-white mb-8">Autres formations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((f) => (
              <Link
                key={f.slug}
                href={`/formations/${f.slug}`}
                className="group bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[rgba(201,162,39,0.4)]"
              >
                <div className="h-[140px] relative overflow-hidden">
                  <Image src={f.image} alt={f.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080F1E] to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-semibold text-white group-hover:text-[#C9A227] transition-colors mb-1">
                    {f.name}
                  </h3>
                  <p className="text-xs text-[rgba(255,255,255,0.4)]">{f.duration}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
