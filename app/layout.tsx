import type { Metadata } from 'next';
import { Fraunces, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppHeader } from '@/components/app-header';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
});

const body = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'FarmGuide - AI Farming Assistant',
  description:
    'AI-powered farming assistant with Hindi voice support. Get crop diagnosis, manage inventory, and detect plant diseases with image analysis.',
  keywords: [
    'farming',
    'agriculture',
    'crop disease',
    'hindi farming',
    'inventory management',
    'AI farming',
    'crop diagnosis',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-body antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AppHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
