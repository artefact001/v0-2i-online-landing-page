export type ActualiteCategory = "Actualité" | "Événement" | "Partenariat" | "Réussite"

export type OpportuniteCategory = "Emploi" | "Stage" | "Bourse" | "Concours"

export interface Actualite {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  category: ActualiteCategory
  image: string
  date: string
  readingTime: string
  featured?: boolean
}

export interface Opportunite {
  id: string
  slug: string
  title: string
  organization: string
  location: string
  category: OpportuniteCategory
  description: string
  details: string[]
  deadline: string
  tags: string[]
}

export const actualites: Actualite[] = [
  {
    id: "1",
    slug: "nouvelle-promotion-cap-cuisine-novembre-2026",
    title: "Lancement de la nouvelle promotion CAP Cuisine Novembre 2026",
    excerpt:
      "Les inscriptions pour la promotion Novembre 2026 du CAP Cuisine sont officiellement ouvertes. Rejoignez plus de 500 professionnels déjà formés par 2I Online.",
    content: [
      "2I Online ouvre les inscriptions pour sa nouvelle promotion du CAP Cuisine, avec un démarrage des cours prévu en novembre 2026. Cette formation diplômante de 36 mois s'adresse à toute personne souhaitant faire de la cuisine son métier, sans prérequis particulier.",
      "Au programme : techniques fondamentales de découpe et de cuisson, fonds et sauces, cuisine française classique et contemporaine, cuisine africaine revisitée, bases de la pâtisserie, gestion des approvisionnements et hygiène HACCP.",
      "La formation, disponible en format hybride, combine cours en ligne accessibles à votre rythme et sessions pratiques encadrées par des formateurs expérimentés du secteur de l'hôtellerie-restauration.",
      "Les places étant limitées pour garantir un accompagnement de qualité à chaque étudiant, nous recommandons de finaliser son inscription dès maintenant sur la plateforme.",
    ],
    category: "Actualité",
    image: "/images/course-cuisine.jpg",
    date: "2026-05-28",
    readingTime: "3 min",
    featured: true,
  },
  {
    id: "4",
    slug: "dieynaba-diass-entreprise-formation",
    title: "Dieynaba Thioube et Diass Awa Samb lancent leur entreprise pendant leur formation",
    excerpt:
      "Étudiantes en CAP2 à Incub Institut, nous avons créé notre petite entreprise, Teranga Délice, en parallèle de notre formation. Merci à toute l'équipe et nos formateurs pour leur accompagnement sur mesure et la qualité de leur enseignement.",
    content: [
      "Dieynaba Thioube et Diass Awa Samb sont actuellement étudiantes en deuxième année de CAP à Incub Institut. Sans attendre la fin de leur formation, elles ont décidé de se lancer et de créer ensemble leur petite entreprise : Teranga Délice.",
      "\"Cette formation nous a donné les compétences et la confiance pour entreprendre avec sérénité, dès maintenant, en parallèle de nos cours\", expliquent les deux étudiantes.",
      "Leur parcours illustre parfaitement l'esprit de la formation dispensée par 2I Online et Incub Institut : donner aux étudiants les outils pour se lancer rapidement, sans attendre l'obtention du diplôme, grâce à un accompagnement pédagogique sur mesure.",
      "Toute l'équipe pédagogique de 2I Online félicite Dieynaba et Diass pour cette belle initiative et leur souhaite une pleine réussite pour la suite de leur formation et de leur projet entrepreneurial.",
    ],
    category: "Réussite",
    image: "/images/testimonial-2.jpg",
    date: "2026-05-08",
    readingTime: "5 min",
  },
]

export const opportunites: Opportunite[] = [
  {
    id: "1",
    slug: "bourse-mairie-bargny-hotellerie",
    title: "Bourse d'excellence Mairie de Bargny",
    organization: "Mairie de Bargny",
    location: "Bargny, Sénégal",
    category: "Bourse",
    description:
      "Bourse offerte par la Mairie de Bargny, partenaire de 2I Online, pour les jeunes de Bargny souhaitant se former aux métiers de l'hôtellerie et de la restauration.",
    details: [
      "Dans le cadre de son partenariat avec 2I Online, la Mairie de Bargny offre une bourse d'excellence destinée aux jeunes résidents de la commune souhaitant se former aux métiers de l'hôtellerie et de la restauration.",
      "Cette bourse couvre tout ou partie des frais d'inscription à l'une de nos formations certifiantes (CAP Cuisinier, Pâtissier, Serveur, ou nos Certificats Professionnels de Spécialité), selon la situation du candidat.",
      "Elle s'inscrit dans la volonté de la municipalité de soutenir l'insertion professionnelle des jeunes de Bargny et de développer les compétences locales dans le secteur de l'hôtellerie-restauration.",
      "Critères d'éligibilité : résider à Bargny, être motivé(e) par un métier de l'hôtellerie-restauration, et justifier d'une situation nécessitant un accompagnement financier.",
      "Pour candidater, contacte l'équipe 2I Online via WhatsApp en mentionnant la bourse de la Mairie de Bargny.",
    ],
    deadline: "2026-08-31",
    tags: ["Résidents de Bargny", "Financement partiel ou total", "Métiers de l'hôtellerie"],
  },
]

export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
}

export function getActualiteBySlug(slug: string): Actualite | undefined {
  return actualites.find((a) => a.slug === slug)
}

export function getOpportuniteBySlug(slug: string): Opportunite | undefined {
  return opportunites.find((o) => o.slug === slug)
}
