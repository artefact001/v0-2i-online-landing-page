import Link from "next/link"

export function Hero() {
  return (
    <section className="min-h-screen relative flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_40%,rgba(27,58,107,0.6)_0%,transparent_70%),radial-gradient(ellipse_40%_40%_at_20%_80%,rgba(201,162,39,0.08)_0%,transparent_60%),#080F1E]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* Orbs */}
      <div className="absolute w-[500px] h-[500px] bg-[rgba(27,58,107,0.5)] rounded-full blur-[80px] pointer-events-none animate-drift -top-[100px] -right-[100px]" />
      <div className="absolute w-[300px] h-[300px] bg-[rgba(201,162,39,0.08)] rounded-full blur-[80px] pointer-events-none animate-drift bottom-[100px] left-[10%]" style={{ animationDelay: '-4s' }} />
      <div className="absolute w-[200px] h-[200px] bg-[rgba(201,162,39,0.06)] rounded-full blur-[80px] pointer-events-none animate-drift top-[30%] right-[20%]" style={{ animationDelay: '-8s' }} />

      {/* Rotating Ring */}
      <div className="absolute -right-[120px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[rgba(201,162,39,0.08)] animate-slow-rotate hidden lg:block">
        <div className="absolute inset-[30px] rounded-full border border-[rgba(201,162,39,0.06)]" />
        <div className="absolute inset-[80px] rounded-full border border-dashed border-[rgba(201,162,39,0.04)]" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#C9A227] -top-[3px] left-1/2 -translate-x-1/2 shadow-[0_0_10px_#C9A227]" />
      </div>

      {/* Content */}
      <div className="relative z-[2] px-6 md:px-[60px] max-w-[760px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-8 opacity-0 translate-y-5 animate-fade-up delay-300">
          <div className="w-10 h-[1px] bg-[#C9A227]" />
          <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[#C9A227]">
            Votre Plateforme de formation professionnelle en hotellerie, restauration et tourisme
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-[clamp(52px,7vw,88px)] font-bold leading-none text-white mb-3 opacity-0 translate-y-[30px] animate-fade-up delay-500">
          Forme ici.<br />
          <span className="text-[#C9A227]">Reconnu</span><br />
          <span className="font-light italic">partout.</span>
        </h1>

        {/* Subtitle */}
        <p className="font-serif text-[clamp(20px,2.5vw,28px)] font-light italic text-[rgba(255,255,255,0.5)] mb-10 opacity-0 translate-y-5 animate-fade-up delay-700">
          Accessible depuis votre mobile.
        </p>

        {/* Description */}
        <p className="text-base font-light text-[#d0daf0] leading-relaxed max-w-[500px] mb-12 opacity-0 translate-y-5 animate-fade-up delay-900">
          Formations certifiantes en hotellerie, restauration et arts culinaires. Concues pour l&apos;Afrique, reconnues partout sur le continent et dans la diaspora.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-5 flex-wrap opacity-0 translate-y-5 animate-fade-up delay-1100">
          <Link
            href="#inscription"
            className="inline-flex items-center gap-2.5 bg-[#C9A227] text-[#0D2545] text-xs font-bold tracking-[2px] uppercase px-9 py-[18px] rounded no-underline transition-all duration-300 relative overflow-hidden hover:bg-[#E8C050]"
          >
            <span className="relative z-[1]">Commencer maintenant</span>
            <span className="relative z-[1]">&#8594;</span>
          </Link>
          <Link
            href="#formations"
            className="inline-flex items-center gap-2.5 text-[rgba(255,255,255,0.65)] text-xs font-medium tracking-[2px] uppercase no-underline transition-colors duration-300 hover:text-[#C9A227] group"
          >
            <div className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.2)] flex items-center justify-center text-sm transition-all duration-300 group-hover:border-[#C9A227] group-hover:bg-[rgba(201,162,39,0.1)]">
              &#9654;
            </div>
            Voir les formations
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute bottom-[60px] right-[60px] hidden lg:flex gap-12 opacity-0 animate-fade-up delay-1300">
        {[
          { num: "40+", label: "Formations" },
          { num: "2 000+", label: "Apprenants vises" },
          { num: "15+", label: "Pays couverts" },
        ].map((stat) => (
          <div key={stat.label} className="text-right">
            <div className="font-serif text-[42px] font-bold text-[#C9A227] leading-none">{stat.num}</div>
            <div className="text-[10px] font-medium tracking-[2px] uppercase text-[rgba(255,255,255,0.3)] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-up delay-1300">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-[#C9A227] animate-scroll-pulse" />
        <span className="text-[8px] tracking-[3px] uppercase text-[rgba(255,255,255,0.25)]">Defiler</span>
      </div>
    </section>
  )
}
