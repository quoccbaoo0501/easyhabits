import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Habit Tracker",
  description: "Track your habits, goals, and schedule",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Construct CDN URLs for react-pdf CSS
  // Pinning to a specific version (e.g., 8.0.2) can be more stable than @latest
  const reactPdfVersion = '8.0.2'; // Pin to a specific, known working version
  const annotationLayerCss = `https://unpkg.com/react-pdf@${reactPdfVersion}/dist/Page/AnnotationLayer.css`;
  const textLayerCss = `https://unpkg.com/react-pdf@${reactPdfVersion}/dist/Page/TextLayer.css`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add react-pdf CSS links from CDN */}
        <link rel="stylesheet" href={annotationLayerCss} />
        <link rel="stylesheet" href={textLayerCss} />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}