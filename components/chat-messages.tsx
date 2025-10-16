'use client';

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { ChatMessage } from './chat-message';
import { Loader2, Sparkles } from 'lucide-react';

/**
 * Beautiful, minimal chat message list with smooth auto-scroll
 */
export function ChatMessages() {
  const { messages, isLoading, selectedLanguage } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Smooth auto-scroll to bottom when new messages arrive (ref-based to satisfy linter)
  const lastCountRef = useRef(0);
  useEffect(() => {
    if (messages.length !== lastCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      lastCountRef.current = messages.length;
    }
  });

  // Also scroll on mount
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  const welcomeText = selectedLanguage === 'hi' ? {
    greeting: 'FarmGuide में आपका स्वागत है 🌾',
    subtitle: 'मैं आपकी फसलों से संबंधित किसी भी समस्या में मदद करने के लिए यहां हूं।',
    tryAsking: 'ये पूछें:',
    examples: [
      '💧 "मेरी फसल में पानी की कमी के लक्षण क्या हैं?"',
      '🐛 "गेहूं में कीट नियंत्रण कैसे करें?"',
      '🌱 "धान की बुवाई का सही समय क्या है?"',
    ]
  } : {
    greeting: 'Welcome to FarmGuide 🌾',
    subtitle: "I'm here to help with any crop problems or farming questions you have.",
    tryAsking: 'Try asking:',
    examples: [
      '💧 "What are signs of water stress in crops?"',
      '🐛 "How to control pests in wheat?"',
      '🌱 "When is the best time to plant rice?"',
    ]
  };

  return (
    <div
      className="scrollbar-minimal flex-1 overflow-y-auto"
      ref={scrollRef}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col space-y-6 px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center space-y-6 max-w-2xl animate-in fade-in duration-500">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/12 text-primary">
                <Sparkles className="h-10 w-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                  {welcomeText.greeting}
                </h2>
                <p className="text-lg leading-relaxed text-foreground/70">
                  {welcomeText.subtitle}
                </p>
              </div>

              <div className="pt-6 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground/50">
                  {welcomeText.tryAsking}
                </p>
                <div className="grid gap-3 text-left">
                  {welcomeText.examples.map((example) => (
                    <div
                      key={example}
                      className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-honey-sm transition hover:border-primary/40 hover:bg-primary/10"
                    >
                      <p className="text-sm font-medium text-foreground">{example}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ChatMessage message={message} />
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-3 px-4 py-6 animate-in fade-in duration-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">
                    {selectedLanguage === 'hi' ? 'सोच रहे हैं...' : 'Thinking...'}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {selectedLanguage === 'hi' ? 'आपका जवाब तैयार कर रहे हैं' : 'Preparing your answer'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
}
