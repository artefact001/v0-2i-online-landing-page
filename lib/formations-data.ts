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
    slug: "cap-cuisinier",
    badge: "Populaire",
    name: "CAP Cuisinier",
    mode: "Formation hybride",
    shortDesc:
      "Maitrisez l'art de la haute gastronomie. Techniques francaises, cuisine africaine revisitee, gestion de brigade.",
    duration: "3 ans / 36 mois",
    popular: true,
    image: "/images/course-cuisine.jpg",
    longDesc:
      "Le CAP Cuisinier est une formation complete qui vous prepare au metier de cuisinier professionnel. Sur 36 mois, vous apprenez l'ensemble des techniques culinaires, de la preparation des aliments a la realisation de plats elabores, en passant par la gestion d'une cuisine professionnelle.",
    objectives: [
      "Maitriser les techniques fondamentales de cuisine",
      "Realiser des plats de la gastronomie francaise et africaine",
      "Gerer une brigade et organiser un service",
      "Respecter les normes d'hygiene et de securite alimentaire",
    ],
    program: [
      "Techniques de base : decoupe, cuissons, fonds et sauces",
      "Cuisine francaise classique et contemporaine",
      "Cuisine africaine revisitee",
      "Patisserie de restaurant",
      "Gestion des approvisionnements et des couts",
      "Hygiene HACCP et securite",
    ],
    prerequisites: "Aucun diplome requis. Motivation et passion pour la cuisine.",
    diploma: "Diplome CAP reconnu par l'Etat",
  },
  {
    slug: "cap-patisserie",
    badge: "Artisanat",
    name: "CAP Pâtisserie",
    mode: "Formation hybride",
    shortDesc:
      "Patisserie francaise et africaine. Viennoiseries, chocolaterie, gestion d'une patisserie.",
    duration: "3 ans / 36 mois",
    image: "/images/course-patisserie.jpg",
    longDesc:
      "Le CAP Pâtisserie vous forme a l'art de la patisserie fine. Pendant 36 mois, vous developpez votre maitrise des viennoiseries, entremets, chocolaterie et desserts a l'assiette, tout en apprenant a gerer une patisserie professionnelle.",
    objectives: [
      "Realiser des patisseries fines et viennoiseries",
      "Maitriser la chocolaterie et le travail du sucre",
      "Concevoir des entremets et desserts a l'assiette",
      "Gerer une patisserie professionnelle",
    ],
    program: [
      "Pates de base et cremes",
      "Viennoiseries et pains speciaux",
      "Entremets et gateaux de voyage",
      "Chocolaterie et confiserie",
      "Desserts a l'assiette",
      "Hygiene HACCP et securite",
    ],
    prerequisites: "Aucun diplome requis. Sens du detail et creativite.",
    diploma: "Diplome CAP reconnu par l'Etat",
  },
  {
    slug: "cap-serveur",
    badge: "CAP",
    name: "CAP Serveur",
    mode: "Formation hybride",
    shortDesc:
      "L'art du service d'excellence. Mise en place, protocole, sommellerie de base et relation client.",
    duration: "3 ans / 36 mois",
    image: "/images/course-service.jpg",
    longDesc:
      "Le CAP Serveur vous prepare au metier de serveur en restauration. Sur 36 mois, vous apprenez l'art du service en salle, la mise en place, le protocole, le service des boissons et l'excellence de la relation client.",
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
      "Hygiene HACCP et securite",
    ],
    prerequisites: "Aucun diplome requis. Sens du contact et presentation soignee.",
    diploma: "Diplome CAP reconnu par l'Etat",
  },
  {
    slug: "vae",
    badge: "Diplomante",
    name: "VAE",
    mode: "Accompagnement personnalise",
    shortDesc:
      "Validation des Acquis de l'Experience. Faites reconnaitre vos competences par un diplome officiel.",
    duration: "4 à 6 mois",
    price: "150 000 F",
    image: "/images/course-management.jpg",
    longDesc:
      "La VAE (Validation des Acquis de l'Experience) permet de transformer votre experience professionnelle en diplome reconnu. En 4 a 6 mois, nos experts vous accompagnent dans la constitution de votre dossier et la preparation a l'entretien avec le jury.",
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
      "Preparation a l'oral devant le jury",
      "Support administratif complet",
    ],
    prerequisites: "Justifier d'une experience professionnelle dans le domaine vise.",
    diploma: "Diplome officiel obtenu par validation",
  },
  {
    slug: "cs-cuisinier",
    badge: "Spécialité",
    name: "Certificat de Spécialité Cuisinier",
    mode: "Formation hybride",
    shortDesc:
      "Specialisation avancee en cuisine pour perfectionner vos techniques et votre expertise.",
    duration: "6 mois",
    image: "/images/course-cuisine.jpg",
    longDesc:
      "Le Certificat de Spécialité Cuisinier est une formation courte et intensive de 6 mois destinee a approfondir une specialite culinaire. Ideale pour les professionnels souhaitant monter en competence rapidement.",
    objectives: [
      "Approfondir une specialite culinaire",
      "Perfectionner les techniques avancees",
      "Developper sa creativite culinaire",
      "Obtenir une certification reconnue",
    ],
    program: [
      "Techniques culinaires avancees",
      "Specialisation au choix",
      "Dressage et presentation moderne",
      "Gestion de production",
      "Projet culinaire personnel",
    ],
    prerequisites: "Experience ou formation de base en cuisine recommandee.",
    diploma: "Certificat de Specialite",
  },
  {
    slug: "cs-patissier",
    badge: "Spécialité",
    name: "Certificat de Spécialité Patissier",
    mode: "Formation hybride",
    shortDesc:
      "Specialisation avancee en patisserie pour maitriser les techniques de haut niveau.",
    duration: "6 mois",
    image: "/images/course-patisserie.jpg",
    longDesc:
      "Le Certificat de Spécialité Patissier est une formation de 6 mois pour approfondir votre maitrise de la patisserie. Parfaite pour se specialiser dans la chocolaterie, les entremets ou la patisserie de boutique.",
    objectives: [
      "Maitriser les techniques de patisserie avancee",
      "Se specialiser (chocolaterie, entremets...)",
      "Developper une signature patissiere",
      "Obtenir une certification reconnue",
    ],
    program: [
      "Patisserie de boutique avancee",
      "Chocolaterie et travail du sucre",
      "Entremets modernes",
      "Decoration et finitions",
      "Projet patissier personnel",
    ],
    prerequisites: "Experience ou formation de base en patisserie recommandee.",
    diploma: "Certificat de Specialite",
  },
  {
    slug: "cs-serveur",
    badge: "Spécialité",
    name: "Certificat de Spécialité Serveur",
    mode: "Formation hybride",
    shortDesc:
      "Specialisation avancee en service pour exceller dans la restauration haut de gamme.",
    duration: "6 mois",
    image: "/images/course-service.jpg",
    longDesc:
      "Le Certificat de Spécialité Serveur est une formation de 6 mois axee sur l'excellence du service en restauration gastronomique. Maitrisez les codes du service haut de gamme et la sommellerie.",
    objectives: [
      "Exceller dans le service haut de gamme",
      "Maitriser le service au gueridon et la decoupe",
      "Approfondir la sommellerie",
      "Obtenir une certification reconnue",
    ],
    program: [
      "Service gastronomique avance",
      "Decoupe et flambage en salle",
      "Sommellerie et accords mets-vins",
      "Management de salle",
      "Projet de service personnel",
    ],
    prerequisites: "Experience ou formation de base en service recommandee.",
    diploma: "Certificat de Specialite",
  },
  {
    slug: "travail-a-domicile",
    badge: "En ligne",
    name: "Travail à domicile",
    mode: "100% en ligne",
    shortDesc:
      "Formation flexible et autonome, entierement en ligne, accessible a tous.",
    duration: "1 mois",
    price: "60 000 F",
    image: "/images/course-management.jpg",
    longDesc:
      "La formation Travail à domicile est un programme 100% en ligne d'un mois, concu pour ceux qui souhaitent se former a leur rythme depuis chez eux. Contenu telechargeable et accompagnement a distance.",
    objectives: [
      "Se former a son rythme depuis chez soi",
      "Acceder a un contenu telechargeable",
      "Beneficier d'un forum d'entraide",
      "Obtenir un certificat de completion",
    ],
    program: [
      "Modules video en ligne",
      "Fiches pratiques telechargeables",
      "Exercices autonomes",
      "Forum d'entraide",
      "Evaluation finale en ligne",
    ],
    prerequisites: "Aucun. Acces a un ordinateur ou smartphone avec internet.",
    diploma: "Certificat de completion",
  },
  {
    slug: "haccp",
    badge: "Certifiant",
    name: "HACCP",
    mode: "100% en ligne",
    shortDesc:
      "Certification hygiene alimentaire obligatoire pour tout professionnel de la restauration.",
    duration: "2 mois",
    price: "100 000 F",
    image: "/images/course-haccp.jpg",
    longDesc:
      "La formation HACCP vous certifie aux normes d'hygiene et de securite alimentaire, obligatoires pour tout professionnel de la restauration. En 2 mois, maitrisez l'analyse des risques et la maitrise des points critiques.",
    objectives: [
      "Comprendre la methode HACCP",
      "Identifier et maitriser les points critiques",
      "Mettre en place un plan de maitrise sanitaire",
      "Obtenir la certification obligatoire",
    ],
    program: [
      "Principes de la methode HACCP",
      "Dangers et analyse des risques",
      "Points critiques de controle (CCP)",
      "Plan de nettoyage et desinfection",
      "Tracabilite alimentaire",
    ],
    prerequisites: "Aucun. Recommande pour tout professionnel de la restauration.",
    diploma: "Certification HACCP",
  },
  {
    slug: "incubation-food",
    badge: "Business",
    name: "Incubation Food",
    mode: "Accompagnement projet",
    shortDesc:
      "Lancez votre projet dans la restauration : business plan, financement, marketing.",
    duration: "3 mois",
    price: "100 000 F",
    image: "/images/course-sommelier.jpg",
    longDesc:
      "Incubation Food est un programme de 3 mois pour les entrepreneurs de la restauration. De l'idee au lancement, nous vous accompagnons dans la construction de votre business plan, la recherche de financement et votre strategie marketing.",
    objectives: [
      "Structurer son projet de restauration",
      "Rediger un business plan complet",
      "Identifier des sources de financement",
      "Construire sa strategie marketing",
    ],
    program: [
      "De l'idee au concept",
      "Business plan et previsionnel financier",
      "Financement et investisseurs",
      "Marketing digital et reseaux sociaux",
      "Reseau d'affaires et lancement",
    ],
    prerequisites: "Avoir un projet entrepreneurial dans la restauration.",
    diploma: "Attestation d'incubation",
  },
  {
    slug: "gestion-restauration",
    badge: "Business",
    name: "Gestion de restauration",
    mode: "100% en ligne",
    shortDesc:
      "Finances, RH, approvisionnement, marketing digital — tout pour gerer votre etablissement.",
    duration: "2 mois",
    price: "100 000 F",
    image: "/images/course-management.jpg",
    longDesc:
      "La formation Gestion de restauration vous donne en 2 mois toutes les cles pour gerer un etablissement performant : pilotage financier, gestion des equipes, approvisionnements et strategie commerciale.",
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
    diploma: "Certificat de gestion",
  },
]

export function getFormationBySlug(slug: string): FormationDetail | undefined {
  return formations.find((f) => f.slug === slug)
}
