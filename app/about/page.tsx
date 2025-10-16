import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Heart, Mic, Image, Package, Sparkles } from 'lucide-react';

const pillars = [
  {
    icon: Heart,
    title: 'Respect every farmer’s intuition',
    description:
      'FarmGuide is designed as a calm co-pilot—never replacing your wisdom, always extending it with clear reminders and timely nudges.',
  },
  {
    icon: Sparkles,
    title: 'Translate science into everyday language',
    description:
      'We pair agronomic research with local phrasing and Hindi support so families can learn together without jargon getting in the way.',
  },
  {
    icon: Sprout,
    title: 'Build resilient harvests',
    description:
      'FarmGuide stores observations, weather notes, and inventory actions—so patterns reveal themselves and the land stays nourished year after year.',
  },
];

const capabilities = [
  {
    title: 'Voice-first mentoring',
    icon: Mic,
    content:
      'Naturally describe crop issues in Hindi or English and receive structured routines, soil-friendly remedies, and preventive measures you can action the same day.',
  },
  {
    title: 'Photo intelligence',
    icon: Image,
    content:
      'Upload snapshots from the field to detect disease signals, nutrient gaps, or pest trails before they spread through your acreage.',
  },
  {
    title: 'Inventory harmony',
    icon: Package,
    content:
      'Keep fertiliser, seed, and equipment stock balanced with voice-log entries that translate instantly into simple ledgers and reminders.',
  },
];

export default function AboutPage() {
  return (
    <div className="relative isolate min-h-screen bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-36 right-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-secondary/40 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <section className="space-y-6 text-center">
          <span className="inline-flex items-center justify-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-4 w-4" />
            Our story
          </span>
          <h1 className="font-display text-5xl text-foreground sm:text-6xl">
            Crafting a gentle guide for modern Indian farming.
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-foreground/70">
            FarmGuide emerged from countless field visits and chai conversations with families balancing tradition and innovation. We envisioned a companion that listens first, speaks with warmth, and helps every farmer nurture healthier soil, resilient crops, and peaceful harvest seasons.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-card/85">
              <CardContent className="space-y-4 p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="font-display text-2xl text-foreground">{title}</h2>
                <p className="text-sm leading-relaxed text-foreground/70">{description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-8 rounded-[42px] border border-border/60 bg-card/90 p-10 shadow-honey-md">
          <div className="space-y-3 text-center">
            <h2 className="font-display text-4xl text-foreground">How FarmGuide lifts your daily routine</h2>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-foreground/70">
              From dawn field walks to late-evening inventory checks, we simplify the rituals that keep your farm running, so you can focus on nurturing people and produce.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {capabilities.map(({ title, icon: Icon, content }) => (
              <div key={title} className="flex h-full flex-col gap-4 rounded-[30px] border border-primary/15 bg-background/70 p-6 shadow-honey-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-2xl text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">{content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <div className="rounded-[40px] border border-primary/25 bg-gradient-to-br from-primary/15 via-primary/10 to-transparent p-10 shadow-honey-md">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
              <div className="space-y-4">
                <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                  Built with agronomists, language experts, and rural cooperatives.
                </h2>
                <p className="text-sm leading-relaxed text-foreground/70">
                  FarmGuide constantly learns from agronomy specialists and farmer feedback loops. We collaborate with language educators to ensure clarity, cultural respect, and accessible Hindi guidance.
                </p>
                <p className="text-sm leading-relaxed text-foreground/70">
                  The result: a companion that recognises the rhythm of Indian agriculture—aligning sowing calendars, monsoon patterns, and procurement timelines with real-time advice.
                </p>
              </div>
              <div className="rounded-[30px] border border-border/60 bg-background/80 p-6 text-sm leading-relaxed text-foreground/70 shadow-honey-sm">
                <p className="font-display text-2xl text-primary">“FarmGuide listens like a neighbour and plans like an expert. We feel calmer about every decision now.”</p>
                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-foreground/50">Soybean collective · Maharashtra</p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[42px] border border-primary/30 bg-background/80 p-10 text-center shadow-honey-lg">
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            Join thousands of farmers shaping calmer seasons.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-foreground/70">
            Experience thoughtful farming rituals, preventive crop care, and effortless collaboration with your family—all inside one honey-toned workspace.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto">
                Begin your free journey
              </Button>
            </Link>
            <Link href="/diagnose" className="w-full sm:w-auto">
              <Button variant="soft" size="lg" className="w-full sm:w-auto">
                Explore crop diagnosis
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/80 py-8">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs uppercase tracking-[0.3em] text-foreground/40 sm:px-6 lg:px-8">
          © 2025 FarmGuide · Empowering mindful agriculture across India
        </div>
      </footer>
    </div>
  );
}
