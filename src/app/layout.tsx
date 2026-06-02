

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { CustomStyleInjector } from "@/components/CustomStyleInjector"
import { NativeAppHandler } from "@/components/NativeAppHandler"

export const metadata: Metadata = {
  title: 'Gymtrackr',
  description: 'Your personal gym log and routine tracker',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Gymtrackr',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/gym-app-icon/180/180" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomStyleInjector />
          <NativeAppHandler />
          <div className="mx-auto max-w-md min-h-screen flex flex-col bg-background relative overflow-x-hidden">
            <main className="flex-1 pb-24">
              {children}
            </main>
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
