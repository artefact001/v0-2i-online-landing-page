<?php

namespace Database\Seeders;

use App\Models\Formation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Seed des 11 formations du catalogue (frontend lib/formations-data.ts),
 * avec les vrais champs du schéma Laravel : titre, description, image,
 * niveau, duree, prix, statut (enum), user_id, categorie_id.
 *
 * ATTENTION — hypothèses à vérifier avant d'exécuter :
 *
 * 1. Modèle attendu : App\Models\Formation. Adapte le namespace si le tien
 *    diffère.
 *
 * 2. categorie_id (obligatoire, FK vers categories) : ce seeder cherche une
 *    catégorie existante avec le titre "Hôtellerie & Restauration" et la
 *    CRÉE si elle n'existe pas encore. Champ confirmé: 'titre' (schéma
 *    réel de la table categories: id, titre, description). Si tu as déjà
 *    des catégories plus fines (Cuisine, Pâtisserie, Service...), tu peux
 *    remplacer ce bloc par une répartition par formation.
 *
 * 3. user_id (obligatoire, FK vers users — le "propriétaire" de la
 *    formation) : ce seeder prend le PREMIER utilisateur ayant le rôle
 *    'admin' ou 'formateur' trouvé en base. Si aucun n'existe, le seeder
 *    s'arrête avec un message clair plutôt que d'échouer silencieusement.
 *
 * 4. 'titre' a une contrainte UNIQUE en base — ce seeder utilise
 *    updateOrCreate(['titre' => ...]) pour être rejouable sans dupliquer.
 *
 * Exécution : php artisan db:seed --class=FormationsSeeder
 */
class FormationsSeeder extends Seeder
{
    public function run(): void
    {
        // --- 1. Catégorie par défaut (champ 'titre' confirmé) ---
        $categorieId = DB::table('categories')->where('titre', 'Hôtellerie & Restauration')->value('id');

        if (!$categorieId) {
            $categorieId = DB::table('categories')->insertGetId([
                'titre' => 'Hôtellerie & Restauration',
                'description' => 'Formations aux métiers de l\'hôtellerie et de la restauration',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $this->command->info("Catégorie 'Hôtellerie & Restauration' créée (id={$categorieId}).");
        }

        // --- 2. Propriétaire (premier admin ou formateur trouvé) ---
        $owner = User::whereIn('role', ['admin', 'formateur'])->first();

        if (!$owner) {
            $this->command->error(
                "Aucun utilisateur avec le rôle 'admin' ou 'formateur' trouvé. " .
                "Crée au moins un compte admin/formateur avant de lancer ce seeder."
            );
            return;
        }

        // --- 3. Formations ---
        $formations = [
            [
                'titre' => 'CAP Cuisinier',
                'description' => 'Le CAP Cuisinier est une formation complète qui vous prépare au métier de cuisinier professionnel. Sur 36 mois, vous apprenez l\'ensemble des techniques culinaires, de la préparation des aliments à la réalisation de plats élaborés, en passant par la gestion d\'une cuisine professionnelle.',
                'image' => '/images/course-cuisine.jpg',
                'niveau' => 'Débutant',
                'duree' => '3 ans / 36 mois',
                'prix' => 60000.00,
                'statut' => 'hybride',
            ],
            [
                'titre' => 'CAP Pâtissier',
                'description' => 'Le CAP Pâtisserie vous forme aux techniques essentielles de l\'art de la pâtisserie sur 36 mois, pour vous ouvrir toutes les portes du métier.',
                'image' => '/images/course-patisserie.jpg',
                'niveau' => 'Débutant',
                'duree' => '3 ans / 36 mois',
                'prix' => 60000.00,
                'statut' => 'hybride',
            ],
            [
                'titre' => 'CAP Serveur',
                'description' => 'Le CAP Serveur vous prépare au métier de serveur en hôtellerie. Sur 36 mois, vous apprenez l\'art du service en salle, la mise en place, le protocole d\'accueil, le service des boissons et l\'excellence de la relation client.',
                'image' => '/images/course-service.jpg',
                'niveau' => 'Débutant',
                'duree' => '3 ans / 36 mois',
                'prix' => 60000.00,
                'statut' => 'hybride',
            ],
            [
                'titre' => 'VAE',
                'description' => 'La VAE (Validation des Acquis de l\'Expérience) permet de transformer votre expérience professionnelle en diplôme reconnu. En 4 à 6 mois, nos formateurs vous accompagnent dans la constitution de votre dossier et la préparation à l\'entretien avec le jury.',
                'image' => '/images/VAE.jpg',
                'niveau' => 'Tous niveaux',
                'duree' => '4 à 6 mois',
                'prix' => 150000.00,
                'statut' => 'presentiel',
            ],
            [
                'titre' => 'Certificat Professionnel de Spécialité-Cuisinier',
                'description' => 'Le Certificat Professionnel de Spécialité Cuisinier est une formation courte et intensive de 6 mois destinée à approfondir une spécialité culinaire. Idéale pour les débutants et professionnels souhaitant monter en compétence.',
                'image' => '/images/course-cuisine1.jpg',
                'niveau' => 'Intermédiaire',
                'duree' => '6 mois',
                'prix' => 60000.00,
                'statut' => 'hybride',
            ],
            [
                'titre' => 'Certificat Professionnel de Spécialité-Pâtissier',
                'description' => 'Le Certificat Professionnel de Spécialité Pâtissier est une formation de 6 mois pour approfondir votre maîtrise de la pâtisserie. Un choix parfait pour se spécialiser.',
                'image' => '/images/course-patisserie1.jpg',
                'niveau' => 'Intermédiaire',
                'duree' => '6 mois',
                'prix' => 60000.00,
                'statut' => 'hybride',
            ],
            [
                'titre' => 'Certificat Professionnel de Spécialité-Serveur',
                'description' => 'Le Certificat Professionnel de Spécialité Serveur est une formation de 6 mois axée sur l\'excellence du service en restauration gastronomique. Maîtrisez les codes du service haut de gamme.',
                'image' => '/images/course-service1.jpg',
                'niveau' => 'Intermédiaire',
                'duree' => '6 mois',
                'prix' => 60000.00,
                'statut' => 'hybride',
            ],
            [
                'titre' => 'Travail à domicile',
                'description' => 'La formation Travail à domicile est un programme d\'un mois, conçu pour accompagner les travailleurs domestiques dans le développement de leurs compétences.',
                'image' => '/images/travail-domicile.jpg',
                'niveau' => 'Débutant',
                'duree' => '1 mois',
                'prix' => 60000.00,
                'statut' => 'en ligne',
            ],
            [
                'titre' => 'HACCP',
                'description' => 'La formation HACCP vous certifie aux normes d\'hygiène et de sécurité alimentaire, obligatoires pour tout professionnel de la restauration. En 2 mois, maîtrisez l\'analyse des risques et la maîtrise des points critiques.',
                'image' => '/images/course-haccp.jpg',
                'niveau' => 'Tous niveaux',
                'duree' => '2 mois',
                'prix' => 100000.00,
                'statut' => 'en ligne',
            ],
            [
                'titre' => 'INCUBATION STREET FOOD',
                'description' => 'C\'est un programme de 3 mois destiné aux jeunes et aux femmes porteurs de projet dans le secteur de l\'alimentation de rue. De l\'idée au lancement, nous vous accompagnons dans la construction de votre projet.',
                'image' => '/images/incubation-food.jpg',
                'niveau' => 'Tous niveaux',
                'duree' => '3 mois',
                'prix' => 100000.00,
                'statut' => 'presentiel',
            ],
            [
                'titre' => 'Gestion de restauration',
                'description' => 'La formation Gestion de restauration vous donne en 2 mois toutes les clés pour gérer un établissement performant : pilotage financier, gestion des équipes, approvisionnements et stratégie commerciale.',
                'image' => '/images/course-management.jpg',
                'niveau' => 'Intermédiaire',
                'duree' => '2 mois',
                'prix' => 100000.00,
                'statut' => 'en ligne',
            ],
        ];

        foreach ($formations as $data) {
            Formation::updateOrCreate(
                ['titre' => $data['titre']],
                array_merge($data, [
                    'categorie_id' => $categorieId,
                    'user_id' => $owner->id,
                ])
            );
        }

        $this->command->info(count($formations) . " formations seedées avec succès (propriétaire: {$owner->email}).");
    }
}
