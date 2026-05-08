import { User, UserRole } from './auth-context'

// Types for the platform data
export interface Formation {
  id: string
  name: string
  slug: string
  description: string
  duration: string
  price: number
  image: string
  professorId?: string
  studentsCount: number
  coursesCount: number
  color: string
}

export interface Professor {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  speciality: string
  formations: string[]
  studentsCount: number
  coursesCount: number
  rating: number
  createdAt: string
}

export interface Student {
  id: string
  name: string
  email: string
  avatar: string
  formation: string
  progress: number
  enrolledAt: string
  lastActive: string
  completedCourses: number
  totalCourses: number
  status: 'active' | 'inactive' | 'graduated'
}

export interface Course {
  id: string
  title: string
  description: string
  formationId: string
  professorId: string
  duration: string
  videoUrl?: string
  thumbnail: string
  order: number
  isLive: boolean
  scheduledAt?: string
  viewsCount: number
  completedBy: string[]
}

export interface LiveSession {
  id: string
  title: string
  courseId: string
  professorId: string
  formationId: string
  startTime: string
  endTime: string
  isLive: boolean
  participantsCount: number
  maxParticipants: number
  status: 'scheduled' | 'live' | 'completed' | 'cancelled'
}

// Demo Data
export const FORMATIONS: Formation[] = [
  {
    id: 'cap-cuisine',
    name: 'CAP Cuisine',
    slug: 'cap-cuisine',
    description: 'Formation complète aux techniques culinaires françaises et africaines',
    duration: '12 mois',
    price: 150000,
    image: '/images/course-cuisine.jpg',
    studentsCount: 45,
    coursesCount: 24,
    color: '#C9A227',
  },
  {
    id: 'cap-service',
    name: 'CAP Service en Salle',
    slug: 'cap-service',
    description: 'Maîtrisez l\'art du service en restauration haut de gamme',
    duration: '10 mois',
    price: 120000,
    image: '/images/course-service.jpg',
    studentsCount: 32,
    coursesCount: 18,
    color: '#2E5A88',
  },
  {
    id: 'cap-patisserie',
    name: 'CAP Pâtisserie',
    slug: 'cap-patisserie',
    description: 'Devenez expert en pâtisserie française et créations sucrées',
    duration: '12 mois',
    price: 160000,
    image: '/images/course-patisserie.jpg',
    studentsCount: 28,
    coursesCount: 22,
    color: '#D4A574',
  },
  {
    id: 'haccp',
    name: 'HACCP & Hygiène',
    slug: 'haccp',
    description: 'Certification en hygiène alimentaire et sécurité',
    duration: '2 mois',
    price: 45000,
    image: '/images/course-haccp.jpg',
    studentsCount: 120,
    coursesCount: 8,
    color: '#4CAF50',
  },
  {
    id: 'sommellerie',
    name: 'CS Sommellerie',
    slug: 'sommellerie',
    description: 'Formation spécialisée en œnologie et service des vins',
    duration: '6 mois',
    price: 95000,
    image: '/images/course-sommelier.jpg',
    studentsCount: 18,
    coursesCount: 12,
    color: '#722F37',
  },
  {
    id: 'management',
    name: 'Management Restaurant',
    slug: 'management',
    description: 'Gestion et direction d\'établissements de restauration',
    duration: '8 mois',
    price: 180000,
    image: '/images/course-management.jpg',
    studentsCount: 22,
    coursesCount: 16,
    color: '#1A1A2E',
  },
]

export const PROFESSORS: Professor[] = [
  {
    id: '2',
    name: 'Chef Kouamé Yao',
    email: 'chef.kouame@2ionline.com',
    avatar: '/images/testimonial-1.jpg',
    bio: 'Chef exécutif avec 20 ans d\'expérience dans la haute gastronomie. Formé à l\'Institut Paul Bocuse.',
    speciality: 'Cuisine française et fusion africaine',
    formations: ['cap-cuisine', 'haccp'],
    studentsCount: 65,
    coursesCount: 32,
    rating: 4.9,
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Professeur Amadou Diallo',
    email: 'prof.diallo@2ionline.com',
    avatar: '/images/testimonial-3.jpg',
    bio: 'Maître d\'hôtel certifié, 15 ans d\'expérience dans les palaces internationaux.',
    speciality: 'Service en salle et protocole',
    formations: ['cap-service', 'sommellerie'],
    studentsCount: 50,
    coursesCount: 30,
    rating: 4.8,
    createdAt: '2024-02-01',
  },
  {
    id: '6',
    name: 'Chef Fatou Sow',
    email: 'chef.sow@2ionline.com',
    avatar: '/images/testimonial-1.jpg',
    bio: 'Pâtissière renommée, ancienne cheffe pâtissière du Ritz Paris.',
    speciality: 'Pâtisserie fine et chocolaterie',
    formations: ['cap-patisserie'],
    studentsCount: 28,
    coursesCount: 22,
    rating: 4.95,
    createdAt: '2024-01-20',
  },
  {
    id: '7',
    name: 'M. Olivier Koffi',
    email: 'olivier.koffi@2ionline.com',
    avatar: '/images/testimonial-2.jpg',
    bio: 'Consultant en restauration et ancien directeur de plusieurs établissements étoilés.',
    speciality: 'Management et gestion',
    formations: ['management'],
    studentsCount: 22,
    coursesCount: 16,
    rating: 4.7,
    createdAt: '2024-02-15',
  },
]

export const STUDENTS: Student[] = [
  {
    id: '4',
    name: 'Marie Koné',
    email: 'eleve.marie@2ionline.com',
    avatar: '/images/testimonial-1.jpg',
    formation: 'cap-cuisine',
    progress: 68,
    enrolledAt: '2024-03-01',
    lastActive: '2024-12-10',
    completedCourses: 16,
    totalCourses: 24,
    status: 'active',
  },
  {
    id: '5',
    name: 'Jean-Baptiste Mensah',
    email: 'eleve.jean@2ionline.com',
    avatar: '/images/testimonial-2.jpg',
    formation: 'cap-service',
    progress: 45,
    enrolledAt: '2024-03-15',
    lastActive: '2024-12-09',
    completedCourses: 8,
    totalCourses: 18,
    status: 'active',
  },
  {
    id: '8',
    name: 'Aminata Traoré',
    email: 'aminata.t@2ionline.com',
    avatar: '/images/testimonial-1.jpg',
    formation: 'cap-patisserie',
    progress: 82,
    enrolledAt: '2024-02-01',
    lastActive: '2024-12-10',
    completedCourses: 18,
    totalCourses: 22,
    status: 'active',
  },
  {
    id: '9',
    name: 'Kwame Asante',
    email: 'kwame.a@2ionline.com',
    avatar: '/images/testimonial-3.jpg',
    formation: 'cap-cuisine',
    progress: 100,
    enrolledAt: '2024-01-01',
    lastActive: '2024-11-30',
    completedCourses: 24,
    totalCourses: 24,
    status: 'graduated',
  },
  {
    id: '10',
    name: 'Awa Diop',
    email: 'awa.d@2ionline.com',
    avatar: '/images/testimonial-1.jpg',
    formation: 'haccp',
    progress: 25,
    enrolledAt: '2024-11-01',
    lastActive: '2024-12-08',
    completedCourses: 2,
    totalCourses: 8,
    status: 'active',
  },
  {
    id: '11',
    name: 'Ibrahim Camara',
    email: 'ibrahim.c@2ionline.com',
    avatar: '/images/testimonial-2.jpg',
    formation: 'sommellerie',
    progress: 50,
    enrolledAt: '2024-06-01',
    lastActive: '2024-12-05',
    completedCourses: 6,
    totalCourses: 12,
    status: 'active',
  },
  {
    id: '12',
    name: 'Fatoumata Bamba',
    email: 'fatoumata.b@2ionline.com',
    avatar: '/images/testimonial-1.jpg',
    formation: 'management',
    progress: 35,
    enrolledAt: '2024-07-01',
    lastActive: '2024-12-10',
    completedCourses: 5,
    totalCourses: 16,
    status: 'active',
  },
  {
    id: '13',
    name: 'Moussa Ndiaye',
    email: 'moussa.n@2ionline.com',
    avatar: '/images/testimonial-3.jpg',
    formation: 'cap-service',
    progress: 0,
    enrolledAt: '2024-12-01',
    lastActive: '2024-12-01',
    completedCourses: 0,
    totalCourses: 18,
    status: 'inactive',
  },
]

export const LIVE_SESSIONS: LiveSession[] = [
  {
    id: 'ls1',
    title: 'Techniques de découpe avancées',
    courseId: 'c1',
    professorId: '2',
    formationId: 'cap-cuisine',
    startTime: '2024-12-11T10:00:00',
    endTime: '2024-12-11T12:00:00',
    isLive: true,
    participantsCount: 23,
    maxParticipants: 50,
    status: 'live',
  },
  {
    id: 'ls2',
    title: 'Service du vin - Pratique',
    courseId: 'c2',
    professorId: '3',
    formationId: 'sommellerie',
    startTime: '2024-12-11T14:00:00',
    endTime: '2024-12-11T16:00:00',
    isLive: false,
    participantsCount: 0,
    maxParticipants: 30,
    status: 'scheduled',
  },
  {
    id: 'ls3',
    title: 'Introduction aux macarons',
    courseId: 'c3',
    professorId: '6',
    formationId: 'cap-patisserie',
    startTime: '2024-12-12T09:00:00',
    endTime: '2024-12-12T11:00:00',
    isLive: false,
    participantsCount: 0,
    maxParticipants: 40,
    status: 'scheduled',
  },
]

// Platform statistics
export const PLATFORM_STATS = {
  totalStudents: 265,
  totalProfessors: 4,
  totalFormations: 6,
  totalCourses: 100,
  activeNow: 45,
  completionRate: 78,
  averageRating: 4.85,
  revenue: 12500000,
}

// Helper functions
export function getFormationById(id: string): Formation | undefined {
  return FORMATIONS.find(f => f.id === id)
}

export function getProfessorById(id: string): Professor | undefined {
  return PROFESSORS.find(p => p.id === id)
}

export function getStudentsByFormation(formationId: string): Student[] {
  return STUDENTS.filter(s => s.formation === formationId)
}

export function getProfessorsByFormation(formationId: string): Professor[] {
  return PROFESSORS.filter(p => p.formations.includes(formationId))
}

export function getStudentsByProfessor(professorId: string): Student[] {
  const professor = getProfessorById(professorId)
  if (!professor) return []
  return STUDENTS.filter(s => professor.formations.includes(s.formation))
}
