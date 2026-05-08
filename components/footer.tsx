import Link from "next/link"

const footerLinks = {
  formations: [
    { label: "CAP Cuisinier", href: "#formations" },
    { label: "CAP Serveur", href: "#formations" },
    { label: "CAP Patissier", href: "#formations" },
    { label: "HACCP", href: "#formations" },
    { label: "Gestion Restaurant", href: "#formations" },
  ],
  ressources: [
    { label: "Comment ca marche", href: "#comment" },
    { label: "Tarifs", href: "#tarifs" },
    { label: "FAQ", href: "#faq" },
    { label: "Temoignages", href: "#temoignages" },
  ],
  contact: [
    { label: "WhatsApp", href: "#" },
    { label: "Email", href: "mailto:contact@2ionline.sn" },
    { label: "Incub Institut", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] px-6 md:px-[60px] pt-20 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[60px] mb-[60px]">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center no-underline mb-5">
            <span className="font-serif text-[32px] font-bold text-[#C9A227] leading-none">2</span>
            <span className="font-serif text-[32px] font-bold text-white leading-none">I</span>
            <div className="w-[1px] h-6 bg-[rgba(201,162,39,0.4)] mx-3.5" />
            <div>
              <div className="font-sans text-xs font-light tracking-[5px] uppercase text-white leading-tight">
                Online
              </div>
              <span className="text-[8px] text-[rgba(255,255,255,0.3)] tracking-[2px] block mt-0.5">
                by Incub Institut
              </span>
            </div>
          </Link>
          <p className="text-[13px] text-[#d0daf0] leading-relaxed max-w-[280px]">
            Plateforme de formation professionnelle en hotellerie, restauration et arts culinaires pour l&apos;Afrique.
          </p>
        </div>

        {/* Formations */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[3px] uppercase text-[#C9A227] mb-5">
            Formations
          </h4>
          <ul className="list-none">
            {footerLinks.formations.map((link) => (
              <li key={link.label} className="mb-2.5">
                <Link
                  href={link.href}
                  className="text-[13px] text-[rgba(255,255,255,0.4)] no-underline transition-colors duration-300 hover:text-[#C9A227]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ressources */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[3px] uppercase text-[#C9A227] mb-5">
            Ressources
          </h4>
          <ul className="list-none">
            {footerLinks.ressources.map((link) => (
              <li key={link.label} className="mb-2.5">
                <Link
                  href={link.href}
                  className="text-[13px] text-[rgba(255,255,255,0.4)] no-underline transition-colors duration-300 hover:text-[#C9A227]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-bold tracking-[3px] uppercase text-[#C9A227] mb-5">
            Contact
          </h4>
          <ul className="list-none">
            {footerLinks.contact.map((link) => (
              <li key={link.label} className="mb-2.5">
                <Link
                  href={link.href}
                  className="text-[13px] text-[rgba(255,255,255,0.4)] no-underline transition-colors duration-300 hover:text-[#C9A227]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[rgba(255,255,255,0.04)] gap-4">
        <p className="text-[11px] text-[rgba(255,255,255,0.2)] tracking-[1px]">
          © 2026 2I Online by Incub Institut. Tous droits reserves.
        </p>
        <div className="flex gap-3">
          {["facebook", "instagram", "linkedin", "youtube"].map((social) => (
            <Link
              key={social}
              href="#"
              className="w-9 h-9 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-sm text-[rgba(255,255,255,0.3)] no-underline transition-all duration-300 hover:border-[#C9A227] hover:text-[#C9A227] hover:bg-[rgba(201,162,39,0.08)]"
              aria-label={social}
            >
              {social === "facebook" && "f"}
              {social === "instagram" && "ig"}
              {social === "linkedin" && "in"}
              {social === "youtube" && "yt"}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
