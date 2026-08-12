export interface FormationDetail {
  slug: string
  badge: string
  name: string
  mode: string
  shortDesc: string
  duration: string
  price: string
  popular?: boolean
  image: string
  longDesc: string
  objectives: string[]
  program: string[]
  prerequisites: string
  diploma: string
}

export const formations: FormationDetail[] = [
  {
    slug: "CAP-cuisinier",
    badge: "Populaire",
    name: "CAP Cuisinier",
    mode: "Formation hybride",
    shortDesc:
      "Réaliser des mets en respectant les normes de la gastronomie.",
    duration: "3 ans / 36 mois",
    price: "50 000 F", // TODO: confirmer le vrai tarif d'inscription
    popular: true,
    image: "/images/course-cuisine.jpg",
    longDesc:
      "Le CAP Cuisinier est une formation complète qui vous prépare au métier de cuisinier professionnel. Sur 36 mois, vous apprenez l'ensemble des techniques culinaires, de la préparation des aliments à la réalisation de plats élaborés, en passant par la gestion d'une cuisine professionnelle.",
    objectives: [
      "Maîtriser les techniques fondamentales de la cuisine",
      "Réaliser des mets en respectant les normes de la gastronomie.",
      "Gérer une brigade et organiser un service",
      "Respecter les normes d'hygiène et de sécurité alimentaire",
    ],
    program: [
      "Techniques de base : découpe, cuissons, fonds et sauces",
      "Cuisine française classique et contemporaine",
      "Cuisine africaine revisitée",
      "Bases de la pâtisserie",
      "Gestion des approvisionnements et des coûts",
      "Hygiène HACCP et sécurité",
    ],
    prerequisites: "Aucun diplôme requis. Motivation et passion pour la cuisine.",
    diploma: "Diplôme CAP reconnu par l'État",
  },
  {
    slug: "CAP-Patissier",
    badge: "Artisanat",
    name: "CAP Pâtissier",
    mode: "Formation hybride",
    shortDesc:
      "Pâtisserie française et africaine. Viennoiseries, chocolaterie, gestion d'une pâtisserie.",
    duration: "3 ans / 36 mois",
    price: "50 000 F", // TODO: confirmer le vrai tarif d'inscription
    image: "/images/course-patisserie.jpg",
    longDesc:
      "Le CAP Pâtisserie vous forme aux techniques essentielles de l'art de la pâtisserie sur 36 mois, pour vous ouvrir toutes les portes du métier.",
    objectives: [
      "Réaliser des pâtisseries fines et viennoiseries",
      "Concevoir des entremets et desserts à l'assiette",
      "Gérer une pâtisserie professionnelle",
    ],
    program: [
      "Pâtes de base et crèmes",
      "Viennoiseries",
      "Entremets et gâteaux",
      "Desserts à l'assiette",
      "Hygiène HACCP et sécurité",
    ],
    prerequisites: "Aucun diplôme requis. Sens du détail et créativité.",
    diploma: "Diplôme CAP reconnu par l'État",
  },
  {
    slug: "CAP-serveur",
    badge: "CAP",
    name: "CAP Serveur",
    mode: "Formation hybride",
    shortDesc:
      "L'art du service d'excellence. Mise en place, protocole d'accueil et relation client.",
    duration: "3 ans / 36 mois",
    price: "50 000 F", // TODO: confirmer le vrai tarif d'inscription
    image: "/images/course-service.jpg",
    longDesc:
      "Le CAP Serveur vous prépare au métier de serveur en hôtellerie. Sur 36 mois, vous apprenez l'art du service en salle, la mise en place, le protocole d'accueil, le service des boissons et l'excellence de la relation client.",
    objectives: [
      "Maîtriser les techniques de service en salle",
      "Réaliser une mise en place professionnelle",
      "Conseiller et servir les boissons",
      "Offrir une relation client d'excellence",
    ],
    program: [
      "Mise en place et dressage de table",
      "Techniques de service (assiette, guéridon)",
      "Service des boissons et sommellerie de base",
      "Protocole et accueil client",
      "Encaissement et gestion de salle",
      "Communication interpersonnelle",
      "Hygiène HACCP et sécurité",
    ],
    prerequisites: "Aucun diplôme requis. Sens du contact et présentation soignée.",
    diploma: "Diplôme CAP reconnu par l'État",
  },
  {
    slug: "VAE",
    badge: "Diplômante",
    name: "VAE",
    mode: "Accompagnement personnalisé",
    shortDesc:
      "Validation des Acquis de l'Expérience. Faites reconnaître vos compétences par un diplôme reconnu par l'État.",
    duration: "4 à 6 mois",
    price: "150 000 F",
    image: "/images/VAE.jpg",
    longDesc:
      "La VAE (Validation des Acquis de l'Expérience) permet de transformer votre expérience professionnelle en diplôme reconnu. En 4 à 6 mois, nos formateurs vous accompagnent dans la constitution de votre dossier et la préparation à l'entretien avec le jury.",
    objectives: [
      "Faire reconnaître votre expérience par un diplôme",
      "Constituer un dossier de validation solide",
      "Préparer l'entretien avec le jury",
      "Valoriser votre parcours professionnel",
    ],
    program: [
      "Analyse de votre expérience professionnelle",
      "Choix du diplôme ciblé",
      "Constitution du dossier (livret 1 et 2)",
      "Mentoring personnalisé",
      "Formation technique et pratique",
      "Préparation à l'oral devant le jury",
      "Support administratif complet",
    ],
    prerequisites: "Justifier d'une expérience professionnelle dans le domaine visé.",
    diploma: "Diplôme officiel obtenu par validation",
  },
  {
    slug: "CPS-cuisinier",
    badge: "Spécialité",
    name: "Certificat Professionnel de Spécialité-Cuisinier",
    mode: "Formation hybride / ligne",
    shortDesc:
      "Spécialisation avancée en cuisine pour perfectionner vos techniques et votre expertise.",
    duration: "6 mois",
    price: "75 000 F", // TODO: confirmer le vrai tarif d'inscription
    image: "/images/course-cuisine1.jpg",
    longDesc:
      "Le Certificat Professionnel de Spécialité Cuisinier est une formation courte et intensive de 6 mois destinée à approfondir une spécialité culinaire. Idéale pour les débutants et professionnels souhaitant monter en compétence.",
    objectives: [
      "Approfondir une spécialité culinaire",
      "Perfectionner les techniques",
      "Développer sa créativité culinaire",
      "Obtenir une certification reconnue",
    ],
    program: [
      "Techniques culinaires avancées",
      "Spécialisation au choix",
      "Dressage et présentation moderne",
      "Gestion de production",
      "Projet culinaire, professionnel et personnel",
    ],
    prerequisites: "Expérience ou formation de base en cuisine recommandée.",
    diploma: "Certificat Professionnel de Spécialité",
  },
  {
    slug: "CPS-patissier",
    badge: "Spécialité",
    name: "Certificat Professionnel de Spécialité-Pâtissier",
    mode: "Formation hybride",
    shortDesc:
      "Spécialisation avancée en pâtisserie pour maîtriser les techniques de haut niveau.",
    duration: "6 mois",
    price: "75 000 F", // TODO: confirmer le vrai tarif d'inscription
    image: "/images/course-patisserie1.jpg",
    longDesc:
      "Le Certificat Professionnel de Spécialité Pâtissier est une formation de 6 mois pour approfondir votre maîtrise de la pâtisserie. Un choix parfait pour se spécialiser.",
    objectives: [
      "Maîtriser les techniques de la pâtisserie avancée",
      "Se spécialiser (viennoiserie, entremets...)",
      "Développer une signature pâtissière",
      "Obtenir un certificat reconnu",
    ],
    program: [
      "Pâtisserie de boutique avancée",
      "Entremets modernes",
      "Décoration et finitions",
      "Viennoiserie",
      "Projet personnel",
    ],
    prerequisites: "Expérience ou formation de base en pâtisserie recommandée.",
    diploma: "Certificat Professionnel de Spécialité",
  },
  {
    slug: "CPS-serveur",
    badge: "Spécialité",
    name: "Certificat Professionnel de Spécialité-Serveur",
    mode: "Formation hybride",
    shortDesc:
      "Spécialisation avancée en service pour exceller dans la restauration haut de gamme.",
    duration: "6 mois",
    price: "75 000 F", // TODO: confirmer le vrai tarif d'inscription
    image: "/images/course-service1.jpg",
    longDesc:
      "Le Certificat Professionnel de Spécialité Serveur est une formation de 6 mois axée sur l'excellence du service en restauration gastronomique. Maîtrisez les codes du service haut de gamme.",
    objectives: [
      "Exceller dans le service haut de gamme",
      "Maîtriser le service au guéridon et la découpe",
      "Approfondir la sommellerie",
      "Obtenir une certification reconnue",
    ],
    program: [
      "Service gastronomique avancé",
      "Découpe et flambage en salle",
      "Accords mets-vins",
      "Management de salle",
      "Projet personnel",
    ],
    prerequisites: "Expérience ou formation de base en service recommandée.",
    diploma: "Certificat Professionnel de Spécialité",
  },
  {
    slug: "Travail-A-Domicile",
    badge: "Certifiant",
    name: "Travail à domicile",
    mode: "100% en ligne ou en hybride",
    shortDesc:
      "Formation flexible et autonome, entièrement en ligne, accessible à tous.",
    duration: "1 mois",
    price: "60 000 F",
    image: "/images/travail-domicile.jpg",
    longDesc:
      "La formation Travail à domicile est un programme d'un mois, conçu pour accompagner les travailleurs domestiques dans le développement de leurs compétences.",
    objectives: [
      "Accéder à un contenu téléchargeable",
      "Renforcer les compétences techniques des travailleurs domestiques",
      "Bénéficier d'un forum d'entraide",
      "Obtenir un certificat",
    ],
    program: [
      "Modules vidéo en ligne",
      "Forum d'entraide",
      "Bases de la cuisine",
      "Technique d'entretien de maison ou de bureau",
      "Évaluation finale en ligne",
      "Leadership et développement personnel",
    ],
    prerequisites: "Aucun. Accès à un ordinateur ou smartphone avec internet.",
    diploma: "Certificat de complétion",
  },
  {
    slug: "haccp",
    badge: "Certifiant",
    name: "HACCP",
    mode: "100% en ligne",
    shortDesc:
      "Certification en HACCP obligatoire pour tout professionnel de la restauration.",
    duration: "2 mois",
    price: "100 000 F",
    image: "/images/course-haccp.jpg",
    longDesc:
      "La formation HACCP vous certifie aux normes d'hygiène et de sécurité alimentaire, obligatoires pour tout professionnel de la restauration. En 2 mois, maîtrisez l'analyse des risques et la maîtrise des points critiques.",
    objectives: [
      "Comprendre la méthode HACCP",
      "Identifier et maîtriser les points critiques",
      "Mettre en place un plan de maîtrise sanitaire",
    ],
    program: [
      "Principes de la méthode HACCP",
      "Dangers et analyse des risques",
      "Points critiques de contrôle (CCP)",
      "Plan de nettoyage et désinfection",
      "Traçabilité alimentaire",
    ],
    prerequisites: "Aucun. Recommandé pour tout professionnel de la restauration.",
    diploma: "Certification HACCP",
  },
  {
    slug: "INCUBATION-STREET-FOOD",
    badge: "Entrepreneuriat",
    name: "INCUBATION STREET FOOD",
    mode: "Accompagnement entrepreneurial",
    shortDesc:
      "Lancez votre projet d'alimentation de rue : idéation, étude de marché, business plan, méthode de financement, marketing digital...",
    duration: "3 mois",
    price: "100 000 F",
    image: "/images/incubation-food.jpg",
    longDesc:
      "C'est un programme de 3 mois destiné aux jeunes et aux femmes porteurs de projet dans le secteur de l'alimentation de rue. De l'idée au lancement, nous vous accompagnons dans la construction de votre projet.",
    objectives: [
      "Structurer son idée de projet de restaurant",
      "Évaluer son marché cible",
      "Rédiger son business plan complet",
      "Identifier des sources de financement",
      "Construire sa stratégie marketing",
      "Tester son marché",
    ],
    program: [
      "De l'idée au concept",
      "Business plan et prévisionnel financier",
      "Financement et investisseurs",
      "Marketing digital et réseaux sociaux",
      "Réseau d'affaires et lancement",
    ],
    prerequisites: "Avoir une idée de projet entrepreneurial dans la restauration.",
    diploma: "Attestation d'incubation",
  },
  {
    slug: "Gestion-restauration",
    badge: "Entrepreneuriat",
    name: "Gestion de restauration",
    mode: "100% en ligne",
    shortDesc:
      "Finances, RH, approvisionnement, marketing digital — tout pour gérer votre établissement.",
    duration: "2 mois",
    price: "100 000 F",
    image: "/images/course-management.jpg",
    longDesc:
      "La formation Gestion de restauration vous donne en 2 mois toutes les clés pour gérer un établissement performant : pilotage financier, gestion des équipes, approvisionnements et stratégie commerciale...",
    objectives: [
      "Piloter la gestion financière d'un restaurant",
      "Manager une équipe efficacement",
      "Optimiser les approvisionnements et les coûts",
      "Développer la stratégie commerciale",
    ],
    program: [
      "Gestion financière et marges",
      "Gestion des ressources humaines",
      "Approvisionnement et stocks",
      "Marketing et fidélisation",
      "Pilotage de la performance",
    ],
    prerequisites: "Aucun. Idéal pour gérants et futurs gérants.",
    diploma: "Certificat",
  },
]

export function getFormationBySlug(slug: string): FormationDetail | undefined {
  return formations.find((f) => f.slug === slug)
}
