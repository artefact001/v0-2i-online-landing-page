export type ActualiteCategory = "Actualité" | "Événement" | "Partenariat" | "Réussite"

export type OpportuniteCategory = "Emploi" | "Stage" | "Bourse" | "Concours"

export interface Actualite {
  id: string
  slug: string
  title: string
  excerpt: string
  category: ActualiteCategory
  image: string
  date: string
  readingTime: string
  featured?: boolean
}

export interface Opportunite {
  id: string
  title: string
  organization: string
  location: string
  category: OpportuniteCategory
  description: string
  deadline: string
  tags: string[]
}

export const actualites: Actualite[] = [
  {
    id: "1",
    slug: "nouvelle-promotion-cap-cuisine-2026",
    title: "Lancement de la nouvelle promotion CAP Cuisine 2026",
    excerpt:
      "Les inscriptions pour la promotion 2026 du CAP Cuisine sont officiellement ouvertes. Rejoignez plus de 500 professionnels déjà formés par 2I Online.",
    category: "Actualité",
    image: "/images/course-cuisine.jpg",
    date: "2026-05-28",
    readingTime: "3 min",
    featured: true,
  },
  {
    id: "2",
    slug: "partenariat-hotels-dakar",
    title: "Partenariat avec les grands hôtels de Dakar",
    excerpt:
      "2I Online signe un accord avec plusieurs établissements hôteliers de la capitale pour faciliter l'insertion professionnelle de nos diplômés.",
    category: "Partenariat",
    image: "/images/course-management.jpg",
    date: "2026-05-20",
    readingTime: "4 min",
  },
  {
    id: "3",
    slug: "masterclass-patisserie-francaise",
    title: "Masterclass exceptionnelle : la pâtisserie française",
    excerpt:
      "Un chef pâtissier renommé animera une masterclass en direct pour tous les étudiants inscrits au CAP Pâtisserie. Une occasion unique d'apprendre des meilleurs.",
    category: "Événement",
    image: "/images/course-patisserie.jpg",
    date: "2026-05-15",
    readingTime: "2 min",
  },
  {
    id: "4",
    slug: "temoignage-reussite-aminata",
    title: "Aminata ouvre son restaurant après sa formation",
    excerpt:
      "Diplômée du CAP Cuisine en 2025, Aminata Diop a ouvert son propre restaurant à Thiès. Retour sur un parcours inspirant rendu possible par 2I Online.",
    category: "Réussite",
    image: "/images/about-learning.jpg",
    date: "2026-05-08",
    readingTime: "5 min",
  },
  {
    id: "5",
    slug: "certification-haccp-reconnue",
    title: "Notre certification HACCP désormais reconnue par l'État",
    excerpt:
      "La formation HACCP de 2I Online obtient la reconnaissance officielle, renforçant la valeur de votre diplôme sur le marché de l'emploi.",
    category: "Actualité",
    image: "/images/course-haccp.jpg",
    date: "2026-04-30",
    readingTime: "3 min",
  },
  {
    id: "6",
    slug: "concours-jeune-talent-culinaire",
    title: "Concours du jeune talent culinaire 2026",
    excerpt:
      "2I Online organise son premier concours culinaire ouvert à tous les étudiants. À la clé : une bourse complète et un stage en cuisine professionnelle.",
    category: "Événement",
    image: "/images/cta-kitchen.jpg",
    date: "2026-04-22",
    readingTime: "4 min",
  },
]

export const opportunites: Opportunite[] = [
  {
    id: "1",
    title: "Commis de cuisine",
    organization: "Restaurant Le Baobab",
    location: "Dakar, Sénégal",
    category: "Emploi",
    description:
      "Recherche un commis de cuisine motivé pour rejoindre une brigade dynamique. Diplôme CAP Cuisine apprécié. Poste à pourvoir immédiatement.",
    deadline: "2026-06-30",
    tags: ["CAP Cuisine", "Temps plein", "Débutant accepté"],
  },
  {
    id: "2",
    title: "Stage en pâtisserie",
    organization: "Pâtisserie Délices d'Or",
    location: "Saly, Sénégal",
    category: "Stage",
    description:
      "Stage de 3 mois en pâtisserie fine. Idéal pour les étudiants en cours de formation CAP Pâtisserie souhaitant acquérir une expérience pratique.",
    deadline: "2026-07-15",
    tags: ["CAP Pâtisserie", "3 mois", "Rémunéré"],
  },
  {
    id: "3",
    title: "Bourse d'excellence 2I Online",
    organization: "2I Online — Incub Institut",
    location: "En ligne",
    category: "Bourse",
    description:
      "Bourse couvrant 100% des frais de formation pour les candidats les plus méritants. Ouverte à toutes nos formations certifiantes.",
    deadline: "2026-06-20",
    tags: ["Toutes formations", "100% financé", "Mérite"],
  },
  {
    id: "4",
    title: "Serveur en salle",
    organization: "Hôtel Terrou-Bi",
    location: "Dakar, Sénégal",
    category: "Emploi",
    description:
      "Établissement hôtelier de prestige recherche des serveurs qualifiés. Formation CAP Service exigée. Excellentes conditions de travail.",
    deadline: "2026-07-05",
    tags: ["CAP Service", "Temps plein", "Expérience souhaitée"],
  },
  {
    id: "5",
    title: "Concours jeune talent culinaire",
    organization: "2I Online",
    location: "Dakar, Sénégal",
    category: "Concours",
    description:
      "Participez à notre concours culinaire annuel. Démontrez votre créativité et remportez une bourse complète ainsi qu'un stage professionnel.",
    deadline: "2026-06-10",
    tags: ["Étudiants", "Bourse à gagner", "Stage offert"],
  },
  {
    id: "6",
    title: "Assistant manager restauration",
    organization: "Groupe Sahel Hospitality",
    location: "Mbour, Sénégal",
    category: "Emploi",
    description:
      "Poste évolutif pour diplômés en gestion de restaurant. Encadrement d'équipe et gestion opérationnelle d'un établissement en pleine croissance.",
    deadline: "2026-07-20",
    tags: ["Management", "Temps plein", "Évolutif"],
  },
]

export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}
