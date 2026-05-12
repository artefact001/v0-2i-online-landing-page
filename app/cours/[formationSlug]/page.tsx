"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { 
  ChevronLeft,
  Clock,
  BookOpen,
  Video,
  Users,
  Award,
  Play,
  CheckCircle,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface Module {
  id: string
  title: string
  description: string
  order_index: number
  lessons: {
    id: string
    title: string
    duration_minutes: number
    is_published: boolean
  }[]
}

interface Formation {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  duration_weeks: number
  level: string
  category: string
}

export default function FormationOverviewPage() {
  const params = useParams()
  const supabase = createClient()

  const [formation, setFormation] = useState<Formation | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [enrolled, setEnrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

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
            lessons (id, title, duration_minutes, is_published)
          `)
          .eq("formation_id", formationData.id)
          .eq("is_published", true)
          .order("order_index")

        if (modulesData) {
          setModules(modulesData)
        }

        // Check enrollment
        if (user) {
          const { data: enrollment } = await supabase
            .from("enrollments")
            .select("*")
            .eq("formation_id", formationData.id)
            .eq("student_id", user.id)
            .eq("status", "active")
            .single()

          setEnrolled(!!enrollment)
          if (enrollment) {
            setProgress(enrollment.progress || 0)
          }
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [params.formationSlug, user, supabase])

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const totalDuration = modules.reduce((acc, m) => 
    acc + m.lessons.reduce((a, l) => a + l.duration_minutes, 0), 0
  )

  const getFirstLessonId = () => {
    if (modules.length > 0 && modules[0].lessons.length > 0) {
      return modules[0].lessons[0].id
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A227]"></div>
      </div>
    )
  }

  if (!formation) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center text-white">
        <p>Formation non trouvee</p>
      </div>
    )
  }

  const courseImages: Record<string, string> = {
    "cap-cuisine": "/images/course-cuisine.jpg",
    "cap-service": "/images/course-service.jpg",
    "cap-patisserie": "/images/course-patisserie.jpg",
    "haccp-hygiene": "/images/course-haccp.jpg",
    "cs-sommellerie": "/images/course-sommelier.jpg",
    "management-restaurant": "/images/course-management.jpg",
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white">
      {/* Header */}
      <header className="bg-[#0D1B2A] border-b border-[#1a2942]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="text-[#C9A227] hover:underline flex items-center gap-2 text-sm">
            <ChevronLeft className="w-4 h-4" />
            Retour aux formations
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#0D1B2A] to-[#0a0f1a]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] text-sm rounded-full mb-4">
                {formation.category}
              </span>
              <h1 className="text-4xl font-bold mb-4 font-serif">{formation.name}</h1>
              <p className="text-gray-400 text-lg mb-6">{formation.description}</p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5 text-[#C9A227]" />
                  <span>{formation.duration_weeks} semaines</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <BookOpen className="w-5 h-5 text-[#C9A227]" />
                  <span>{totalLessons} lecons</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Video className="w-5 h-5 text-[#C9A227]" />
                  <span>{Math.round(totalDuration / 60)}h de video</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Award className="w-5 h-5 text-[#C9A227]" />
                  <span>{formation.level}</span>
                </div>
              </div>

              {enrolled ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Votre progression</span>
                      <span className="text-[#C9A227]">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3 bg-[#1a2942]" />
                  </div>
                  <Link href={`/cours/${formation.slug}/${getFirstLessonId()}`}>
                    <Button className="w-full bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050] text-lg py-6">
                      <Play className="w-5 h-5 mr-2" />
                      {progress > 0 ? 'Continuer le cours' : 'Commencer le cours'}
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href={`/payment?formation=${formation.slug}`}>
                  <Button className="w-full bg-[#C9A227] text-[#0D1B2A] hover:bg-[#E8C050] text-lg py-6">
                    S&apos;inscrire a cette formation
                  </Button>
                </Link>
              )}
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <Image
                  src={courseImages[formation.slug] || "/images/course-cuisine.jpg"}
                  alt={formation.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {enrolled && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-sm rounded-full flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Inscrit
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8">Programme de la formation</h2>

        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <div key={module.id} className="bg-[#0D1B2A] rounded-xl border border-[#1a2942] overflow-hidden">
              <div className="p-6 border-b border-[#1a2942]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#C9A227] text-[#0D1B2A] flex items-center justify-center font-bold">
                    {moduleIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{module.title}</h3>
                    <p className="text-gray-400 text-sm">{module.lessons.length} lecons</p>
                  </div>
                </div>
                {module.description && (
                  <p className="text-gray-400 text-sm mt-3 ml-14">{module.description}</p>
                )}
              </div>

              <div className="divide-y divide-[#1a2942]">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {enrolled ? (
                        <Play className="w-5 h-5 text-[#C9A227]" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-500" />
                      )}
                      <div>
                        <p className={`${enrolled ? 'text-white' : 'text-gray-400'}`}>
                          {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                        </p>
                        <p className="text-gray-500 text-sm">{lesson.duration_minutes} min</p>
                      </div>
                    </div>
                    
                    {enrolled && (
                      <Link href={`/cours/${formation.slug}/${lesson.id}`}>
                        <Button variant="ghost" size="sm" className="text-[#C9A227] hover:bg-[#C9A227]/10">
                          Voir
                        </Button>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="bg-[#0D1B2A] rounded-xl p-8 border border-[#1a2942] text-center">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">Le contenu de cette formation sera bientot disponible.</p>
          </div>
        )}
      </section>
    </div>
  )
}
