export const metadata = {
  title: 'Life Calendar',
  description: 'Generate life calendar wallpapers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

