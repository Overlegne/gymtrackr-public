import { MetadataRoute } from 'next'

/**
 * @fileOverview PWA Manifest configuration for Next.js.
 * Strictly static export for Capacitor compatibility.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gymtrackr',
    short_name: 'Gymtrackr',
    description: 'Your personal gym log and routine tracker',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f9fa',
    theme_color: '#8b5cf6',
    icons: [
      {
        src: 'https://picsum.photos/seed/gymtrackr-icon/192/192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://picsum.photos/seed/gymtrackr-icon/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
