'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  MessageSquareText,
  Image as ImageIcon,
  Package,
  Home,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';

const navigation = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageSquareText },
  { href: '/analyze', label: 'Analyze', icon: ImageIcon },
  { href: '/inventory', label: 'Inventory', icon: Package },
];

/**
 * Honey-accented floating navigation bar
 */
export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-6 z-50 flex w-full justify-center px-4">
  <div className="glass-surface surface-bevel shadow-honey-md flex w-full max-w-6xl items-center justify-between rounded-3xl bg-background/85 px-4 py-3 backdrop-blur-xl transition-all duration-300 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 rounded-full bg-primary/10 px-3 py-2 transition-transform hover:scale-[1.01]">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold leading-none tracking-tight text-foreground">
            FarmGuide
          </span>
        </Link>

        {/* Main Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navigation.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-honey-sm'
                    : 'text-foreground/70 hover:bg-secondary/70 hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 rounded-full bg-card/70 px-3 py-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
