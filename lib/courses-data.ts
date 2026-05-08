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
    coursesCount: 24
  },
  {
    id: "cap-service",
    name: "CAP Service en Salle",
    description: "Maîtrisez l'art du service en restauration",
    icon: "UtensilsCrossed",
    color: "#E8C050",
    coursesCount: 18
  },
  {
    id: "cap-patisserie",
    name: "CAP Pâtisserie",
    description: "L'excellence de la pâtisserie française",
    icon: "Cake",
    color: "#F5E9C4",
    coursesCount: 21
  },
  {
    id: "haccp",
    name: "HACCP & Hygiène",
    description: "Normes de sécurité alimentaire internationales",
    icon: "ShieldCheck",
    color: "#4ADE80",
    coursesCount: 12
  },
  {
    id: "sommellerie",
    name: "Sommellerie",
    description: "L'art du vin et de l'accord mets-vins",
    icon: "Wine",
    color: "#A855F7",
    coursesCount: 15
  },
  {
    id: "management",
    name: "Management Hôtelier",
    description: "Gestion et direction d'établissements",
    icon: "Building2",
    color: "#3B82F6",
    coursesCount: 16
  }
]

// Live Courses
export const liveCourses: LiveCourse[] = [
  {
    id: "live-1",
    title: "Techniques de découpe professionnelle",
    instructor: "Chef Jean-Baptiste Mensah",
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
    instructor: "Chef Fatou Ndiaye",
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
    instructor: "Dr. Kofi Asante",
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
    instructor: "Chef Marie-Claire Okonkwo",
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
    instructor: "Chef Ibrahima Sow",
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
export const recordedCourses: RecordedCourse[] = [
  // CAP Cuisine
  {
    id: "rec-1",
    title: "Les sauces mères : Fond et bases",
    instructor: "Chef Jean-Baptiste Mensah",
    instructorRole: "Chef Exécutif",
    date: "15 Avril 2024",
    duration: "2h15",
    category: "CAP Cuisine",
    level: "Débutant",
    description: "Maîtrisez les 5 sauces mères de la cuisine française classique.",
    thumbnail: "/images/course-cuisine.jpg",
    views: 1234,
    classId: "cap-cuisine",
    className: "CAP Cuisine"
  },
  {
    id: "rec-2",
    title: "Techniques de cuisson à basse température",
    instructor: "Chef Jean-Baptiste Mensah",
    instructorRole: "Chef Exécutif",
    date: "12 Avril 2024",
    duration: "1h45",
    category: "CAP Cuisine",
    level: "Intermédiaire",
    description: "Sous-vide et cuisson contrôlée pour des résultats parfaits.",
    thumbnail: "/images/course-cuisine.jpg",
    views: 892,
    classId: "cap-cuisine",
    className: "CAP Cuisine"
  },
  {
    id: "rec-3",
    title: "Poissons et fruits de mer : Préparation",
    instructor: "Chef Aminata Keita",
    instructorRole: "Spécialiste Produits de la Mer",
    date: "8 Avril 2024",
    duration: "2h30",
    category: "CAP Cuisine",
    level: "Intermédiaire",
    description: "Écaillage, filetage et techniques de cuisson des produits de la mer.",
    thumbnail: "/images/course-cuisine.jpg",
    views: 756,
    classId: "cap-cuisine",
    className: "CAP Cuisine"
  },
  // CAP Service
  {
    id: "rec-4",
    title: "Mise en place et dressage de table",
    instructor: "Maître d'Hôtel Paul Diatta",
    instructorRole: "Maître d'Hôtel Principal",
    date: "14 Avril 2024",
    duration: "1h30",
    category: "CAP Service",
    level: "Débutant",
    description: "Les standards internationaux de mise en place pour service à la française.",
    thumbnail: "/images/course-service.jpg",
    views: 1567,
    classId: "cap-service",
    className: "CAP Service en Salle"
  },
  {
    id: "rec-5",
    title: "Service à l'assiette vs service au guéridon",
    instructor: "Maître d'Hôtel Paul Diatta",
    instructorRole: "Maître d'Hôtel Principal",
    date: "10 Avril 2024",
    duration: "2h",
    category: "CAP Service",
    level: "Intermédiaire",
    description: "Comparaison et maîtrise des deux styles de service majeurs.",
    thumbnail: "/images/course-service.jpg",
    views: 943,
    classId: "cap-service",
    className: "CAP Service en Salle"
  },
  // CAP Pâtisserie
  {
    id: "rec-6",
    title: "Macarons : De A à Z",
    instructor: "Chef Fatou Ndiaye",
    instructorRole: "Chef Pâtissière",
    date: "13 Avril 2024",
    duration: "3h",
    category: "CAP Pâtisserie",
    level: "Avancé",
    description: "Toutes les techniques pour des macarons parfaits à chaque fois.",
    thumbnail: "/images/course-patisserie.jpg",
    views: 2341,
    classId: "cap-patisserie",
    className: "CAP Pâtisserie"
  },
  {
    id: "rec-7",
    title: "Pâte feuilletée inversée",
    instructor: "Chef Fatou Ndiaye",
    instructorRole: "Chef Pâtissière",
    date: "9 Avril 2024",
    duration: "2h30",
    category: "CAP Pâtisserie",
    level: "Intermédiaire",
    description: "La technique du feuilletage inversé pour des mille-feuilles exceptionnels.",
    thumbnail: "/images/course-patisserie.jpg",
    views: 1876,
    classId: "cap-patisserie",
    className: "CAP Pâtisserie"
  },
  // HACCP
  {
    id: "rec-8",
    title: "Plan de nettoyage et désinfection",
    instructor: "Dr. Kofi Asante",
    instructorRole: "Expert Sécurité Alimentaire",
    date: "11 Avril 2024",
    duration: "1h45",
    category: "HACCP & Hygiène",
    level: "Tous niveaux",
    description: "Élaborer et mettre en œuvre un PND efficace.",
    thumbnail: "/images/course-haccp.jpg",
    views: 2156,
    classId: "haccp",
    className: "HACCP & Hygiène"
  },
  {
    id: "rec-9",
    title: "Traçabilité alimentaire",
    instructor: "Dr. Kofi Asante",
    instructorRole: "Expert Sécurité Alimentaire",
    date: "7 Avril 2024",
    duration: "2h",
    category: "HACCP & Hygiène",
    level: "Intermédiaire",
    description: "Systèmes de traçabilité de la réception à la distribution.",
    thumbnail: "/images/course-haccp.jpg",
    views: 1432,
    classId: "haccp",
    className: "HACCP & Hygiène"
  },
  // Sommellerie
  {
    id: "rec-10",
    title: "Dégustation : Les grands crus de Bourgogne",
    instructor: "Sommelier Amadou Diallo",
    instructorRole: "Maître Sommelier",
    date: "12 Avril 2024",
    duration: "2h",
    category: "Sommellerie",
    level: "Avancé",
    description: "Analyse organoleptique des vins de Bourgogne prestigieux.",
    thumbnail: "/images/course-sommelier.jpg",
    views: 876,
    classId: "sommellerie",
    className: "Sommellerie"
  },
  {
    id: "rec-11",
    title: "Accords mets et vins africains",
    instructor: "Sommelier Amadou Diallo",
    instructorRole: "Maître Sommelier",
    date: "6 Avril 2024",
    duration: "2h30",
    category: "Sommellerie",
    level: "Intermédiaire",
    description: "Marier les vins avec la cuisine traditionnelle africaine.",
    thumbnail: "/images/course-sommelier.jpg",
    views: 1543,
    classId: "sommellerie",
    className: "Sommellerie"
  },
  // Management
  {
    id: "rec-12",
    title: "Gestion des coûts en restauration",
    instructor: "Marie-Claire Okonkwo",
    instructorRole: "Directrice de Restaurant",
    date: "13 Avril 2024",
    duration: "2h15",
    category: "Management Hôtelier",
    level: "Avancé",
    description: "Optimisation des coûts matière et gestion des marges.",
    thumbnail: "/images/course-management.jpg",
    views: 1234,
    classId: "management",
    className: "Management Hôtelier"
  },
  {
    id: "rec-13",
    title: "Recrutement et fidélisation du personnel",
    instructor: "Marie-Claire Okonkwo",
    instructorRole: "Directrice de Restaurant",
    date: "5 Avril 2024",
    duration: "1h45",
    category: "Management Hôtelier",
    level: "Intermédiaire",
    description: "Stratégies RH pour constituer une équipe performante.",
    thumbnail: "/images/course-management.jpg",
    views: 987,
    classId: "management",
    className: "Management Hôtelier"
  }
]
