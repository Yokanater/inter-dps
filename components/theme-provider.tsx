'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Theme provider wrapper for next-themes
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
