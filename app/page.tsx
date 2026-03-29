import type { Metadata } from 'next';
import Image from 'next/image';
import { sanity } from '@/lib/sanity';
import { cacheLife, cacheTag } from 'next/cache';
import { saveLead } from '@/app/actions/saveLead';
import { LeadSuccess } from '@/components/LeadSuccess';

export const metadata: Metadata = {
  title: 'ClubPack: Sponsor College Clubs That Actually Reach Your Audience',
  description:
    'ClubPack connects brands with high-engagement college clubs. Find the right clubs, get pricing instantly, and launch campaigns that convert.',
};

const FEATURE_ICONS = [
  <svg key="match" className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="10" cy="10" r="8" />
    <path d="M6.5 10.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  <svg key="pricing" className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="5" width="14" height="10" rx="2" />
    <path d="M3 8h14" strokeLinecap="round" />
  </svg>,
  <svg key="handoff" className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M10 3v14M3 10h14" strokeLinecap="round" />
  </svg>,
];

const FALLBACK = {
  heroEyebrow: 'B2B Sponsor Concierge',
  heroHeadline: 'Sponsor college clubs that actually reach your audience',
  heroSubtitle: 'ClubPack matches brands with high-engagement student clubs. Describe your campaign, get matched, get pricing, all in one conversation.',
  heroCta: 'Find clubs now',
  stats: [
    { value: '400+', label: 'Active clubs' },
    { value: '2M+', label: 'Student members' },
    { value: '85%', label: 'Avg. engagement rate' },
  ],
  features: [
    { title: 'Instant club matching', description: 'Describe your brand and campaign goals. Our AI concierge searches the ClubPack database and surfaces the best-fit clubs in seconds.' },
    { title: 'Live pricing, no surprises', description: 'Get accurate sponsorship rates for any club on the spot. No forms, no waiting: just ask and receive a clear quote with minimum spend.' },
    { title: 'Human handoff when it matters', description: 'High-value deals and custom requests are automatically routed to our sales team. You talk to a human the moment it makes sense.' },
  ],
  ctaHeading: 'Ready to find your clubs?',
  ctaSubtitle: 'Start a conversation with our AI concierge. No forms. No sales calls to schedule.',
  ctaButton: 'Open the advisor',
};

export default async function Home() {
  'use cache';
  cacheLife('hours');
  cacheTag('landing-page');

  const cms = await sanity
    .fetch(`*[_type == "landingPage"][0]`)
    .catch(() => null);

  const page = cms ?? FALLBACK;

  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="flex items-center px-6 py-5 max-w-5xl mx-auto">
        <Image
          src="/clubpack-logo-full.png"
          alt="ClubPack"
          width={159}
          height={24}
          priority
        />
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-24 pb-20 max-w-3xl mx-auto">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          {page.heroEyebrow}
        </span>
        <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6">
          {page.heroHeadline}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl">
          {page.heroSubtitle}
        </p>
        <form action={saveLead} className="flex gap-2 w-full max-w-sm">
          <input type="hidden" name="redirectTo" value="/chat" />
          <input
            name="email"
            type="email"
            required
            placeholder="your@brand.com"
            className="flex-1 px-4 py-3 text-sm rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            {page.heroCta}
          </button>
        </form>
      </section>

      {/* Stats */}
      <section className="border-y border-border py-12">
        <div className="max-w-3xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {page.stats?.map((s: { value: string; label: string }) => (
            <div key={s.label}>
              <p className="text-3xl font-semibold tracking-tight mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
        {page.features?.map((f: { title: string; description: string }, i: number) => (
          <div key={f.title} className="flex flex-col gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-foreground">
              {FEATURE_ICONS[i % FEATURE_ICONS.length]}
            </div>
            <h3 className="font-medium text-sm">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
          {page.ctaHeading}
        </h2>
        <p className="text-muted-foreground text-base mb-6 max-w-sm mx-auto">
          {page.ctaSubtitle}
        </p>

        <LeadSuccess />
        <form action={saveLead} className="flex justify-center gap-2 mb-6 max-w-sm mx-auto">
          <input
            name="email"
            type="email"
            required
            placeholder="your@brand.com"
            className="flex-1 px-4 py-2.5 text-sm rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/30 transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            {page.ctaButton}
          </button>
        </form>

      </section>

    </main>
  );
}
