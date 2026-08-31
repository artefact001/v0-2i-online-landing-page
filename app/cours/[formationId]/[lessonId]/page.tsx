"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/lib/auth-context"
import { progressService } from "@/lib/progress-service"
import { favoritesService } from "@/lib/notes-service"
import { LessonNotesPanel } from "@/components/lesson/notes-panel"
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  CheckCircle, 
  Circle,
  BookOpen,
  Video,
  FileText,
  Clock,
  Menu,
  X,
  Award,
  ChevronDown,
  ChevronUp,
  StickyNote,
  Star,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Schéma Laravel réel (lecons) : titre, contenu, video, document, ordre
interface Lesson {
  id: string
  titre: string
  contenu: string | null
  video: string | null
  document: string | null
  ordre: number
  module_id: string
}

// Schéma Laravel réel (modules) : titre, description, ordre
interface Module {
  id: string
  titre: string
  ordre: number
  lessons: Lesson[]
}

// Schéma Laravel réel (formations) : titre (pas de slug)
interface Formation {
  id: string
  titre: string
}

interface LessonProgress {
  statut: 'commencer' | 'en cours' | 'termine'
}

interface Exercise {
  id: string
  title: string
  exercise_type: string
  points: number
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [formation, setFormation] = useState<Formation | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<"content" | "exercises" | "notes">("content")
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [totalProgress, setTotalProgress] = useState(0)
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null) // null = pas encore vérifié
  const [noAccessToContent, setNoAccessToContent] = useState(false)
  const [expandedLessonLists, setExpandedLessonLists] = useState<Set<string>>(new Set())

  const LESSONS_PREVIEW_COUNT = 8

  const toggleLessonListExpanded = (moduleId: string) => {
    setExpandedLessonLists((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  // Fetch formation and modules
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      if (!user) {
        setLoading(false)
        return
      }

      try {
        const formationRes = await apiClient<Formation>(`/formations/${params.formationId}`)
        const formationData = formationRes.data

        if (formationData) {
          setFormation(formationData)

          // Contrôle d'accès: le backend vérifie lui-même l'accès réel —
          // un étudiant doit être activement inscrit, un formateur doit
          // être propriétaire de la formation (un admin voit tout). Côté
          // frontend on ne fait qu'un contrôle explicite supplémentaire
          // pour l'étudiant (message dédié "non inscrit"); pour un
          // formateur/admin sans accès, le backend renvoie simplement une
          // liste de modules vide (voir plus bas).
          if (user.role === 'student') {
            // Le backend GET /inscriptions ne filtre que par user_id/
            // formation_id — le vrai champ de statut ("actif", pas
            // "active") doit être vérifié côté client sur les résultats.
            const enrollRes = await apiClient(
              `/inscriptions?formation_id=${formationData.id}&user_id=${user.id}`,
            )
            const enrollments = Array.isArray(enrollRes.data) ? enrollRes.data : []
            const hasActiveEnrollment = enrollments.some((e: any) => e.statut === 'actif')
            if (!hasActiveEnrollment) {
              setIsEnrolled(false)
              setLoading(false)
              return
            }
          }
          setIsEnrolled(true)

          const modulesRes = await apiClient<Module[]>(`/modules?formation_id=${formationData.id}`)
          const modulesData = modulesRes.data || []

          // Route Laravel réelle: /v1/lecons
          const modulesWithLessons = await Promise.all(
            modulesData.map(async (m: any) => {
              const leconsRes = await apiClient<Lesson[]>(`/lecons?module_id=${m.id}`)
              const lessons = (leconsRes.data || []).sort(
                (a: Lesson, b: Lesson) => a.ordre - b.ordre,
              )
              return { ...m, lessons }
            }),
          )
          setModules(modulesWithLessons.sort((a, b) => a.ordre - b.ordre))
          setExpandedModules(modulesWithLessons.map((m) => m.id))

          // Si la formation existe mais qu'aucun module n'est accessible
          // (liste vide alors que la formation, elle, a bien été trouvée),
          // c'est que le backend a filtré silencieusement : ce compte
          // (formateur non-propriétaire, généralement) n'a pas accès au
          // contenu de cette formation précise — à distinguer d'un vrai
          // "leçon introuvable".
          if (modulesWithLessons.length === 0 && user.role !== 'student') {
            setNoAccessToContent(true)
            setLoading(false)
            return
          }

          if (params.lessonId) {
            for (const mod of modulesWithLessons) {
              const lesson = mod.lessons.find((l: Lesson) => l.id === params.lessonId)
              if (lesson) {
                setCurrentLesson(lesson)
                break
              }
            }
          } else if (modulesWithLessons.length > 0 && modulesWithLessons[0].lessons.length > 0) {
            router.push(`/cours/${params.formationId}/${modulesWithLessons[0].lessons[0].id}`)
          }
        }
      } catch (error) {
        console.error('Error loading course data:', error)
      }

      setLoading(false)
    }

    fetchData()
  }, [params.formationId, params.lessonId, router, user])

  // Fetch exercises for current lesson — route réelle: /v1/exercices
  useEffect(() => {
    const fetchExercises = async () => {
      if (!currentLesson) return

      try {
        const res = await apiClient<Exercise[]>(`/exercices?lesson_id=${currentLesson.id}`)
        if (res.data) setExercises(res.data)
      } catch (error) {
        console.error('Error loading exercises:', error)
      }
    }

    fetchExercises()
  }, [currentLesson])

  // Fetch lesson progress via progressService (déjà connecté à /v1/progressions)
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentLesson || !user) return

      const data = await progressService.getLessonProgress(user.id, currentLesson.id)
      if (data) setProgress(data as any)
    }

    fetchProgress()
  }, [currentLesson, user])

  // Calculate total progress
  useEffect(() => {
    const calculateProgress = async () => {
      if (!user || modules.length === 0) return

      const allLessons = modules.flatMap(m => m.lessons)
      if (allLessons.length === 0) return

      try {
        const results = await Promise.all(
          allLessons.map((l) =>
            apiClient(`/progressions?user_id=${user.id}&lecon_id=${l.id}`).catch(() => null),
          ),
        )
        const completed = results.filter((r) => {
          const list = Array.isArray(r?.data) ? r!.data : []
          return (list[0] as any)?.statut === 'termine'
        }).length
        setTotalProgress(Math.round((completed / allLessons.length) * 100))
      } catch (error) {
        console.error('Error calculating progress:', error)
      }
    }

    calculateProgress()
  }, [modules, user])

  // Mark lesson as complete via progressService
  const markAsComplete = useCallback(async () => {
    if (!currentLesson || !user) return

    const ok = await progressService.markLessonAsCompleted(user.id, currentLesson.id)
    if (ok) {
      setProgress({ statut: 'termine' })
    }
  }, [currentLesson, user])

  // Favoris — chargement de l'état + toggle
  useEffect(() => {
    if (!currentLesson) return
    let active = true
    favoritesService.isFavorite(currentLesson.id).then((fav) => {
      if (active) setIsFavorite(!!fav)
    })
    return () => {
      active = false
    }
  }, [currentLesson])

  const toggleFavorite = useCallback(async () => {
    if (!currentLesson) return
    if (isFavorite) {
      const fav = await favoritesService.isFavorite(currentLesson.id)
      if (fav) {
        const ok = await favoritesService.removeFavorite(fav.id)
        if (ok) setIsFavorite(false)
      }
    } else {
      const fav = await favoritesService.addFavorite(currentLesson.id, String(params.formationId))
      if (fav) setIsFavorite(true)
    }
  }, [currentLesson, isFavorite, params.formationId])

  // Navigation
  const getAllLessons = useCallback(() => {
    return modules.flatMap(m => m.lessons)
  }, [modules])

  const getCurrentIndex = useCallback(() => {
    const allLessons = getAllLessons()
    return allLessons.findIndex(l => l.id === currentLesson?.id)
  }, [getAllLessons, currentLesson])

  const goToPrevious = () => {
    const allLessons = getAllLessons()
    const currentIndex = getCurrentIndex()
    if (currentIndex > 0) {
      router.push(`/cours/${params.formationId}/${allLessons[currentIndex - 1].id}`)
    }
  }

  const goToNext = () => {
    const allLessons = getAllLessons()
    const currentIndex = getCurrentIndex()
    if (currentIndex < allLessons.length - 1) {
      router.push(`/cours/${params.formationId}/${allLessons[currentIndex + 1].id}`)
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A227]"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Connexion requise</h1>
          <p className="text-[rgba(255,255,255,0.6)] mb-6">Connecte-toi pour accéder à ce cours.</p>
          <Link href="/login" className="text-[#C9A227] hover:underline">Se connecter</Link>
        </div>
      </div>
    )
  }

  if (isEnrolled === false) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl mb-4">Accès non autorisé</h1>
          <p className="text-[rgba(255,255,255,0.6)] mb-6">
            Tu n'es pas inscrit(e) à cette formation, ou ton inscription n'est pas encore active.
          </p>
          <Link
            href={`/cours/${params.formationId}`}
            className="text-[#C9A227] hover:underline"
          >
            Voir la formation
          </Link>
        </div>
      </div>
    )
  }

  if (noAccessToContent) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl mb-4">Accès non autorisé</h1>
          <p className="text-[rgba(255,255,255,0.6)] mb-6">
            Cette formation n&apos;est pas gérée par ton compte — tu ne peux consulter que le contenu des
            formations dont tu es responsable.
          </p>
          <Link href="/dashboard/professor" className="text-[#C9A227] hover:underline">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  if (!formation || !currentLesson) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Cours non trouve</h1>
          <Link href="/" className="text-[#C9A227] hover:underline">Retour a l&apos;accueil</Link>
        </div>
      </div>
    )
  }

  const allLessons = getAllLessons()
  const currentIndex = getCurrentIndex()
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < allLessons.length - 1

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 bg-[#0D1B2A] border-r border-[#1a2942] overflow-hidden flex-shrink-0`}>
        <div className="w-80 h-screen flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#1a2942]">
            <Link href="/" className="text-[#C9A227] text-sm hover:underline flex items-center gap-2 mb-3">
              <ChevronLeft className="w-4 h-4" />
              Retour
            </Link>
            <h2 className="font-bold text-lg text-white">{formation.titre}</h2>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progression</span>
                <span>{totalProgress}%</span>
              </div>
              <Progress value={totalProgress} className="h-2 bg-[#1a2942]" />
            </div>
          </div>
          
          {/* Modules list */}
          <div className="flex-1 overflow-y-auto">
            {modules.map((module, moduleIndex) => (
              <div key={module.id} className="border-b border-[#1a2942]">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#1a2942] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#C9A227] text-[#0D1B2A] text-xs font-bold flex items-center justify-center">
                      {moduleIndex + 1}
                    </span>
                    <span className="text-sm font-medium text-left">{module.titre}</span>
                  </div>
                  {expandedModules.includes(module.id) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                {expandedModules.includes(module.id) && (
                  <div className="pb-2">
                    {(() => {
                      const activeIndexInModule = module.lessons.findIndex((l) => l.id === currentLesson.id)
                      const shouldShowAll =
                        expandedLessonLists.has(module.id) ||
                        (activeIndexInModule >= 0 && activeIndexInModule >= LESSONS_PREVIEW_COUNT)
                      const visibleLessons = shouldShowAll
                        ? module.lessons
                        : module.lessons.slice(0, LESSONS_PREVIEW_COUNT)

                      return (
                        <>
                          {visibleLessons.map((lesson, lessonIndex) => {
                            const isActive = lesson.id === currentLesson.id
                            const isCompleted = false // TODO: Check from progress

                            return (
                              <Link
                                key={lesson.id}
                                href={`/cours/${params.formationId}/${lesson.id}`}
                                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                                  isActive 
                                    ? "bg-[#C9A227]/20 border border-[#C9A227]/50" 
                                    : "hover:bg-[#1a2942]"
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#C9A227]" : "text-gray-500"}`} />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm truncate ${isActive ? "text-[#C9A227] font-medium" : "text-gray-300"}`}>
                                    {moduleIndex + 1}.{lessonIndex + 1} {lesson.titre}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                    {lesson.video && <Video className="w-3 h-3" />}
                                    {lesson.document && <FileText className="w-3 h-3" />}
                                  </div>
                                </div>
                              </Link>
                            )
                          })}

                          {module.lessons.length > LESSONS_PREVIEW_COUNT && (
                            <button
                              onClick={() => toggleLessonListExpanded(module.id)}
                              className="w-full text-left text-xs text-[#C9A227] font-medium px-4 py-2 mx-2 hover:underline"
                            >
                              {shouldShowAll
                                ? 'Voir moins'
                                : `Voir les ${module.lessons.length - LESSONS_PREVIEW_COUNT} leçons restantes`}
                            </button>
                          )}
                        </>
                      )
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-[#0D1B2A] border-b border-[#1a2942] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#1a2942] rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <p className="text-xs text-gray-400">
                Lecon {currentIndex + 1} sur {allLessons.length}
              </p>
              <h1 className="font-semibold text-white">{currentLesson.titre}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleFavorite}
              variant="outline"
              size="icon"
              title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              className={isFavorite ? "border-[#C9A227] text-[#C9A227]" : "border-[#1a2942] text-gray-400"}
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-[#C9A227]" : ""}`} />
            </Button>
            {progress?.statut !== 'termine' && (
              <Button
                onClick={markAsComplete}
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500/10"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marquer comme terminé
              </Button>
            )}
            {progress?.statut === 'termine' && (
              <span className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="w-4 h-4" />
                Terminé
              </span>
            )}
          </div>
        </header>
        
        {/* Content tabs */}
        <div className="bg-[#0D1B2A] border-b border-[#1a2942] px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "content" 
                  ? "border-[#C9A227] text-[#C9A227]" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              Cours
            </button>
            <button
              onClick={() => setActiveTab("exercises")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "exercises" 
                  ? "border-[#C9A227] text-[#C9A227]" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Évaluations / TD
              {exercises.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[#C9A227]/20 text-[#C9A227] text-xs rounded-full">
                  {exercises.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "notes" 
                  ? "border-[#C9A227] text-[#C9A227]" 
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <StickyNote className="w-4 h-4 inline mr-2" />
              Notes
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "notes" ? (
            <LessonNotesPanel leconId={currentLesson.id} />
          ) : activeTab === "content" ? (
            <div className="max-w-4xl mx-auto p-6">
              {/* Video section — fichier vidéo réellement uploadé désormais
                  (plus une URL YouTube à embarquer), lecteur natif requis */}
              {currentLesson.video && (
                <div className="mb-8">
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                    <video src={currentLesson.video} controls className="w-full h-full" />
                  </div>
                </div>
              )}

              {/* Support de cours (PDF/Word/PowerPoint) — le PDF s'affiche
                  directement dans la page (essentiel pour les élèves qui
                  préfèrent lire à l'écran plutôt que télécharger), les
                  autres formats restent en téléchargement (un navigateur
                  ne peut pas afficher un .docx/.pptx nativement). */}
              {currentLesson.document && (
                <div className="mb-8">
                  {currentLesson.document.toLowerCase().endsWith('.pdf') ? (
                    <div className="bg-[#0D1B2A] border border-[#1a2942] rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2942]">
                        <span className="flex items-center gap-2 text-white text-sm font-medium">
                          <FileText className="w-4 h-4 text-[#C9A227]" />
                          Support de cours (PDF)
                        </span>
                        <a
                          href={currentLesson.document}
                          download
                          className="flex items-center gap-1.5 text-xs text-[#C9A227] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Télécharger
                        </a>
                      </div>
                      <iframe
                        src={currentLesson.document}
                        title="Support de cours"
                        className="w-full h-[600px] bg-white"
                      />
                    </div>
                  ) : (
                    <a
                      href={currentLesson.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-[#0D1B2A] border border-[#1a2942] hover:border-[#C9A227]/50 rounded-xl p-4 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#C9A227]/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-[#C9A227]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium group-hover:text-[#C9A227] transition-colors">
                          Télécharger le support de cours
                        </p>
                        <p className="text-gray-500 text-xs">Word ou PowerPoint</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#C9A227] transition-colors" />
                    </a>
                  )}
                </div>
              )}
              
              {/* Text content */}
              {currentLesson.contenu && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942]">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-[#1a2942]">{children}</h1>,
                        h2: ({children}) => <h2 className="text-2xl font-bold text-[#60A5FA] mt-8 mb-4">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>,
                        p: ({children}) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>,
                        li: ({children}) => <li className="text-gray-300">{children}</li>,
                        strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                        blockquote: ({children}) => (
                          <blockquote className="border-l-4 border-[#60A5FA] pl-4 py-2 my-4 bg-[#60A5FA]/10 rounded-r-lg">
                            {children}
                          </blockquote>
                        ),
                        table: ({children}) => (
                          <div className="overflow-x-auto my-4">
                            <table className="w-full border-collapse border border-[#1a2942] rounded-lg overflow-hidden">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({children}) => <th className="bg-[#1a2942] px-4 py-3 text-left text-white font-semibold border border-[#1a2942]">{children}</th>,
                        td: ({children}) => <td className="px-4 py-3 text-gray-300 border border-[#1a2942]">{children}</td>,
                        code: ({children}) => <code className="bg-[#1a2942] px-2 py-1 rounded text-[#60A5FA] text-sm">{children}</code>,
                      }}
                    >
                      {currentLesson.contenu}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Évaluations et Travaux Diriges</h2>
              
              {exercises.length === 0 ? (
                <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942] text-center">
                  <Award className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Aucun exercice disponible pour cette lecon.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {exercises.map((exercise, index) => (
                    <Link
                      key={exercise.id}
                      href={`/cours/${params.formationId}/${currentLesson.id}/exercice/${exercise.id}`}
                      className="block bg-[#0D1B2A] rounded-xl p-6 border border-[#1a2942] hover:border-[#C9A227]/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#C9A227]/20 text-[#C9A227] flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-[#C9A227] transition-colors">
                              {exercise.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {exercise.exercise_type === "qcm" && "QCM - Questions a choix multiples"}
                              {exercise.exercise_type === "practical" && "TD - Travail pratique"}
                              {exercise.exercise_type === "text" && "Reponse ecrite"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] text-sm rounded-full">
                            {exercise.points} pts
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#C9A227] transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Bottom navigation */}
        <footer className="bg-[#0D1B2A] border-t border-[#1a2942] px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button
              onClick={goToPrevious}
              disabled={!hasPrevious}
              variant="outline"
              className="border-[#1a2942] text-white hover:bg-[#1a2942] disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Lecon precedente
            </Button>
            
            <div className="text-sm text-gray-400">
              {currentIndex + 1} / {allLessons.length}
            </div>
            
            <Button
              onClick={goToNext}
              disabled={!hasNext}
              className="bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050] disabled:opacity-50"
            >
              Lecon suivante
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </footer>
      </main>
    </div>
  )
}
