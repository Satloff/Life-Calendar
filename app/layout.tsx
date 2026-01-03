import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Life Calendar - Dynamic Wallpapers',
  description: 'Generate dynamic wallpapers to track your year and life progress. Perfect for iPhone lock screens with iOS Shortcuts automation.',
  keywords: ['wallpaper', 'life calendar', 'progress tracker', 'iPhone', 'lock screen', 'iOS shortcuts'],
  openGraph: {
    title: 'Life Calendar',
    description: 'Dynamic wallpapers to track your year and life progress',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
