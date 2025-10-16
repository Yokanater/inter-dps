import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Mic,
  Image,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Sprout,
  Leaf,
  TrendingUp,
} from 'lucide-react';

const featureHighlights = [
  {
    title: 'Guided Crop Support',
    description:
      'Chat with a patient farming copilot that responds in Hindi or English with practical, step-by-step advice.',
    icon: MessageSquare,
  },
  {
    title: 'Photo Diagnosis',
    description:
      'Upload photos to catch nutrient deficiencies, pest damage, and diseases before they spread.',
    icon: Image,
  },
  {
    title: 'Voice-Driven Inventory',
    description:
      'Simply speak to log fertilizers, seeds, or tools and keep your farm supply organised automatically.',
    icon: Mic,
  },
];

const milestones = [
  {
    label: 'Daily Check-ins',
    description: 'Receive short crop care rituals customised to your climate and season.',
  },
  {
    label: 'Actionable Alerts',
    description: 'We flag weather risks, soil health reminders, and preparation tasks before they matter.',
  },
  {
    label: 'Harvest Confidence',
    description: 'Track gains in yield quality with AI notes stored neatly in one farmer’s journal.',
  },
];

export default function HomePage() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute -top-32 left-8 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-secondary/50 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-32 px-4 pb-32 pt-36 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground/80">
              <Sparkles className="h-4 w-4" />
              Intelligent field partner
            </span>

            <div className="space-y-6">
              <h1 className="font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
                Honey-warm intelligence for calm, confident farming.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
                FarmGuide blends weather awareness, soil wisdom, and crop science into a gentle assistant that speaks your language and keeps your land thriving season after season.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/chat" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto">
                  <MessageSquare className="h-4 w-4" />
                  Start a conversation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/analyze" className="w-full sm:w-auto">
                <Button variant="soft" size="lg" className="w-full sm:w-auto">
                  <Image className="h-4 w-4" />
                  Diagnose with a photo
                </Button>
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-primary/20 bg-card/80 p-6 shadow-honey-sm">
                <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.25em] text-primary">
                  <Sprout className="h-5 w-5" />
                  Season-ready in minutes
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                  Answer three quick prompts—FarmGuide builds a personalised plan covering irrigation, nutrition, and market timing.
                </p>
              </div>
              <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-honey-sm">
                <p className="text-3xl font-display text-primary">96%</p>
                <p className="mt-2 text-sm text-foreground/70">farmers feel more confident making crop decisions after their first week with FarmGuide.</p>
                <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/50">
                  <TrendingUp className="h-4 w-4" />
                  Transparent outcomes
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-surface shadow-honey-lg relative z-10 rounded-[32px] p-10">
              <div className="flex flex-col gap-8">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">Daily field brief</p>
                  <h2 className="font-display text-3xl text-foreground">
                    Dawn tasks, delivered
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    Wake up to a calm summary of soil moisture, weather shifts, and suggested treatments tailored to your crops.
                  </p>
                </div>

                <div className="space-y-4">
                  {milestones.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary/90">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -left-10 -top-10 h-24 w-24 rounded-full bg-primary/30 blur-2xl" />
            <div className="absolute -right-3 bottom-6 h-20 w-20 rounded-full bg-secondary/60 blur-2xl" />
          </div>
        </section>

        {/* Feature Grid */}
        <section className="space-y-12">
          <div className="flex flex-col items-start gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
              What FarmGuide handles for you
            </span>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">Precision care across every farm ritual.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featureHighlights.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex h-full flex-col gap-4 rounded-[30px] border border-border/60 bg-card/80 p-8 shadow-honey-sm">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-2xl text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Outcome strip */}
        <section className="glass-surface rounded-[38px] px-8 py-12 shadow-honey-lg sm:px-12">
          <div className="grid gap-8 md:grid-cols-3 md:items-center">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Growing with FarmGuide
              </span>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">Designed for multi-lingual, multi-crop life</h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-foreground/70">
              <p>
                Seamless Hindi and English support ensures clear guidance for every family member caring for the farm.
              </p>
              <p>
                Plan irrigation, nutrients, and inventory in one rhythm while FarmGuide tracks historical actions for the season ahead.
              </p>
            </div>
            <div className="rounded-[28px] border border-primary/20 bg-background/70 p-6 text-sm leading-relaxed text-foreground/70">
              <p className="font-display text-2xl text-primary">“A gentle mentor I can carry in my pocket.”</p>
              <p className="mt-3 text-xs uppercase tracking-[0.28em] text-foreground/50">Pilot farmer · Madhya Pradesh</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden rounded-[42px] border border-primary/30 bg-gradient-to-br from-primary/20 via-primary/10 to-background px-8 py-16 shadow-honey-md sm:px-12">
          <div className="absolute right-[-10%] top-[-20%] h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute left-[-15%] bottom-[-30%] h-64 w-64 rounded-full bg-secondary/50 blur-3xl" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
            <div className="space-y-5">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                <Leaf className="h-4 w-4" />
                Ready for calmer seasons?
              </span>
              <h2 className="font-display text-4xl text-foreground sm:text-5xl">
                Let’s prepare your fields for their best harvest yet.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-foreground/70">
                Begin with FarmGuide for free today. Invite your family to collaborate, sync with weather alerts, and archive your farming wisdom for generations.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/chat" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Sprout className="h-4 w-4" />
                    Explore FarmGuide
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                    Learn how we help farmers
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden h-full rounded-[30px] border border-border/50 bg-background/80 p-6 shadow-honey-sm lg:flex lg:flex-col lg:justify-between">
              <div className="space-y-3 text-sm text-foreground/70">
                <p className="font-semibold uppercase tracking-[0.25em] text-primary/90">Included tools</p>
                <ul className="space-y-2 text-sm leading-relaxed">
                  <li>✔️ Crop-specific voice chat support</li>
                  <li>✔️ Photo disease detection</li>
                  <li>✔️ Guided inventory ledger</li>
                  <li>✔️ Seasonal weather briefings</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-xs text-foreground/60">
                No hidden fees. Cancel anytime. Accessible on mobile networks in rural regions.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
