import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ClubPack — Sponsor College Clubs That Actually Reach Your Audience',
  description:
    'ClubPack connects brands with high-engagement college clubs. Find the right clubs, get pricing instantly, and launch campaigns that convert.',
};

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="8" />
        <path d="M6.5 10.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Instant club matching',
    description:
      'Describe your brand and campaign goals. Our AI concierge searches the ClubPack database and surfaces the best-fit clubs in seconds.',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="14" height="10" rx="2" />
        <path d="M3 8h14" strokeLinecap="round" />
      </svg>
    ),
    title: 'Live pricing, no surprises',
    description:
      'Get accurate sponsorship rates for any club on the spot. No forms, no waiting — just ask and receive a clear quote with minimum spend.',
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 3v14M3 10h14" strokeLinecap="round" />
      </svg>
    ),
    title: 'Human handoff when it matters',
    description:
      'High-value deals and custom requests are automatically routed to our sales team. You talk to a human the moment it makes sense.',
  },
];

const STATS = [
  { value: '400+', label: 'Active clubs' },
  { value: '2M+', label: 'Student members' },
  { value: '85%', label: 'Avg. engagement rate' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <Image
          src="/clubpack-logo-full.png"
          alt="ClubPack"
          width={159}
          height={24}
          priority
        />
        <Link
          href="/chat"
          className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
        >
          Open Advisor →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 pt-24 pb-20 max-w-3xl mx-auto">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-6">
          B2B Sponsor Concierge
        </span>
        <h1 className="text-5xl font-semibold tracking-tight leading-tight mb-6">
          Sponsor college clubs that actually reach your audience
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl">
          ClubPack matches brands with high-engagement student clubs. Describe your campaign,
          get matched, get pricing — all in one conversation.
        </p>
        <Link
          href="/chat"
          className="px-7 py-3.5 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-80 transition-opacity"
        >
          Find clubs now
        </Link>
      </section>

      {/* Stats */}
      <section className="border-y border-border py-12">
        <div className="max-w-3xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-semibold tracking-tight mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-foreground">
              {f.icon}
            </div>
            <h3 className="font-medium text-sm">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-24 text-center">
        <h2 className="text-3xl font-semibold tracking-tight mb-4">
          Ready to find your clubs?
        </h2>
        <p className="text-muted-foreground text-base mb-8 max-w-sm mx-auto">
          Start a conversation with our AI concierge. No forms. No sales calls to schedule.
        </p>
        <Link
          href="/chat"
          className="px-7 py-3.5 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-80 transition-opacity"
        >
          Open the advisor
        </Link>
      </section>

    </main>
  );
}
