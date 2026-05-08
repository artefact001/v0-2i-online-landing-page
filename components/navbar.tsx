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
    { href: "#classes-virtuelles", label: "Classes" },
    { href: "#comment", label: "Comment ca marche" },
    { href: "#actu", label: "Actu & Opportunites" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-[60px] py-4 md:py-6 transition-all duration-400 ${
        scrolled
          ? "bg-[rgba(8,15,30,0.92)] backdrop-blur-[20px] py-4 border-b border-[rgba(201,162,39,0.12)]"
          : ""
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center no-underline">
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
          <span className="text-[8px] text-[#C9A227] tracking-[1.5px] mt-0.5 block">
            Reconnu par l&apos;Etat
          </span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden lg:flex items-center gap-9 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-xs font-medium tracking-[2px] uppercase text-[rgba(255,255,255,0.55)] no-underline transition-colors duration-300 relative hover:text-[#C9A227] after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[1px] after:bg-[#C9A227] after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Link
        href="#inscription"
        className="hidden md:block bg-[#C9A227] text-[#0D2545] text-[11px] font-bold tracking-[2px] uppercase px-6 py-3 rounded no-underline transition-all duration-300 hover:bg-[#E8C050] hover:-translate-y-0.5"
      >
        S&apos;inscrire
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-0.5 bg-[#C9A227] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`w-6 h-0.5 bg-[#C9A227] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
        <span className={`w-6 h-0.5 bg-[#C9A227] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[rgba(8,15,30,0.98)] backdrop-blur-[20px] border-b border-[rgba(201,162,39,0.12)] lg:hidden">
          <ul className="flex flex-col p-6 gap-4 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium tracking-[2px] uppercase text-[rgba(255,255,255,0.7)] no-underline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="#inscription"
                className="inline-block bg-[#C9A227] text-[#0D2545] text-[11px] font-bold tracking-[2px] uppercase px-6 py-3 rounded no-underline mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                S&apos;inscrire
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
