'use client';

import { Card } from '@/components/ui/card';
import { ChatMessages } from '@/components/chat-messages';
import { ChatInput } from '@/components/chat-input';

/**
 * Main chat interface page
 */
export default function ChatPage() {
  return (
    <div className="relative isolate min-h-screen bg-background/95 pb-24 pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute right-10 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-[420px] w-[420px] rounded-full bg-secondary/40 blur-3xl" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-border/60 bg-card/90 p-8 shadow-honey-md">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">Conversation space</span>
              <h1 className="font-display text-4xl text-foreground">Share what you see, feel, and plan next.</h1>
              <p className="text-sm leading-relaxed text-foreground/70">
                FarmGuide listens in Hindi or English and responds with practical steps, seasonal reminders, and gentle encouragement—tailored to your crops.
              </p>
            </div>
            <div className="rounded-[28px] border border-primary/20 bg-primary/10 p-6 text-sm leading-relaxed text-foreground/70">
              <p className="font-semibold uppercase tracking-[0.25em] text-primary/80">Try asking</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>• “What should I do after spotting yellow leaves on my tomato crop?”</li>
                <li>• “हल्दी में फफूंदी दिख रही है, अभी क्या उपाय करें?”</li>
                <li>• “Schedule a reminder for irrigation before the weekend heat.”</li>
              </ul>
            </div>
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
