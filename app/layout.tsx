import type { Metadata } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { PwaInstallPrompt } from '@/components/pwa-install-prompt'
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
  title: '2I Online — Formé ici, Reconnu partout',
  description: 'Plateforme de formation professionnelle en ligne en hôtellerie, restauration et arts culinaires. Formations certifiantes reconnues par l\'État sénégalais.',
  keywords: ['formation professionnelle', 'hôtellerie', 'restauration', 'cuisine', 'CAP', 'Sénégal', 'Afrique', 'certification'],
  authors: [{ name: 'Incub Institut' }],
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '2I Online',
  },
  openGraph: {
    title: '2I Online — Formé ici, Reconnu partout',
    description: 'Formations certifiantes en hôtellerie, restauration et arts culinaires. Conçues pour l\'Afrique, reconnues partout sur le continent.',
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
          <PwaInstallPrompt />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
