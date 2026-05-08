"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { CoursesNavbar } from "@/components/courses-navbar"
import { courseClasses, recordedCourses, type RecordedCourse, type CourseClass } from "@/lib/courses-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Icons for classes
const classIcons: Record<string, JSX.Element> = {
  ChefHat: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  UtensilsCrossed: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Cake: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
    </svg>
  ),
  ShieldCheck: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Wine: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Building2: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
}

function ClassCard({ courseClass, onClick, isSelected }: { courseClass: CourseClass; onClick: () => void; isSelected: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-6 rounded-2xl border transition-all duration-500 text-left w-full ${
        isSelected
          ? 'bg-gradient-to-br from-[#C9A227] to-[#E8C050] border-[#C9A227] shadow-[0_10px_40px_rgba(201,162,39,0.3)]'
          : 'bg-gradient-to-br from-[#0D2545] to-[#1B3A6B] border-[rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.4)] hover:shadow-[0_10px_40px_rgba(201,162,39,0.1)]'
      }`}
    >
      {/* Icon */}
      <div 
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all ${
          isSelected 
            ? 'bg-[#0D2545] text-[#C9A227]' 
            : 'bg-[rgba(201,162,39,0.1)] text-[#C9A227] group-hover:bg-[rgba(201,162,39,0.2)]'
        }`}
      >
        {classIcons[courseClass.icon]}
      </div>
      
      {/* Title */}
      <h3 className={`font-serif text-lg font-bold mb-2 transition-colors ${
        isSelected ? 'text-[#0D2545]' : 'text-white group-hover:text-[#C9A227]'
      }`}>
        {courseClass.name}
      </h3>
      
      {/* Description */}
      <p className={`text-sm mb-4 line-clamp-2 ${
        isSelected ? 'text-[#0D2545]/80' : 'text-[rgba(255,255,255,0.6)]'
      }`}>
        {courseClass.description}
      </p>
      
      {/* Count */}
      <div className={`flex items-center gap-2 text-sm font-medium ${
        isSelected ? 'text-[#0D2545]' : 'text-[#C9A227]'
      }`}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {courseClass.coursesCount} cours enregistrés
      </div>
    </button>
  )
}

function RecordedCourseCard({ course }: { course: RecordedCourse }) {
  return (
    <div className="group relative bg-gradient-to-br from-[#0D2545] to-[#1B3A6B] rounded-2xl overflow-hidden border border-[rgba(201,162,39,0.15)] hover:border-[rgba(201,162,39,0.4)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(201,162,39,0.15)]">
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2545] via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-[#C9A227] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(201,162,39,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
            <svg className="w-7 h-7 text-[#0D2545] ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-4 right-4 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-medium">
          {course.duration}
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="bg-[rgba(201,162,39,0.9)] text-[#0D2545] font-semibold text-xs">
            {course.className}
          </Badge>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Date */}
        <div className="flex items-center gap-3 mb-2 text-xs">
          <span className="text-[rgba(255,255,255,0.5)]">{course.date}</span>
          <span className="text-[rgba(255,255,255,0.3)]">•</span>
          <span className="flex items-center gap-1 text-[rgba(255,255,255,0.5)]">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {course.views.toLocaleString()} vues
          </span>
        </div>
        
        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-[#C9A227] transition-colors">
          {course.title}
        </h3>
        
        {/* Instructor */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A227] to-[#E8C050] flex items-center justify-center text-[#0D2545] font-bold text-xs">
            {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{course.instructor}</p>
            <p className="text-[rgba(255,255,255,0.4)] text-xs">{course.instructorRole}</p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-[rgba(255,255,255,0.5)] text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Level & CTA */}
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-[rgba(201,162,39,0.3)] text-[#C9A227] text-xs">
            {course.level}
          </Badge>
          <Button size="sm" className="bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545] font-semibold text-xs">
            Regarder
            <svg className="w-3.5 h-3.5 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CoursArchivePage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  
  const filteredCourses = recordedCourses.filter(course => {
    const matchesClass = !selectedClass || course.classId === selectedClass
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesClass && matchesSearch
  })
  
  const selectedClassName = selectedClass 
    ? courseClasses.find(c => c.id === selectedClass)?.name 
    : "Toutes les Classes"

  return (
    <div className="min-h-screen bg-dark">
      <CoursesNavbar currentPage="archive" />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/archive-bg.jpg"
            alt="Course Archive"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/80 to-dark" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#C9A227] rounded-full filter blur-[120px] opacity-20 animate-drift" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#1B3A6B] rounded-full filter blur-[150px] opacity-40" />
        
        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.5)] mb-8">
            <Link href="/" className="hover:text-[#C9A227] transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#C9A227]">Cours par Classe</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Bibliothèque de <span className="text-[#C9A227]">Cours</span>
              </h1>
              <p className="text-lg text-[rgba(255,255,255,0.7)] max-w-2xl">
                Accédez à notre collection complète de cours enregistrés. 
                Apprenez à votre rythme avec nos formations classées par spécialité.
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-[#C9A227]">{recordedCourses.length}</p>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">Cours disponibles</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl font-bold text-white">{courseClasses.length}</p>
                <p className="text-sm text-[rgba(255,255,255,0.6)]">Spécialités</p>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="mt-10 max-w-xl">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[rgba(255,255,255,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un cours ou un instructeur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(201,162,39,0.2)] rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#C9A227] focus:bg-[rgba(255,255,255,0.08)] transition-all"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Classes Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-white">
              Choisissez votre Spécialité
            </h2>
            {selectedClass && (
              <button
                onClick={() => setSelectedClass(null)}
                className="flex items-center gap-2 text-sm text-[#C9A227] hover:text-[#E8C050] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Effacer le filtre
              </button>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseClasses.map((courseClass) => (
              <ClassCard
                key={courseClass.id}
                courseClass={courseClass}
                onClick={() => setSelectedClass(
                  selectedClass === courseClass.id ? null : courseClass.id
                )}
                isSelected={selectedClass === courseClass.id}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Courses List */}
      <section className="py-12 border-t border-[rgba(201,162,39,0.1)]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">
                {selectedClassName}
              </h2>
              <p className="text-sm text-[rgba(255,255,255,0.5)] mt-1">
                {filteredCourses.length} cours trouvés
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-[rgba(255,255,255,0.5)]">Trier par :</span>
              <select className="bg-[rgba(255,255,255,0.05)] border border-[rgba(201,162,39,0.2)] rounded-lg py-2 px-4 text-white text-sm focus:outline-none focus:border-[#C9A227]">
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="duration">Durée</option>
              </select>
            </div>
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <RecordedCourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[rgba(201,162,39,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Aucun cours trouvé</h3>
              <p className="text-[rgba(255,255,255,0.6)]">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Progress CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="relative bg-gradient-to-br from-[#0D2545] to-[#1B3A6B] rounded-3xl p-8 md:p-12 border border-[rgba(201,162,39,0.2)] overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#C9A227] rounded-full filter blur-[100px] opacity-10" />
            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-4">
                  Suivez votre progression
                </h3>
                <p className="text-[rgba(255,255,255,0.7)] mb-6">
                  Créez un compte pour sauvegarder vos cours favoris, suivre votre progression 
                  et obtenir des recommandations personnalisées.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button className="bg-[#C9A227] hover:bg-[#E8C050] text-[#0D2545] font-semibold px-8">
                    Créer un Compte
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </Button>
                  <Button variant="outline" className="border-[rgba(201,162,39,0.4)] text-[#C9A227] hover:bg-[rgba(201,162,39,0.1)]">
                    Se Connecter
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A227] to-[#E8C050] rounded-full opacity-20" />
                  <div className="absolute inset-4 bg-dark rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-serif text-4xl font-bold text-[#C9A227]">0%</p>
                      <p className="text-xs text-[rgba(255,255,255,0.6)]">Progression</p>
                    </div>
                  </div>
                </div>
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
