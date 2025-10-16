'use client';

import { useEffect } from 'react';
import { ChatMessages } from '@/components/chat-messages';
import { ChatInput } from '@/components/chat-input';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

/**
 * Crop Diagnosis Page - redesigned
 */
export default function DiagnosePage() {
  const { setFarmingContext, selectedLanguage } = useAppStore();

  useEffect(() => {
    setFarmingContext('diagnosis');
  }, [setFarmingContext]);

  return (
    <div className="relative isolate min-h-screen bg-background/95 pb-24 pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-6 top-10 h-72 w-72 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-secondary/45 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-primary/25 bg-primary/10 p-8 text-center shadow-honey-md">
          <div className="flex flex-col items-center gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
              <Leaf className="h-4 w-4" />
              {selectedLanguage === 'hi' ? 'फसल निदान सहायता' : 'Crop diagnosis support'}
            </span>
            <h1 className="font-display text-4xl text-foreground sm:text-5xl">
              {selectedLanguage === 'hi'
                ? 'आपके खेत की कहानी साझा करें, हम उपचार सुझाएँगे।'
                : 'Share what your field is feeling and we’ll guide the treatment.'}
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-foreground/70">
              {selectedLanguage === 'hi'
                ? 'पत्‍तों का रंग, मिट्टी की नमी या मौसम से जुड़ी चुनौतियाँ—जो भी देख रहे हैं, विस्तार से बताएं। FarmGuide पहले कारण समझेगा और फिर सरल चरणों में समाधान देगा।'
                : 'Explain leaf colour shifts, soil moisture, or weather stresses in your own words. FarmGuide studies the cause first, then suggests gentle, actionable next steps.'}
            </p>
          </div>
        </div>

        <Card className="flex min-h-[70vh] flex-col overflow-hidden border border-border/60 bg-card/90">
          <div className="flex-1 overflow-hidden bg-background/40">
            <ChatMessages />
          </div>
          <ChatInput />
        </Card>
      </div>
    </div>
  );
}
