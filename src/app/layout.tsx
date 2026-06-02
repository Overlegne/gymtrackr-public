import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'Mijn Krachtpad',
  description: 'Jouw persoonlijke gym log en routine tracker',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground selection:bg-primary/20">
        <div className="mx-auto max-w-md min-h-screen flex flex-col bg-background relative overflow-x-hidden">
          <main className="flex-1 pb-24">
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
