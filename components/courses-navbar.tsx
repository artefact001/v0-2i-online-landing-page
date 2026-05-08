"use client"

import Link from "next/link"
import { useState } from "react"

interface CoursesNavbarProps {
  currentPage: "live" | "archive"
}

export function CoursesNavbar({ currentPage }: CoursesNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(8,15,30,0.95)] backdrop-blur-[20px] border-b border-[rgba(201,162,39,0.15)] shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
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
        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/cours-live"
            className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
              currentPage === "live"
                ? "bg-[#C9A227] text-[#0D2545]"
                : "text-[rgba(255,255,255,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${currentPage === "live" ? "bg-[#0D2545] animate-pulse" : "bg-red-500 animate-pulse"}`} />
              Cours en Live
            </span>
          </Link>
          <Link
            href="/cours-archive"
            className={`px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-300 ${
              currentPage === "archive"
                ? "bg-[#C9A227] text-[#0D2545]"
                : "text-[rgba(255,255,255,0.7)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Cours par Classe
            </span>
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/"
            className="text-[11px] font-medium tracking-[2px] uppercase text-[rgba(255,255,255,0.6)] no-underline transition-all duration-300 hover:text-[#C9A227] flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour Accueil
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
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col p-6 gap-3">
          <Link
            href="/cours-live"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === "live"
                ? "bg-[#C9A227] text-[#0D2545]"
                : "text-white bg-[rgba(255,255,255,0.05)]"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${currentPage === "live" ? "bg-[#0D2545]" : "bg-red-500"} animate-pulse`} />
            <span className="font-medium">Cours en Live</span>
          </Link>
          <Link
            href="/cours-archive"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === "archive"
                ? "bg-[#C9A227] text-[#0D2545]"
                : "text-white bg-[rgba(255,255,255,0.05)]"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="font-medium">Cours par Classe</span>
          </Link>
          <div className="h-px bg-[rgba(201,162,39,0.2)] my-2" />
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Retour Accueil</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
