-- ============================================================
-- Seed de contenu : formation CAP Cuisine (démo testable)
-- Idempotent : nettoie puis réinsère le contenu de démo.
-- ============================================================

-- Formation
insert into public.formations (name, slug, description, short_description, image_url, price, duration_weeks, level, category, is_active, max_students)
values (
  'CAP Cuisine',
  'cap-cuisine',
  'Formation complète aux techniques culinaires professionnelles. Apprenez les bases de la cuisine, les techniques de découpe, la gestion d''une brigade et bien plus encore avec des chefs expérimentés.',
  'Maîtrisez les techniques culinaires professionnelles',
  '/images/course-cuisine.jpg',
  150000,
  24,
  'Débutant',
  'Cuisine',
  true,
  100
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  short_description = excluded.short_description,
  image_url = excluded.image_url,
  price = excluded.price,
  duration_weeks = excluded.duration_weeks,
  level = excluded.level,
  category = excluded.category,
  is_active = true;

do $$
declare
  f_id uuid;
  m1 uuid;
  m2 uuid;
  l1 uuid;
  l2 uuid;
  l3 uuid;
  l4 uuid;
  v_prof uuid;
  v_student uuid;
begin
  select id into f_id from public.formations where slug = 'cap-cuisine';

  -- Nettoyage du contenu de démo existant (cascade sur lessons/exercises)
  delete from public.modules where formation_id = f_id;

  -- Module 1
  insert into public.modules (formation_id, title, description, order_index, is_published)
  values (f_id, 'Les Bases de la Cuisine', 'Découvrez les fondamentaux de la cuisine professionnelle : équipements, hygiène et techniques de base.', 1, true)
  returning id into m1;

  -- Module 2
  insert into public.modules (formation_id, title, description, order_index, is_published)
  values (f_id, 'Techniques de Découpe', 'Maîtrisez les différentes techniques de découpe des légumes, viandes et poissons.', 2, true)
  returning id into m2;

  -- Leçon 1
  insert into public.lessons (module_id, title, description, video_url, duration_minutes, order_index, is_published, is_free_preview, content, content_type)
  values (m1, 'Introduction à la cuisine professionnelle',
    'Découvrez le monde de la cuisine professionnelle et les compétences essentielles pour réussir.',
    'https://www.youtube.com/embed/ftnh3eHi7sU', 15, 1, true, true,
    E'# Introduction à la Cuisine Professionnelle\n\n## Objectifs de cette leçon\n- Comprendre les bases du métier de cuisinier\n- Découvrir l''environnement de la cuisine professionnelle\n- Identifier les compétences clés nécessaires\n\n## Qu''est-ce que la cuisine professionnelle ?\n\nLa cuisine professionnelle est bien plus qu''une simple préparation de repas. C''est un **art** qui combine créativité, technique et rigueur.\n\n### Les piliers de la cuisine professionnelle\n\n1. **La technique** - Maîtriser les gestes fondamentaux\n2. **L''organisation** - Gérer son temps et son espace\n3. **L''hygiène** - Respecter les normes sanitaires (HACCP)\n4. **La créativité** - Innover tout en respectant les classiques\n\n## L''environnement de travail\n\nUne cuisine professionnelle est organisée en **brigades** avec différents postes :\n\n| Poste | Responsabilité |\n|-------|----------------|\n| Chef de cuisine | Direction et création des menus |\n| Sous-chef | Second du chef, coordination |\n| Chef de partie | Responsable d''un secteur |\n| Commis | Préparation et assistance |\n\n> **Note importante :** La hiérarchie en cuisine est essentielle pour garantir l''efficacité et la qualité des services.\n\n## À retenir\n\nLa cuisine professionnelle demande engagement et discipline, mais offre des opportunités de carrière passionnantes dans le monde entier.',
    'video_text')
  returning id into l1;

  -- Leçon 2
  insert into public.lessons (module_id, title, description, video_url, duration_minutes, order_index, is_published, is_free_preview, content, content_type)
  values (m1, 'L''équipement du cuisinier',
    'Apprenez à connaître et utiliser les outils essentiels de la cuisine.',
    'https://www.youtube.com/embed/ftnh3eHi7sU', 20, 2, true, false,
    E'# L''Équipement du Cuisinier\n\n## Objectifs de cette leçon\n- Identifier les outils essentiels du cuisinier\n- Comprendre l''utilisation de chaque équipement\n- Apprendre l''entretien du matériel\n\n## Les couteaux de base\n\nLe couteau est le prolongement de la main du cuisinier.\n\n### Couteau de chef (20-25 cm)\nLe plus polyvalent, utilisé pour la majorité des découpes.\n\n### Couteau d''office (8-10 cm)\nPour les travaux minutieux et l''épluchage.\n\n## Entretien des couteaux\n\n> **Règle d''or :** Un couteau bien aiguisé est plus sûr qu''un couteau émoussé !\n\n- Aiguisez régulièrement avec un fusil\n- Lavez à la main (jamais au lave-vaisselle)\n- Rangez dans un bloc ou étui\n\n## Les ustensiles de base\n\n| Ustensile | Utilisation |\n|-----------|-------------|\n| Fouet | Mélanger, émulsionner |\n| Spatule | Racler, mélanger |\n| Louche | Servir les liquides |\n| Écumoire | Retirer les impuretés |',
    'video_text')
  returning id into l2;

  -- Leçon 3
  insert into public.lessons (module_id, title, description, video_url, duration_minutes, order_index, is_published, is_free_preview, content, content_type)
  values (m2, 'Les découpes de base des légumes',
    'Maîtrisez les techniques fondamentales de découpe : julienne, brunoise, mirepoix...',
    'https://www.youtube.com/embed/ftnh3eHi7sU', 25, 1, true, false,
    E'# Les Découpes de Base des Légumes\n\n## Objectifs de cette leçon\n- Maîtriser les 6 découpes fondamentales\n- Comprendre quand utiliser chaque découpe\n\n## Les 6 découpes fondamentales\n\n### 1. La Julienne\nBâtonnets fins de 3-4 cm de long et 2 mm d''épaisseur.\n\n### 2. La Brunoise\nPetits cubes de 2-3 mm de côté.\n\n### 3. La Mirepoix\nCubes moyens de 1-2 cm (carottes, oignons, céleri).\n\n### 4. Le Ciseler\nDécoupe fine des oignons ou échalotes.\n\n### 5. La Chiffonnade\nFines lanières de feuilles (salade, basilic).\n\n### 6. L''Émincer\nTranches fines et régulières.\n\n> **Sécurité :** Ne jamais lever la lame plus haut que les phalanges !',
    'video_text')
  returning id into l3;

  -- Leçon 4
  insert into public.lessons (module_id, title, description, video_url, duration_minutes, order_index, is_published, is_free_preview, content, content_type)
  values (m2, 'Découpe des viandes',
    'Apprenez à découper différentes pièces de viande pour une cuisson optimale.',
    'https://www.youtube.com/embed/ftnh3eHi7sU', 30, 2, true, false,
    E'# Découpe des Viandes\n\n## Objectifs de cette leçon\n- Identifier les différents morceaux de viande\n- Maîtriser les techniques de découpe adaptées\n\n## L''importance du sens des fibres\n\nPour une viande tendre :\n- **Couper perpendiculairement** aux fibres pour les grillades\n- **Couper dans le sens** pour les braisages longs\n\n## Les découpes de base\n\n### L''escalope\nTranche fine (5-8 mm) coupée puis aplatie.\n\n### Le pavé\nPortion épaisse (3-4 cm) pour cuisson saignante.\n\n## Le parage\n\nLe parage consiste à retirer l''excès de gras, les nerfs et les parties oxydées.\n\n> **Astuce :** Gardez les parures pour vos fonds de sauce !',
    'video_text')
  returning id into l4;

  -- Exercices
  insert into public.exercises (lesson_id, title, description, exercise_type, content, points, order_index, is_required)
  values
  (l1, 'Quiz : Les bases de la cuisine', 'Testez vos connaissances sur les fondamentaux', 'qcm',
   '{"questions":[{"id":1,"question":"Quel est le rôle principal du sous-chef ?","options":["Faire les courses","Seconder le chef et coordonner","Uniquement la pâtisserie","Nettoyer la cuisine"],"correct":1},{"id":2,"question":"Que signifie HACCP ?","options":["Haute Autorité de Contrôle des Cuisines","Hazard Analysis Critical Control Points","Hygiène Alimentaire et Contrôle Culinaire","Aucune de ces réponses"],"correct":1},{"id":3,"question":"Quelle qualité est essentielle pour un cuisinier ?","options":["Travail en équipe","Résistance physique","Attention aux détails","Toutes ces réponses"],"correct":3}]}'::jsonb,
   30, 1, true),
  (l2, 'Quiz : L''équipement', 'Vérifiez que vous connaissez bien votre matériel', 'qcm',
   '{"questions":[{"id":1,"question":"Quel couteau est le plus polyvalent ?","options":["Couteau d''office","Couteau de chef","Couteau à pain","Économe"],"correct":1},{"id":2,"question":"Comment entretenir ses couteaux ?","options":["Lave-vaisselle","Lavage main + aiguisage","Les laisser dans l''évier","Peu importe"],"correct":1}]}'::jsonb,
   20, 1, true),
  (l3, 'TD : Les découpes de légumes', 'Exercice pratique de découpe', 'practical',
   '{"instructions":"Réalisez les découpes suivantes et prenez des photos de vos résultats :","tasks":[{"id":1,"task":"Réalisez une julienne de carottes (10 bâtonnets minimum)","points":10},{"id":2,"task":"Transformez votre julienne en brunoise régulière","points":15},{"id":3,"task":"Ciselez finement un oignon","points":10},{"id":4,"task":"Réalisez une chiffonnade de basilic","points":5}],"submission_type":"photo"}'::jsonb,
   40, 1, true),
  (l4, 'Quiz : Les viandes', 'Théorie sur la découpe des viandes', 'qcm',
   '{"questions":[{"id":1,"question":"Dans quel sens couper pour une grillade tendre ?","options":["Dans le sens des fibres","Perpendiculairement aux fibres","Peu importe","En diagonale uniquement"],"correct":1},{"id":2,"question":"Qu''est-ce que le parage ?","options":["Cuire la viande","Retirer gras, nerfs et parties abîmées","Mariner la viande","Couper en cubes"],"correct":1}]}'::jsonb,
   20, 1, true);

  -- Assigner le professeur à la formation
  select id into v_prof from public.profiles where email = 'professeur@2ionline.com';
  if v_prof is not null then
    insert into public.professor_formations (professor_id, formation_id)
    values (v_prof, f_id)
    on conflict (professor_id, formation_id) do nothing;
  end if;

  -- Inscrire l'étudiant de test à la formation
  select id into v_student from public.profiles where email = 'etudiant@2ionline.com';
  if v_student is not null then
    insert into public.enrollments (student_id, formation_id, status, progress, payment_status, payment_amount)
    values (v_student, f_id, 'active', 25, 'paid', 150000)
    on conflict (student_id, formation_id) do update set status = 'active', payment_status = 'paid';
  end if;
end $$;
