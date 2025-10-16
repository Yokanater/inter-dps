'use client';

import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { Languages } from 'lucide-react';

/**
 * Icon-only language toggle (Hindi/English) for standardized headers
 */
export function LanguageToggle() {
  const { selectedLanguage, setLanguage } = useAppStore();
  const isHindi = selectedLanguage === 'hi';

  const next = isHindi ? 'en' : 'hi';

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isHindi ? 'Switch to English' : 'हिन्दी पर स्विच करें'}
      onClick={() => setLanguage(next)}
      className="relative"
      title={isHindi ? 'Switch to English' : 'हिन्दी पर स्विच करें'}
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -bottom-1 text-[10px] font-semibold">
        {isHindi ? 'HI' : 'EN'}
      </span>
    </Button>
  );
}
