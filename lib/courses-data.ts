// Types
export interface LiveCourse {
  id: string
  title: string
  instructor: string
  instructorRole: string
  date: string
  time: string
  duration: string
  category: string
  level: string
  description: string
  thumbnail: string
  isLive: boolean
  participantsCount: number
  maxParticipants: number
}

export interface RecordedCourse {
  id: string
  title: string
  instructor: string
  instructorRole: string
  date: string
  duration: string
  category: string
  level: string
  description: string
  thumbnail: string
  views: number
  classId: string
  className: string
}

export interface CourseClass {
  id: string
  name: string
  description: string
  icon: string
  color: string
  coursesCount: number
}

// Course Classes
export const courseClasses: CourseClass[] = [
  {
    id: "cap-cuisine",
    name: "CAP Cuisine",
    description: "Formation complète aux techniques culinaires professionnelles",
    icon: "ChefHat",
    color: "#C9A227",
    coursesCount: 0
  },
  {
    id: "cap-service",
    name: "CAP Service en Salle",
    description: "Maîtrisez l'art du service en restauration",
    icon: "UtensilsCrossed",
    color: "#E8C050",
    coursesCount: 0
  },
  {
    id: "cap-patisserie",
    name: "CAP Pâtisserie",
    description: "L'excellence de la pâtisserie française",
    icon: "Cake",
    color: "#F5E9C4",
    coursesCount: 0
  },
  {
    id: "haccp",
    name: "HACCP & Hygiène",
    description: "Normes de sécurité alimentaire internationales",
    icon: "ShieldCheck",
    color: "#4ADE80",
    coursesCount: 0
  },
  {
    id: "sommellerie",
    name: "Sommellerie",
    description: "L'art du vin et de l'accord mets-vins",
    icon: "Wine",
    color: "#A855F7",
    coursesCount: 0
  },
  {
    id: "management",
    name: "Management Hôtelier",
    description: "Gestion et direction d'établissements",
    icon: "Building2",
    color: "#3B82F6",
    coursesCount: 0
  }
]

// Live Courses
export const liveCourses: LiveCourse[] = [
  {
    id: "live-1",
    title: "Techniques de découpe professionnelle",
    instructor: "Chef Boubacar Diop",
    instructorRole: "Chef Exécutif - 15 ans d'expérience",
    date: "Aujourd'hui",
    time: "14:00",
    duration: "2h",
    category: "CAP Cuisine",
    level: "Débutant",
    description: "Apprenez les techniques fondamentales de découpe : julienne, brunoise, chiffonnade et plus encore.",
    thumbnail: "/images/course-cuisine.jpg",
    isLive: true,
    participantsCount: 45,
    maxParticipants: 100
  },
  {
    id: "live-2",
    title: "Service du vin en restaurant gastronomique",
    instructor: "Sommelier Amadou Diallo",
    instructorRole: "Maître Sommelier Certifié",
    date: "Aujourd'hui",
    time: "16:30",
    duration: "1h30",
    category: "Sommellerie",
    level: "Intermédiaire",
    description: "Les codes du service du vin, de la présentation à la dégustation client.",
    thumbnail: "/images/course-sommelier.jpg",
    isLive: false,
    participantsCount: 28,
    maxParticipants: 50
  },
  {
    id: "live-3",
    title: "Pâtisserie : Les bases de la viennoiserie",
    instructor: "Chef Goudiabi",
    instructorRole: "Chef Pâtissière - Meilleur Ouvrier",
    date: "Demain",
    time: "09:00",
    duration: "3h",
    category: "CAP Pâtisserie",
    level: "Débutant",
    description: "Croissants, pains au chocolat, brioches : maîtrisez les fondamentaux.",
    thumbnail: "/images/course-patisserie.jpg",
    isLive: false,
    participantsCount: 67,
    maxParticipants: 100
  },
  {
    id: "live-4",
    title: "HACCP : Analyse des risques en cuisine",
    instructor: "Mr. Diarra",
    instructorRole: "Expert Sécurité Alimentaire",
    date: "Demain",
    time: "11:00",
    duration: "2h",
    category: "HACCP & Hygiène",
    level: "Tous niveaux",
    description: "Identification et gestion des points critiques de contrôle.",
    thumbnail: "/images/course-haccp.jpg",
    isLive: false,
    participantsCount: 89,
    maxParticipants: 150
  },
  {
    id: "live-5",
    title: "Leadership en cuisine : Gérer son équipe",
    instructor: "Chef Boubacar Diop",
    instructorRole: "Directrice de Restaurant",
    date: "Vendredi",
    time: "14:00",
    duration: "2h30",
    category: "Management Hôtelier",
    level: "Avancé",
    description: "Communication, motivation et gestion des conflits en brigade.",
    thumbnail: "/images/course-management.jpg",
    isLive: false,
    participantsCount: 34,
    maxParticipants: 50
  },
  {
    id: "live-6",
    title: "L'art du dressage moderne",
    instructor: "Chef Boubacar Diop",
    instructorRole: "Chef Créatif - 2 étoiles Michelin",
    date: "Samedi",
    time: "10:00",
    duration: "2h",
    category: "CAP Cuisine",
    level: "Intermédiaire",
    description: "Techniques de présentation contemporaines pour sublimer vos plats.",
    thumbnail: "/images/course-cuisine.jpg",
    isLive: false,
    participantsCount: 52,
    maxParticipants: 75
  }
]

// Recorded Courses by Class
export const recordedCourses: RecordedCourse[] = []
// Vidé volontairement : ces cours étaient des données de démonstration,
// non connectées au backend. Réactiver une vraie source de données quand
// la fonctionnalité "cours enregistrés" sera implémentée côté Laravel.
