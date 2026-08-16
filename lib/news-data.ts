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
    slug: "commis-de-cuisine-le-baobab",
    title: "Commis de cuisine",
    organization: "Restaurant Le Baobab",
    location: "Dakar, Sénégal",
    category: "Emploi",
    description:
      "Recherche un commis de cuisine motivé pour rejoindre une brigade dynamique. Diplôme CAP Cuisine apprécié. Poste à pourvoir immédiatement.",
    details: [
      "Le Restaurant Le Baobab, établissement reconnu de la scène culinaire dakaroise, recherche un(e) commis de cuisine motivé(e) pour renforcer son équipe.",
      "Missions : préparation des ingrédients, mise en place, assistance aux chefs de partie, respect des normes d'hygiène et de sécurité alimentaire.",
      "Profil recherché : titulaire ou en cours d'obtention d'un CAP Cuisine, dynamique, ponctuel(le), esprit d'équipe.",
      "Pour postuler, contacte l'équipe 2I Online via WhatsApp en mentionnant cette offre.",
    ],
    deadline: "2026-06-30",
    tags: ["CAP Cuisine", "Temps plein", "Débutant accepté"],
  },
  {
    id: "2",
    slug: "stage-patisserie-delices-dor",
    title: "Stage en pâtisserie",
    organization: "Pâtisserie Délices d'Or",
    location: "Saly, Sénégal",
    category: "Stage",
    description:
      "Stage de 3 mois en pâtisserie fine. Idéal pour les étudiants en cours de formation CAP Pâtisserie souhaitant acquérir une expérience pratique.",
    details: [
      "La Pâtisserie Délices d'Or, reconnue pour la qualité de ses créations, propose un stage de 3 mois pour un(e) étudiant(e) en pâtisserie.",
      "Au programme : découverte de l'ensemble des postes d'un laboratoire de pâtisserie fine, viennoiseries, entremets et pièces décoratives.",
      "Idéal pour les étudiants en cours de CAP Pâtisserie souhaitant compléter leur formation par une expérience de terrain rémunérée.",
      "Pour postuler, contacte l'équipe 2I Online via WhatsApp en mentionnant cette offre.",
    ],
    deadline: "2026-07-15",
    tags: ["CAP Pâtisserie", "3 mois", "Rémunéré"],
  },
  {
    id: "3",
    slug: "bourse-excellence-2i-online",
    title: "Bourse d'excellence 2I Online",
    organization: "2I Online — Incub Institut",
    location: "En ligne",
    category: "Bourse",
    description:
      "Bourse couvrant 100% des frais de formation pour les candidats les plus méritants. Ouverte à toutes nos formations certifiantes.",
    details: [
      "2I Online lance sa bourse d'excellence, couvrant l'intégralité des frais d'inscription pour les candidats les plus méritants.",
      "Cette bourse est ouverte à l'ensemble de nos formations certifiantes : CAP Cuisinier, Pâtissier, Serveur, ainsi que nos Certificats Professionnels de Spécialité.",
      "Critères de sélection : motivation, situation personnelle, et engagement démontré envers les métiers de l'hôtellerie-restauration.",
      "Pour candidater, contacte l'équipe 2I Online via WhatsApp en mentionnant la bourse d'excellence.",
    ],
    deadline: "2026-06-20",
    tags: ["Toutes formations", "100% financé", "Mérite"],
  },
  {
    id: "4",
    slug: "serveur-hotel-terrou-bi",
    title: "Serveur en salle",
    organization: "Hôtel Terrou-Bi",
    location: "Dakar, Sénégal",
    category: "Emploi",
    description:
      "Établissement hôtelier de prestige recherche des serveurs qualifiés. Formation CAP Service exigée. Excellentes conditions de travail.",
    details: [
      "L'Hôtel Terrou-Bi, établissement hôtelier de prestige à Dakar, recherche des serveurs et serveuses qualifié(e)s pour renforcer son équipe de salle.",
      "Missions : accueil et service des clients, mise en place, conseil sur les boissons et mets, respect des standards de service haut de gamme.",
      "Profil recherché : titulaire d'un CAP Service ou équivalent, présentation soignée, sens du contact client.",
      "Pour postuler, contacte l'équipe 2I Online via WhatsApp en mentionnant cette offre.",
    ],
    deadline: "2026-07-05",
    tags: ["CAP Service", "Temps plein", "Expérience souhaitée"],
  },
  {
    id: "5",
    slug: "concours-jeune-talent-culinaire",
    title: "Concours jeune talent culinaire",
    organization: "2I Online",
    location: "Dakar, Sénégal",
    category: "Concours",
    description:
      "Participez à notre concours culinaire annuel. Démontrez votre créativité et remportez une bourse complète ainsi qu'un stage professionnel.",
    details: [
      "2I Online organise son concours culinaire annuel, ouvert à tous les étudiants inscrits à l'une de nos formations.",
      "Les candidats devront réaliser une création originale mettant en valeur les techniques acquises durant leur formation, jugée par un jury de professionnels du secteur.",
      "À la clé pour le/la gagnant(e) : une bourse complète pour une formation complémentaire ainsi qu'un stage en cuisine professionnelle dans un établissement partenaire.",
      "Pour t'inscrire, contacte l'équipe 2I Online via WhatsApp en mentionnant le concours.",
    ],
    deadline: "2026-06-10",
    tags: ["Étudiants", "Bourse à gagner", "Stage offert"],
  },
  {
    id: "6",
    slug: "assistant-manager-sahel-hospitality",
    title: "Assistant manager restauration",
    organization: "Groupe Sahel Hospitality",
    location: "Mbour, Sénégal",
    category: "Emploi",
    description:
      "Poste évolutif pour diplômés en gestion de restaurant. Encadrement d'équipe et gestion opérationnelle d'un établissement en pleine croissance.",
    details: [
      "Le Groupe Sahel Hospitality recrute un(e) assistant(e) manager pour l'un de ses établissements de restauration à Mbour.",
      "Missions : encadrement d'équipe, gestion opérationnelle quotidienne, suivi des stocks et approvisionnements, garant du respect des normes d'hygiène.",
      "Profil recherché : formation en gestion de restauration, première expérience en encadrement appréciée, sens de l'organisation.",
      "Pour postuler, contacte l'équipe 2I Online via WhatsApp en mentionnant cette offre.",
    ],
    deadline: "2026-07-20",
    tags: ["Management", "Temps plein", "Évolutif"],
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
