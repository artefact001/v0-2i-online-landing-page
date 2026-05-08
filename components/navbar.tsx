"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#about", label: "A propos" },
    { href: "#formations", label: "Formations" },
    { href: "/cours-live", label: "Cours Live", isLive: true },
    { href: "/cours-archive", label: "Bibliothèque" },
    { href: "#tarifs", label: "Tarifs" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[rgba(8,15,30,0.95)] backdrop-blur-[20px] border-b border-[rgba(201,162,39,0.15)] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between py-4 md:py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center no-underline group">
          <div className="relative">
            <span className="font-serif text-[32px] font-bold text-[#C9A227] leading-none transition-transform group-hover:scale-105">2</span>
            <span className="font-serif text-[32px] font-bold text-white leading-none transition-transform group-hover:scale-105">I</span>
          </div>
          <div className="w-[1px] h-6 bg-[rgba(201,162,39,0.4)] mx-3.5" />
          <div>
            <div className="font-sans text-xs font-light tracking-[4px] uppercase text-white leading-tight">
              Online
            </div>
            <span className="text-[8px] text-[rgba(255,255,255,0.4)] tracking-[1.5px] block mt-0.5">
              by Incub Institut
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8 list-none">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] font-medium tracking-[2px] uppercase text-[rgba(255,255,255,0.6)] no-underline transition-all duration-300 relative py-2 hover:text-[#C9A227] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C9A227] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left flex items-center gap-2"
              >
                {(link as { isLive?: boolean }).isLive && (
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="#inscription"
            className="relative bg-[#C9A227] text-[#0D2545] text-[10px] font-bold tracking-[2px] uppercase px-6 py-3 rounded-lg no-underline transition-all duration-300 hover:bg-[#E8C050] hover:scale-105 hover:shadow-[0_0_20px_rgba(201,162,39,0.3)] flex items-center gap-2"
          >
            <span>S&apos;inscrire</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            <span 
              className={`w-full h-0.5 bg-[#C9A227] rounded-full transition-all duration-300 origin-center ${
                mobileMenuOpen ? 'rotate-45 translate-y-[9px]' : ''
              }`} 
            />
            <span 
              className={`w-full h-0.5 bg-[#C9A227] rounded-full transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0 scale-0' : ''
              }`} 
            />
            <span 
              className={`w-full h-0.5 bg-[#C9A227] rounded-full transition-all duration-300 origin-center ${
                mobileMenuOpen ? '-rotate-45 -translate-y-[9px]' : ''
              }`} 
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 bg-[rgba(8,15,30,0.98)] backdrop-blur-[20px] border-b border-[rgba(201,162,39,0.15)] transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col p-6 gap-1 list-none">
          {navLinks.map((link, index) => (
            <li 
              key={link.href}
              className={`transition-all duration-300 ${
                mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms' }}
            >
              <Link
                href={link.href}
                className="block py-3 text-base font-medium tracking-[2px] uppercase text-[rgba(255,255,255,0.7)] no-underline transition-colors hover:text-[#C9A227]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li 
            className={`mt-4 transition-all duration-300 ${
              mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: mobileMenuOpen ? `${navLinks.length * 50}ms` : '0ms' }}
          >
            <Link
              href="#inscription"
              className="inline-flex items-center gap-2 bg-[#C9A227] text-[#0D2545] text-sm font-bold tracking-[2px] uppercase px-6 py-4 rounded-lg no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              S&apos;inscrire maintenant
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
