/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // CORRIGÉ: "unoptimized: true" désactivait ENTIÈREMENT le pipeline
    // d'optimisation d'images de Next.js (redimensionnement automatique,
    // conversion WebP/AVIF, chargement différé) — pour TOUTES les
    // images du site, y compris les nombreuses pages construites cette
    // session qui affichent des photos de formations, actus,
    // opportunités. Ce réglage avait été choisi à l'origine uniquement
    // pour éviter d'avoir à déclarer le domaine distant — remotePatterns
    // ci-dessous fait ça correctement, sans sacrifier l'optimisation.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.2i-online.com',
      },
    ],
  },
}

export default nextConfig
