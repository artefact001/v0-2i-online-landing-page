export interface FormationDetail {
  slug: string
  badge: string
  name: string
  mode: string
  shortDesc: string
  duration: string
  price?: string
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
      "Realiser des mets en respectant les normes de la gastronomie.",
    duration: "3 ans / 36 mois",
    popular: true,
    image: "/images/course-cuisine.jpg",
    longDesc:
      "Le CAP Cuisinier est une formation complete qui vous prepare au metier de cuisinier professionnel. Sur 36 mois, vous apprenez l'ensemble des techniques culinaires, de la preparation des aliments a la realisation de plats elabores, en passant par la gestion d'une cuisine professionnelle.",
    objectives: [
      "Maitriser les techniques fondamentales de la cuisine",
      "Realiser des mets en respectant les normes de la gastronomie.",
      "Gerer une brigade et organiser un service",
      "Respecter les normes d'hygiene et de securite alimentaire",
    ],
    program: [
      "Techniques de base : decoupe, cuissons, fonds et sauces",
      "Cuisine francaise classique et contemporaine",
      "Cuisine africaine revisitee",
      "Bases de la patisserie",
      "Gestion des approvisionnements et des coûts",
      "Hygiène HACCP et sécurité",
    ],
    prerequisites: "Aucun diplome requis. Motivation et passion pour la cuisine.",
    diploma: "Diplome CAP reconnu par l'Etat",
  },
  {
    slug: "CAP-Patissier",
    badge: "Artisanat",
    name: "CAP Pâtissier",
    mode: "Formation hybride",
    shortDesc:
      "Patisserie francaise et africaine. Viennoiseries, chocolaterie, gestion d'une patisserie.",
    duration: "3 ans / 36 mois",
    image: "/images/course-patisserie.jpg",
    longDesc:
      "Le CAP Pâtisserie vous forme aux technique essentielles de l'art de la patisserie sur 36 mois, pour vous ouvrir toutes les portes du métier. ",
    objectives: [
      "Realiser des patisseries fines et viennoiseries",
      "Concevoir des entremets et desserts a l'assiette",
      "Gerer une patisserie professionnelle",
    ],
    program: [
      "Pates de base et cremes",
      "Viennoiseries",
      "Entremets et gateaux",
      "Desserts a l'assiette",
      "Hygiene HACCP et securite",
    ],
    prerequisites: "Aucun diplome requis. Sens du detail et creativite.",
    diploma: "Diplome CAP reconnu par l'Etat",
  },
  {
    slug: "CAP-serveur",
    badge: "CAP",
    name: "CAP Serveur",
    mode: "Formation hybride",
    shortDesc:
      "L'art du service d'excellence. Mise en place, protocole d'accueil et relation client.",
    duration: "3 ans / 36 mois",
    image: "/images/course-service.jpg",
    longDesc:
      "Le CAP Serveur vous prepare au metier de serveur en hôtellerie. Sur 36 mois, vous apprenez l'art du service en salle, la mise en place, le protocole d'accueil, le service des boissons et l'excellence de la relation client.",
    objectives: [
      "Maitriser les techniques de service en salle",
      "Realiser une mise en place professionnelle",
      "Conseiller et servir les boissons",
      "Offrir une relation client d'excellence",
    ],
    program: [
      "Mise en place et dressage de table",
      "Techniques de service (assiette, gueridon)",
      "Service des boissons et sommellerie de base",
      "Protocole et accueil client",
      "Encaissement et gestion de salle",
      "Communication interpersonnel",
      "Hygiene HACCP et securite",
    ],
    prerequisites: "Aucun diplome requis. Sens du contact et presentation soignee.",
    diploma: "Diplome CAP reconnu par l'Etat",
  },
  {
    slug: "VAE",
    badge: "Diplomante",
    name: "VAE",
    mode: "Accompagnement personnalisé",
    shortDesc:
      "Validation des Acquis de l'Experience. Faites reconnaitre vos competences par un diplome reconnu par l'Etat.",
    duration: "4 à 6 mois",
    price: "150 000 F",
    image: "/images/course-management.jpg",
    longDesc:
      "La VAE (Validation des Acquis de l'Experience) permet de transformer votre experience professionnelle en diplome reconnu. En 4 a 6 mois, nos formateurs vous accompagnent dans la constitution de votre dossier et la preparation a l'entretien avec le jury.",
    objectives: [
      "Faire reconnaitre votre experience par un diplome",
      "Constituer un dossier de validation solide",
      "Preparer l'entretien avec le jury",
      "Valoriser votre parcours professionnel",
    ],
    program: [
      "Analyse de votre experience professionnelle",
      "Choix du diplome cible",
      "Constitution du dossier (livret 1 et 2)",
      "Mentoring personnalise",
      "Formation technique et pratique",
      "Preparation a l'oral devant le jury",
      "Support administratif complet",
    ],
    prerequisites: "Justifier d'une experience professionnelle dans le domaine vise.",
    diploma: "Diplome officiel obtenu par validation",
  },
  {
    slug: "CPS-cuisinier",
    badge: "Spécialité",
    name: "Certificat  Professionnel de Spécialité-Cuisinier",
    mode: "Formation hybride / ligne",
    shortDesc:
      "Specialisation avancée en cuisine pour perfectionner vos techniques et votre expertise.",
    duration: " 6 mois",
    image: "/images/course-cuisine.jpg",
    longDesc:
      "Le Certificat Professionnel de Spécialité Cuisinier est une formation courte et intensive de 6 mois destinee a approfondir une specialite culinaire. Ideale pour les débutants  et professionnels souhaitant monter en compétence.",
    objectives: [
      "Approfondir une specialite culinaire",
      "Perfectionner les techniques",
      "Developper sa creativite culinaire",
      "Obtenir une certification reconnue",
    ],
    program: [
      "Techniques culinaires avancees",
      "Specialisation au choix",
      "Dressage et presentation moderne",
      "Gestion de production",
      "Projet culinaire, professionnel et personnel",
    ],
    prerequisites: "Experience ou formation de base en cuisine recommandee.",
    diploma: "Certificat  Professionnel de Specialite",
  },
  {
    slug: "CPS-patissier",
    badge: "Spécialité",
    name: "Certificat  Professionnel de Spécialité-Patissier",
    mode: "Formation hybride",
    shortDesc:
      "Specialisation avancee en patisserie pour maitriser les techniques de haut niveau.",
    duration: "6 mois",
    image: "/images/course-patisserie.jpg",
    longDesc:
      "Le Certificat Professionnel de Spécialité Patissier est une formation de 6 mois pour approfondir votre maitrise de la patisserie. Un choix parfait pour se specialiser.",
    objectives: [
      "Maitriser les techniques de la patisserie avancee",
      "Se specialiser (viennoiserie, entremets...)",
      "Developper une signature patissiere",
      "Obtenir un certificat reconnu",
    ],
    program: [
      "Patisserie de boutique avancee",
      "Entremets modernes",
      "Decoration et finitions",
      "Viénnoiserie",
      "Projet personnel",
    ],
    prerequisites: "Experience ou formation de base en patisserie recommandee.",
    diploma: "Certificat Professionnel de Specialite",
  },
  {
    slug: "CPS-serveur",
    badge: "Spécialité",
    name: "Certificat Professionnel de Spécialité-Serveur",
    mode: "Formation hybride",
    shortDesc:
      "Specialisation avancee en service pour exceller dans la restauration haut de gamme.",
    duration: "6 mois",
    image: "/images/course-service.jpg",
    longDesc:
      "Le Certificat Professionnel de Spécialité Serveur est une formation de 6 mois axée sur l'excellence du service en restauration gastronomique. Maitrisez les codes du service haut de gamme.",
    objectives: [
      "Exceller dans le service haut de gamme",
      "Maitriser le service au gueridon et la decoupe",
      "Approfondir la sommellerie",
      "Obtenir une certification reconnue",
    ],
    program: [
      "Service gastronomique avance",
      "Decoupe et flambage en salle",
      "Accords mets-vins",
      "Management de salle",
      "Projet personnel",
    ],
    prerequisites: "Experience ou formation de base en service recommandee.",
    diploma: "Certificat Professionnel de Specialite",
  },
  {
    slug: "Travail-A-Domicile (TAD)",
    badge: "Certifiant",
    name: "Travail à domicile",
    mode: "100% en ligne ou en hybride",
    shortDesc:
      "Formation flexible et autonome, entierement en ligne, accessible a tous.",
    duration: "1 mois",
    price: "60 000 F",
    image: "/images/course-management.jpg",
    longDesc:
      "La formation Travail à domicile est un programme d'un mois, concu pour accompagner les travailleurs domestiques dans le developpement de leurs compétences.",
    objectives: [
      "Acceder a un contenu telechargeable",
      "Renforcer les compétences technique des travailleurs domestique",
      "Beneficier d'un forum d'entraide",
      "Obtenir un certificat",
    ],
    program: [
      "Modules video en ligne",
      "Forum d'entraide",
      "Bases de la cuisine",
      "Technique d'entretien de maison ou de bureau",
      "Evaluation finale en ligne",
      "Leadership et develppement personel",

    ],
    prerequisites: "Aucun. Acces a un ordinateur ou smartphone avec internet.",
    diploma: "Certificat de completion",
  },
  {
    slug: "HACCP",
    badge: "Certifiant",
    name: "HACCP",
    mode: "100% en ligne",
    shortDesc:
      "Certification en HACCP obligatoire pour tout professionnel de la restauration.",
    duration: "2 mois",
    price: "100 000 F",
    image: "/images/course-haccp.jpg",
    longDesc:
      "La formation HACCP vous certifie aux normes d'hygiene et de securite alimentaire, obligatoires pour tout professionnel de la restauration. En 2 mois, maitrisez l'analyse des risques et la maitrise des points critiques.",
    objectives: [
      "Comprendre la methode HACCP",
      "Identifier et maitriser les points critiques",
      "Mettre en place un plan de maitrise sanitaire",
    ],
    program: [
      "Principes de la methode HACCP",
      "Dangers et analyse des risques",
      "Points critiques de controle (CCP)",
      "Plan de nettoyage et desinfection",
      "Tracabilite alimentaire",
    ],
    prerequisites: "Aucun. Recommandé pour tout professionnel de la restauration.",
    diploma: "Certification HACCP",
  },
  {
    slug: "INCUBATION-STREET FOOD",
    badge: "Entreprenariat",
    name: "INCUBATION STREET FOOD",
    mode: "Accompagnement entreprenarial",
    shortDesc:
      "Lancez votre projet d'alimentation de rue :  ideation, etude de mmarché, business plan, methode de financement, marketing digitale .... ",
    duration: "3 mois",
    price: "100 000 F",
    image: "/images/course-sommelier.jpg",
    longDesc:
      "C'est un programme de 3 mois destiné aux jeunes et aux femmes porteurs de projet de le secteur de l'alimentation de rue. De l'idee au lancement, nous vous accompagnons dans la construction de votre pprojet.",
    objectives: [
      "Structurer son  idée de projet de restaurant",
      "Evaluer son marché cible",
      "Rediger son business plan complet",
      "Identifier des sources de financement",
      "Construire sa strategie marketing",
      "Tester son marché",
    ],
    program: [
      "De l'idee au concept",
      "Business plan et previsionnel financier",
      "Financement et investisseurs",
      "Marketing digital et reseaux sociaux",
      "Reseau d'affaires et lancement",
    ],
    prerequisites: "Avoir une idée de projet entrepreneurial dans la restauration.",
    diploma: "Attestation d'incubation",
  },
  {
    slug: "Gestion d'un Etablissement de Restaurant",
    badge: "Entreprenariat",
    name: "Gestion de restauration",
    mode: "100% en ligne",
    shortDesc:
      "Finances, RH, approvisionnement, marketing digital — tout pour gerer votre etablissement.",
    duration: "2 mois",
    price: "100 000 F",
    image: "/images/course-management.jpg",
    longDesc:
      "La formation Gestion de restauration vous donne en 2 mois toutes les cles pour gerer un etablissement performant : pilotage financier, gestion des equipes, approvisionnements et strategie commerciale...",
    objectives: [
      "Piloter la gestion financiere d'un restaurant",
      "Manager une equipe efficacement",
      "Optimiser les approvisionnements et les couts",
      "Developper la strategie commerciale",
    ],
    program: [
      "Gestion financiere et marges",
      "Gestion des ressources humaines",
      "Approvisionnement et stocks",
      "Marketing et fidelisation",
      "Pilotage de la performance",
    ],
    prerequisites: "Aucun. Ideal pour gerants et futurs gerants.",
    diploma: "Certificat",
  },
]

export function getFormationBySlug(slug: string): FormationDetail | undefined {
  return formations.find((f) => f.slug === slug)
}
