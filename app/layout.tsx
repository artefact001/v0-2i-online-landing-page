import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '2I Online — Forme ici, Reconnu partout',
  description: 'Plateforme de formation professionnelle en ligne en hotellerie, restauration et arts culinaires. Formations certifiantes reconnues par l\'Etat senegalais.',
  keywords: ['formation professionnelle', 'hotellerie', 'restauration', 'cuisine', 'CAP', 'Senegal', 'Afrique', 'certification'],
  authors: [{ name: 'Incub Institut' }],
  generator: 'v0.app',
  openGraph: {
    title: '2I Online — Forme ici, Reconnu partout',
    description: 'Formations certifiantes en hotellerie, restauration et arts culinaires. Concues pour l\'Afrique, reconnues partout sur le continent.',
    type: 'website',
    locale: 'fr_FR',
  },
}

export const viewport = {
  themeColor: '#080F1E',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${outfit.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased bg-[#080F1E] overflow-x-hidden">
        <AuthProvider>
          {children}
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
