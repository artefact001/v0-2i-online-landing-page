"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
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
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Lesson {
  id: string
  title: string
  description: string
  video_url: string | null
  content: string | null
  duration_minutes: number
  order_index: number
  is_published: boolean
  module_id: string
}

interface Module {
  id: string
  title: string
  order_index: number
  lessons: Lesson[]
}

interface Formation {
  id: string
  name: string
  slug: string
}

interface LessonProgress {
  is_completed: boolean
  watch_time_seconds: number
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
  const supabase = createClient()

  const [formation, setFormation] = useState<Formation | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<"content" | "exercises">("content")
  const [loading, setLoading] = useState(true)
  const [totalProgress, setTotalProgress] = useState(0)
  const [user, setUser] = useState<any>(null)

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  // Fetch formation and modules
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      
      // Fetch formation
      const { data: formationData } = await supabase
        .from("formations")
        .select("*")
        .eq("slug", params.formationSlug)
        .single()
      
      if (formationData) {
        setFormation(formationData)
        
        // Fetch modules with lessons
        const { data: modulesData } = await supabase
          .from("modules")
          .select(`
            *,
            lessons (*)
          `)
          .eq("formation_id", formationData.id)
          .eq("is_published", true)
          .order("order_index")
        
        if (modulesData) {
          const sortedModules = modulesData.map(m => ({
            ...m,
            lessons: m.lessons?.sort((a: Lesson, b: Lesson) => a.order_index - b.order_index) || []
          }))
          setModules(sortedModules)
          
          // Expand all modules by default
          setExpandedModules(sortedModules.map(m => m.id))
          
          // Find current lesson
          if (params.lessonId) {
            for (const mod of sortedModules) {
              const lesson = mod.lessons.find((l: Lesson) => l.id === params.lessonId)
              if (lesson) {
                setCurrentLesson(lesson)
                break
              }
            }
          } else if (sortedModules.length > 0 && sortedModules[0].lessons.length > 0) {
            // Redirect to first lesson
            router.push(`/cours/${params.formationSlug}/${sortedModules[0].lessons[0].id}`)
          }
        }
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [params.formationSlug, params.lessonId, supabase, router])

  // Fetch exercises for current lesson
  useEffect(() => {
    const fetchExercises = async () => {
      if (!currentLesson) return
      
      const { data } = await supabase
        .from("exercises")
        .select("*")
        .eq("lesson_id", currentLesson.id)
        .order("order_index")
      
      if (data) setExercises(data)
    }
    
    fetchExercises()
  }, [currentLesson, supabase])

  // Fetch lesson progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentLesson || !user) return
      
      const { data } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("lesson_id", currentLesson.id)
        .eq("student_id", user.id)
        .single()
      
      if (data) setProgress(data)
    }
    
    fetchProgress()
  }, [currentLesson, user, supabase])

  // Calculate total progress
  useEffect(() => {
    const calculateProgress = async () => {
      if (!user || modules.length === 0) return
      
      const allLessons = modules.flatMap(m => m.lessons)
      if (allLessons.length === 0) return
      
      const { data } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("student_id", user.id)
        .eq("is_completed", true)
        .in("lesson_id", allLessons.map(l => l.id))
      
      if (data) {
        setTotalProgress(Math.round((data.length / allLessons.length) * 100))
      }
    }
    
    calculateProgress()
  }, [modules, user, supabase])

  // Mark lesson as complete
  const markAsComplete = useCallback(async () => {
    if (!currentLesson || !user) return
    
    const { error } = await supabase
      .from("lesson_progress")
      .upsert({
        student_id: user.id,
        lesson_id: currentLesson.id,
        is_completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: "student_id,lesson_id"
      })
    
    if (!error) {
      setProgress(prev => prev ? { ...prev, is_completed: true } : { is_completed: true, watch_time_seconds: 0 })
    }
  }, [currentLesson, user, supabase])

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
      router.push(`/cours/${params.formationSlug}/${allLessons[currentIndex - 1].id}`)
    }
  }

  const goToNext = () => {
    const allLessons = getAllLessons()
    const currentIndex = getCurrentIndex()
    if (currentIndex < allLessons.length - 1) {
      router.push(`/cours/${params.formationSlug}/${allLessons[currentIndex + 1].id}`)
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
            <h2 className="font-bold text-lg text-white">{formation.name}</h2>
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
                    <span className="text-sm font-medium text-left">{module.title}</span>
                  </div>
                  {expandedModules.includes(module.id) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                {expandedModules.includes(module.id) && (
                  <div className="pb-2">
                    {module.lessons.map((lesson, lessonIndex) => {
                      const isActive = lesson.id === currentLesson.id
                      const isCompleted = false // TODO: Check from progress
                      
                      return (
                        <Link
                          key={lesson.id}
                          href={`/cours/${params.formationSlug}/${lesson.id}`}
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
                              {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              {lesson.video_url && <Video className="w-3 h-3" />}
                              {lesson.content && <FileText className="w-3 h-3" />}
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration_minutes} min</span>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
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
              <h1 className="font-semibold text-white">{currentLesson.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!progress?.is_completed && (
              <Button
                onClick={markAsComplete}
                variant="outline"
                className="border-green-500 text-green-500 hover:bg-green-500/10"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marquer comme termine
              </Button>
            )}
            {progress?.is_completed && (
              <span className="flex items-center gap-2 text-green-500 text-sm">
                <CheckCircle className="w-4 h-4" />
                Termine
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
              Exercices / TD
              {exercises.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-[#C9A227]/20 text-[#C9A227] text-xs rounded-full">
                  {exercises.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "content" ? (
            <div className="max-w-4xl mx-auto p-6">
              {/* Video section */}
              {currentLesson.video_url && (
                <div className="mb-8">
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
                    <iframe
                      src={currentLesson.video_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              
              {/* Text content */}
              {currentLesson.content && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942]">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="text-3xl font-bold text-white mb-6 pb-4 border-b border-[#1a2942]">{children}</h1>,
                        h2: ({children}) => <h2 className="text-2xl font-bold text-[#C9A227] mt-8 mb-4">{children}</h2>,
                        h3: ({children}) => <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>,
                        p: ({children}) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                        ul: ({children}) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>,
                        ol: ({children}) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>,
                        li: ({children}) => <li className="text-gray-300">{children}</li>,
                        strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                        blockquote: ({children}) => (
                          <blockquote className="border-l-4 border-[#C9A227] pl-4 py-2 my-4 bg-[#C9A227]/10 rounded-r-lg">
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
                        code: ({children}) => <code className="bg-[#1a2942] px-2 py-1 rounded text-[#C9A227] text-sm">{children}</code>,
                      }}
                    >
                      {currentLesson.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Exercices et Travaux Diriges</h2>
              
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
                      href={`/cours/${params.formationSlug}/${currentLesson.id}/exercice/${exercise.id}`}
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
