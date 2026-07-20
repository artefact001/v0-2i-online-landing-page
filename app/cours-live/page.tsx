"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { CoursesNavbar } from "@/components/courses-navbar"
import { liveCourses, type LiveCourse } from "@/lib/courses-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"

function LiveCourseCard({ course }: { course: LiveCourse }) {
  return (
    <div className="group relative bg-gradient-to-br from-[#0D2545] to-[#1B3A6B] rounded-2xl overflow-hidden border border-[rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.4)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(201,162,39,0.15)]">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2545] via-transparent to-transparent" />
        
        {/* Live Badge */}
        {course.isLive && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            EN DIRECT
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-4 right-4">
          <Badge className="bg-[rgba(201,162,39,0.9)] text-[#0D2545] font-semibold">
            {course.category}
          </Badge>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
          {course.duration}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Date & Time */}
        <div className="flex items-center gap-3 mb-3 text-sm">
          <span className={`font-semibold ${course.isLive ? 'text-red-400' : 'text-[#C9A227]'}`}>
            {course.date}
          </span>
          <span className="text-[rgba(255,255,255,0.4)]">•</span>
          <span className="text-[rgba(255,255,255,0.7)]">{course.time}</span>
        </div>
        
        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-[#C9A227] transition-colors">
          {course.title}
        </h3>
        
        {/* Instructor */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8C050] flex items-center justify-center text-[#0D2545] font-bold text-sm">
            {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{course.instructor}</p>
            <p className="text-[rgba(255,255,255,0.5)] text-xs">{course.instructorRole}</p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-[rgba(255,255,255,0.6)] text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Level & Participants */}
        <div className="flex items-center justify-between mb-5">
          <Badge variant="outline" className="border-[rgba(201,162,39,0.3)] text-[#C9A227]">
            {course.level}
          </Badge>
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-[rgba(255,255,255,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[rgba(255,255,255,0.6)]">
              {course.participantsCount}/{course.maxParticipants}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[rgba(255,255,255,0.1)] rounded-full mb-5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#C9A227] to-[#E8C050] rounded-full transition-all duration-500"
            style={{ width: `${(course.participantsCount / course.maxParticipants) * 100}%` }}
          />
        </div>
        
        {/* CTA Button */}
        <Button 
          className={`w-full font-semibold tracking-wide ${
            course.isLive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545]'
          }`}
        >
          {course.isLive ? 'Rejoindre Maintenant' : 'Réserver ma Place'}
          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

function CoursLivePageContent() {
  const [filter, setFilter] = useState<string>("all")
  
  const categories = ["all", ...new Set(liveCourses.map(c => c.category))]
  
  const filteredCourses = filter === "all" 
    ? liveCourses 
    : liveCourses.filter(c => c.category === filter)
  
  const liveNow = liveCourses.filter(c => c.isLive)

  return (
    <div className="min-h-screen bg-dark">
      <CoursesNavbar currentPage="live" />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/live-class-bg.jpg"
            alt="Live Classes"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/80 to-dark" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C9A227] rounded-full filter blur-[120px] opacity-20 animate-drift" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1B3A6B] rounded-full filter blur-[150px] opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.5)] mb-8">
            <Link href="/" className="hover:text-[#C9A227] transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#C9A227]">Cours en Live</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-full text-sm font-medium">
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  {liveNow.length} cours en direct
                </span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Cours en <span className="text-[#C9A227]">Direct</span>
              </h1>
              <p className="text-lg text-[rgba(255,255,255,0.7)] max-w-2xl">
                Participez à nos sessions live interactives avec nos chefs experts. 
                Posez vos questions et progressez en temps réel.
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-[#C9A227]">{liveCourses.length}</p>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">Sessions cette semaine</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-white">12+</p>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">Experts formateurs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="py-8 border-y border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-[rgba(255,255,255,0.5)] mr-2">Filtrer par :</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? 'bg-[#C9A227] text-[#0D2545]'
                    : 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white'
                }`}
              >
                {cat === "all" ? "Tous les cours" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Live Now Section */}
      {liveNow.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h2 className="font-serif text-2xl font-bold text-white">En Direct Maintenant</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveNow.map((course) => (
                <LiveCourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Upcoming Courses */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="font-serif text-2xl font-bold text-white mb-8">
            Prochaines Sessions
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.filter(c => !c.isLive).map((course) => (
              <LiveCourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="relative bg-gradient-to-br from-[#0D2545] to-[#1B3A6B] rounded-3xl p-8 md:p-12 border border-[rgba(201,162,39,0.2)] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] rounded-full filter blur-[100px] opacity-10" />
            <div className="relative text-center">
              <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                Ne manquez aucun cours
              </h3>
              <p className="text-[rgba(255,255,255,0.7)] mb-8 max-w-lg mx-auto">
                Activez les notifications pour être alerté du début des sessions live et des nouvelles formations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545] font-semibold px-8">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Activer les Notifications
                </Button>
                <Button variant="outline" className="border-[rgba(201,162,39,0.4)] text-[#C9A227] hover:bg-[rgba(201,162,39,0.1)]">
                  Voir le Calendrier Complet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <p className="text-sm text-[rgba(255,255,255,0.5)]">
            © 2024 2I Online by Incub&apos;Institut. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function CoursLivePage() {
  return (
    <AuthGuard>
      <CoursLivePageContent />
    </AuthGuard>
  )
}
