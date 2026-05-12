export type Language = 'fr' | 'wo';

export const translations = {
  fr: {
    // Navigation
    accueil: 'Accueil',
    apropos: 'À propos',
    formations: 'Formations',
    coursLive: 'Cours Live',
    bibliotheque: 'Bibliothèque',
    tarifs: 'Tarifs',
    faq: 'FAQ',
    connexion: 'Connexion',
    sinscrire: 'S\'inscrire',

    // Dashboard
    dashboard: 'Tableau de bord',
    mesEtudiants: 'Mes Étudiants',
    mesModules: 'Mes Modules',
    mesLecons: 'Mes Leçons',
    mesCours: 'Mes Cours',
    mesNotes: 'Mes Notes',
    mesFavoris: 'Mes Favoris',
    mesCertificats: 'Mes Certificats',
    messages: 'Messages',
    forum: 'Forum',

    // Course
    lectureLecon: 'Lecture de la leçon',
    marquerComplete: 'Marquer comme terminée',
    progression: 'Progression',
    ajouterAuxFavoris: 'Ajouter aux favoris',
    retirerDesFavoris: 'Retirer des favoris',
    telechargerNote: 'Télécharger les notes',

    // Payments
    paiement: 'Paiement',
    wave: 'Wave',
    orangeMoney: 'Orange Money',
    freeMoney: 'Free Money',
    montant: 'Montant',
    confirmer: 'Confirmer',
    annuler: 'Annuler',

    // General
    oui: 'Oui',
    non: 'Non',
    retour: 'Retour',
    enattente: 'En attente',
    actif: 'Actif',
    termine: 'Terminé',
  },
  wo: {
    // Navigation
    accueil: 'Kàramaan',
    apropos: 'Ku dal',
    formations: 'Xalasutaale',
    coursLive: 'Xalasu Ndaw',
    bibliotheque: 'Raaj',
    tarifs: 'Jinndi',
    faq: 'Suukaale',
    connexion: 'Dutal',
    sinscrire: 'Jëm',

    // Dashboard
    dashboard: 'Tabalu',
    mesEtudiants: 'Ma Xalinte',
    mesModules: 'Ma Modul',
    mesLecons: 'Ma Xalasu',
    mesCours: 'Ma Xalasu',
    mesNotes: 'Ma Noot',
    mesFavoris: 'Ma Tëm',
    mesCertificats: 'Ma Sertifikat',
    messages: 'Waxtaale',
    forum: 'Waxtaale Setlu',

    // Course
    lectureLecon: 'Jangal Xalasu',
    marquerComplete: 'Marka ay walal',
    progression: 'Sukkar',
    ajouterAuxFavoris: 'Rakkuma na tëm',
    retirerDesFavoris: 'Yit na tëm',
    telechargerNote: 'Kaam noot',

    // Payments
    paiement: 'Jëmante',
    wave: 'Wave',
    orangeMoney: 'Orange Money',
    freeMoney: 'Free Money',
    montant: 'Jaaxay',
    confirmer: 'Siga',
    annuler: 'Waral',

    // General
    oui: 'Waaw',
    non: 'Deew',
    retour: 'Dellu',
    enattente: 'Gis jërëjëf',
    actif: 'Aktif',
    termine: 'Walal',
  },
};

export class I18nService {
  private static currentLanguage: Language = 'fr';

  static setLanguage(lang: Language) {
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
  }

  static getLanguage(): Language {
    if (typeof window === 'undefined') return 'fr';
    const saved = localStorage.getItem('language') as Language;
    return saved || 'fr';
  }

  static t(key: keyof typeof translations.fr): string {
    const lang = this.getLanguage();
    const text = translations[lang][key as keyof typeof translations[typeof lang]];
    return text || key;
  }

  static translate(text: string, lang: Language = 'fr'): string {
    const key = text as keyof typeof translations.fr;
    return translations[lang][key as keyof typeof translations[lang]] || text;
  }
}

export const useTranslation = (lang: Language = 'fr') => {
  return {
    t: (key: keyof typeof translations.fr) => translations[lang][key as keyof typeof translations[lang]] || key,
    lang,
  };
};
