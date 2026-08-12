<?php

namespace Database\Seeders;

use App\Models\Formation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Seed des 11 formations déjà présentes côté frontend (lib/formations-data.ts),
 * pour que la page d'inscription (/inscription) et le catalogue affichent de
 * vraies données au lieu d'un tableau vide.
 *
 * ATTENTION — hypothèses à vérifier avant d'exécuter :
 * 1. Le nom du modèle est-il bien `App\Models\Formation` ?
 * 2. Les colonnes ci-dessous (name, slug, badge, mode, short_description,
 *    description, duration, price, image, prerequisites, diploma,
 *    is_popular, is_active) correspondent-elles à ta vraie migration
 *    `formations` ? Adapte les noms de clés du tableau si besoin.
 * 3. `price` est stocké en entier (ex: 50000 pour "50 000 F") — adapte le
 *    type/la colonne si ton schéma attend un format différent (decimal,
 *    string avec devise, etc.)
 * 4. Si `formations` a une contrainte de clé étrangère `categorie_id`
 *    obligatoire (NOT NULL), il faudra l'ajouter à chaque entrée — non
 *    inclus ici car je n'ai pas visibilité sur tes catégories existantes.
 * 5. 6 formations (les CAP et CPS) ont un prix PLACEHOLDER à confirmer
 *    côté métier (50 000 F pour les CAP, 75 000 F pour les CPS) — corrige
 *    les valeurs 'price' ci-dessous si elles sont incorrectes, et
 *    mets à jour lib/formations-data.ts côté frontend en conséquence pour
 *    rester cohérent.
 *
 * Exécution : php artisan db:seed --class=FormationsSeeder
 */
class FormationsSeeder extends Seeder
{
    public function run(): void
    {
        $formations = [
            [
                'name' => 'CAP Cuisinier',
                'slug' => 'CAP-cuisinier',
                'badge' => 'Populaire',
                'mode' => 'Formation hybride',
                'short_description' => 'Réaliser des mets en respectant les normes de la gastronomie.',
                'description' => 'Le CAP Cuisinier est une formation complète qui vous prépare au métier de cuisinier professionnel. Sur 36 mois, vous apprenez l\'ensemble des techniques culinaires, de la préparation des aliments à la réalisation de plats élaborés, en passant par la gestion d\'une cuisine professionnelle.',
                'duration' => '3 ans / 36 mois',
                'price' => 50000,
                'image' => '/images/course-cuisine.jpg',
                'prerequisites' => 'Aucun diplôme requis. Motivation et passion pour la cuisine.',
                'diploma' => 'Diplôme CAP reconnu par l\'État',
                'is_popular' => true,
                'is_active' => true,
            ],
            [
                'name' => 'CAP Pâtissier',
                'slug' => 'CAP-Patissier',
                'badge' => 'Artisanat',
                'mode' => 'Formation hybride',
                'short_description' => 'Pâtisserie française et africaine. Viennoiseries, chocolaterie, gestion d\'une pâtisserie.',
                'description' => 'Le CAP Pâtisserie vous forme aux techniques essentielles de l\'art de la pâtisserie sur 36 mois, pour vous ouvrir toutes les portes du métier.',
                'duration' => '3 ans / 36 mois',
                'price' => 50000,
                'image' => '/images/course-patisserie.jpg',
                'prerequisites' => 'Aucun diplôme requis. Sens du détail et créativité.',
                'diploma' => 'Diplôme CAP reconnu par l\'État',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'CAP Serveur',
                'slug' => 'CAP-serveur',
                'badge' => 'CAP',
                'mode' => 'Formation hybride',
                'short_description' => 'L\'art du service d\'excellence. Mise en place, protocole d\'accueil et relation client.',
                'description' => 'Le CAP Serveur vous prépare au métier de serveur en hôtellerie. Sur 36 mois, vous apprenez l\'art du service en salle, la mise en place, le protocole d\'accueil, le service des boissons et l\'excellence de la relation client.',
                'duration' => '3 ans / 36 mois',
                'price' => 50000,
                'image' => '/images/course-service.jpg',
                'prerequisites' => 'Aucun diplôme requis. Sens du contact et présentation soignée.',
                'diploma' => 'Diplôme CAP reconnu par l\'État',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'VAE',
                'slug' => 'VAE',
                'badge' => 'Diplômante',
                'mode' => 'Accompagnement personnalisé',
                'short_description' => 'Validation des Acquis de l\'Expérience. Faites reconnaître vos compétences par un diplôme reconnu par l\'État.',
                'description' => 'La VAE (Validation des Acquis de l\'Expérience) permet de transformer votre expérience professionnelle en diplôme reconnu. En 4 à 6 mois, nos formateurs vous accompagnent dans la constitution de votre dossier et la préparation à l\'entretien avec le jury.',
                'duration' => '4 à 6 mois',
                'price' => 150000,
                'image' => '/images/VAE.jpg',
                'prerequisites' => 'Justifier d\'une expérience professionnelle dans le domaine visé.',
                'diploma' => 'Diplôme officiel obtenu par validation',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Certificat Professionnel de Spécialité-Cuisinier',
                'slug' => 'CPS-cuisinier',
                'badge' => 'Spécialité',
                'mode' => 'Formation hybride / ligne',
                'short_description' => 'Spécialisation avancée en cuisine pour perfectionner vos techniques et votre expertise.',
                'description' => 'Le Certificat Professionnel de Spécialité Cuisinier est une formation courte et intensive de 6 mois destinée à approfondir une spécialité culinaire. Idéale pour les débutants et professionnels souhaitant monter en compétence.',
                'duration' => '6 mois',
                'price' => 75000,
                'image' => '/images/course-cuisine1.jpg',
                'prerequisites' => 'Expérience ou formation de base en cuisine recommandée.',
                'diploma' => 'Certificat Professionnel de Spécialité',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Certificat Professionnel de Spécialité-Pâtissier',
                'slug' => 'CPS-patissier',
                'badge' => 'Spécialité',
                'mode' => 'Formation hybride',
                'short_description' => 'Spécialisation avancée en pâtisserie pour maîtriser les techniques de haut niveau.',
                'description' => 'Le Certificat Professionnel de Spécialité Pâtissier est une formation de 6 mois pour approfondir votre maîtrise de la pâtisserie. Un choix parfait pour se spécialiser.',
                'duration' => '6 mois',
                'price' => 75000,
                'image' => '/images/course-patisserie1.jpg',
                'prerequisites' => 'Expérience ou formation de base en pâtisserie recommandée.',
                'diploma' => 'Certificat Professionnel de Spécialité',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Certificat Professionnel de Spécialité-Serveur',
                'slug' => 'CPS-serveur',
                'badge' => 'Spécialité',
                'mode' => 'Formation hybride',
                'short_description' => 'Spécialisation avancée en service pour exceller dans la restauration haut de gamme.',
                'description' => 'Le Certificat Professionnel de Spécialité Serveur est une formation de 6 mois axée sur l\'excellence du service en restauration gastronomique. Maîtrisez les codes du service haut de gamme.',
                'duration' => '6 mois',
                'price' => 75000,
                'image' => '/images/course-service1.jpg',
                'prerequisites' => 'Expérience ou formation de base en service recommandée.',
                'diploma' => 'Certificat Professionnel de Spécialité',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Travail à domicile',
                'slug' => 'Travail-A-Domicile',
                'badge' => 'Certifiant',
                'mode' => '100% en ligne ou en hybride',
                'short_description' => 'Formation flexible et autonome, entièrement en ligne, accessible à tous.',
                'description' => 'La formation Travail à domicile est un programme d\'un mois, conçu pour accompagner les travailleurs domestiques dans le développement de leurs compétences.',
                'duration' => '1 mois',
                'price' => 60000,
                'image' => '/images/travail-domicile.jpg',
                'prerequisites' => 'Aucun. Accès à un ordinateur ou smartphone avec internet.',
                'diploma' => 'Certificat de complétion',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'HACCP',
                'slug' => 'haccp',
                'badge' => 'Certifiant',
                'mode' => '100% en ligne',
                'short_description' => 'Certification en HACCP obligatoire pour tout professionnel de la restauration.',
                'description' => 'La formation HACCP vous certifie aux normes d\'hygiène et de sécurité alimentaire, obligatoires pour tout professionnel de la restauration. En 2 mois, maîtrisez l\'analyse des risques et la maîtrise des points critiques.',
                'duration' => '2 mois',
                'price' => 100000,
                'image' => '/images/course-haccp.jpg',
                'prerequisites' => 'Aucun. Recommandé pour tout professionnel de la restauration.',
                'diploma' => 'Certification HACCP',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'INCUBATION STREET FOOD',
                'slug' => 'INCUBATION-STREET-FOOD',
                'badge' => 'Entrepreneuriat',
                'mode' => 'Accompagnement entrepreneurial',
                'short_description' => 'Lancez votre projet d\'alimentation de rue : idéation, étude de marché, business plan, méthode de financement, marketing digital...',
                'description' => 'C\'est un programme de 3 mois destiné aux jeunes et aux femmes porteurs de projet dans le secteur de l\'alimentation de rue. De l\'idée au lancement, nous vous accompagnons dans la construction de votre projet.',
                'duration' => '3 mois',
                'price' => 100000,
                'image' => '/images/incubation-food.jpg',
                'prerequisites' => 'Avoir une idée de projet entrepreneurial dans la restauration.',
                'diploma' => 'Attestation d\'incubation',
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Gestion de restauration',
                'slug' => 'Gestion-restauration',
                'badge' => 'Entrepreneuriat',
                'mode' => '100% en ligne',
                'short_description' => 'Finances, RH, approvisionnement, marketing digital — tout pour gérer votre établissement.',
                'description' => 'La formation Gestion de restauration vous donne en 2 mois toutes les clés pour gérer un établissement performant : pilotage financier, gestion des équipes, approvisionnements et stratégie commerciale...',
                'duration' => '2 mois',
                'price' => 100000,
                'image' => '/images/course-management.jpg',
                'prerequisites' => 'Aucun. Idéal pour gérants et futurs gérants.',
                'diploma' => 'Certificat',
                'is_popular' => false,
                'is_active' => true,
            ],
        ];

        foreach ($formations as $data) {
            Formation::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }

        $this->command->info(count($formations) . ' formations seedées avec succès.');
    }
}
