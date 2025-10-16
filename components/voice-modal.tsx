'use client';

import { useEffect } from 'react';
import { Mic, X, Volume2, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPauseAndSend: () => void;
  transcript: string;
  isListening: boolean;
  language: 'hi' | 'en';
}

/**
 * Beautiful opaque modal for voice recognition with pause/send functionality
 */
export function VoiceModal({
  isOpen,
  onClose,
  onPauseAndSend,
  transcript,
  isListening,
  language,
}: VoiceModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background/85 via-background/80 to-background/70 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-background/10"
        onClick={onClose}
        aria-label={language === 'hi' ? 'मॉडल बंद करें' : 'Close modal'}
      />

  <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-white/10 bg-background/90 shadow-honey-lg ring-1 ring-primary/20 animate-in zoom-in-95 duration-200">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/60" />

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-5 top-5 rounded-full text-foreground/70 hover:bg-primary/15 hover:text-primary"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="space-y-8 p-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="rounded-full bg-primary/15 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary/80">
              {language === 'hi' ? 'वॉइस मोड' : 'Voice Mode'}
            </span>
            <h3 className="font-display text-3xl text-foreground">
              {language === 'hi' ? 'अपनी बात शुरू करें' : 'Start speaking freely'}
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-foreground/65">
              {language === 'hi'
                ? 'हम हर शब्द को समझने और बेहतर चिकित्सा सलाह देने के लिए सुन रहे हैं।'
                : 'We capture every word to tailor the right care guidance for you.'}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              {isListening && (
                <>
                  <div
                    className="absolute inset-0 rounded-full bg-primary/20 animate-ping"
                    style={{ animationDuration: '1.6s' }}
                  />
                  <div
                    className="absolute inset-[18%] rounded-full bg-primary/15 animate-pulse"
                    style={{ animationDuration: '2s' }}
                  />
                </>
              )}

              <button
                type="button"
                onClick={onPauseAndSend}
                className={`relative flex h-28 w-28 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isListening
                    ? 'from-primary/95 via-primary to-primary/85 shadow-honey-lg'
                    : 'from-primary/15 via-secondary/30 to-background shadow-honey-sm'
                }`}
                aria-label={language === 'hi' ? 'रुकें और भेजें' : 'Stop and send'}
              >
                {isListening ? (
                  <Square className="h-12 w-12 text-primary-foreground" />
                ) : (
                  <Mic className="h-12 w-12 text-primary" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm font-medium text-primary">
            <span className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
              <span className={`h-2 w-2 rounded-full ${isListening ? 'animate-pulse bg-primary' : 'bg-secondary'}`} />
              {isListening
                ? language === 'hi'
                  ? 'सुन रहे हैं... रोकने के लिए टैप करें'
                  : 'Listening… tap to pause'
                : language === 'hi'
                ? 'रुका हुआ — फिर से शुरू करने के लिए टैप करें'
                : 'Paused — tap to resume'}
            </span>
          </div>

          <div className="scrollbar-minimal max-h-[220px] min-h-[140px] overflow-y-auto rounded-3xl border border-primary/15 bg-background/70 p-6 text-left shadow-honey-sm backdrop-blur-sm">
            {transcript ? (
              <p className="animate-in fade-in text-lg leading-relaxed text-foreground duration-300">
                {transcript}
              </p>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Volume2 className="h-5 w-5 text-primary/60" />
                </div>
                <p className="text-sm text-foreground/55">
                  {language === 'hi'
                    ? 'यहाँ आपकी आवाज़ का प्रतिलेख दिखाई देगा।'
                    : 'Your live transcript will blossom here.'}
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-3 rounded-3xl bg-primary/8 p-6 text-sm text-foreground/65">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
              <span className="font-medium text-foreground">
                {language === 'hi' ? 'त्वरित सुझाव' : 'Quick tips'}
              </span>
              <span>
                {language === 'hi'
                  ? 'धीरे और स्पष्ट बोलें — कोई भी भाषा चलेगी।'
                  : 'Speak slowly and clearly — any language works.'}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
              <span className="font-medium text-foreground">
                {language === 'hi' ? 'कंट्रोल' : 'Controls'}
              </span>
              <span>
                {language === 'hi'
                  ? 'Esc दबाएँ या बाहर क्लिक करें ताकि मॉडेल बंद हो जाए।'
                  : 'Press Esc or click outside the card to close.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
