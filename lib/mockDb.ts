// lib/mockDb.ts

export type AudienceDemographic = 'College Students' | 'Young Professionals' | 'Teens' | 'Founders' | 'Seniors';
export type ClubCategory = 'Tech' | 'Fitness' | 'Gaming' | 'Business' | 'Arts';
export type PricingTier = 'Tier 1 (Enterprise)' | 'Tier 2 (Growth)' | 'Tier 3 (Starter)';

export interface Club {
    id: string;
    name: string;
    category: ClubCategory;
    audience: AudienceDemographic;
    memberCount: number;
    averageEngagementRate: string; // Brands love this metric
    pricingTier: PricingTier;
    description: string;
}

// 1. The Club Database
export const clubsDb: Club[] = [
    {
        id: 'club_001',
        name: 'Boston Tech Innovators',
        category: 'Tech',
        audience: 'College Students',
        memberCount: 850,
        averageEngagementRate: '68%',
        pricingTier: 'Tier 2 (Growth)',
        description: 'A highly active community of computer science students and hackathon enthusiasts across Boston universities.'
    },
    {
        id: 'club_002',
        name: 'Downtown Run Collective',
        category: 'Fitness',
        audience: 'Young Professionals',
        memberCount: 2200,
        averageEngagementRate: '85%',
        pricingTier: 'Tier 1 (Enterprise)',
        description: 'The largest post-work run club in the city. Members frequently buy premium running gear and attend social mixers.'
    },
    {
        id: 'club_003',
        name: 'Northeast Smash Bros League',
        category: 'Gaming',
        audience: 'Teens',
        memberCount: 450,
        averageEngagementRate: '92%',
        pricingTier: 'Tier 3 (Starter)',
        description: 'Weekly Super Smash Bros tournaments. Highly engaged Discord community with weekly live streams.'
    },
    {
        id: 'club_004',
        name: 'Future Founders Guild',
        category: 'Business',
        audience: 'Founders',
        memberCount: 150,
        averageEngagementRate: '45%',
        pricingTier: 'Tier 2 (Growth)',
        description: 'An exclusive club for early-stage startup founders. High-net-worth potential, focused on B2B SaaS and networking.'
    },
    {
        id: 'club_005',
        name: 'City Canvas Painters',
        category: 'Arts',
        audience: 'Young Professionals',
        memberCount: 600,
        averageEngagementRate: '55%',
        pricingTier: 'Tier 3 (Starter)',
        description: 'Weekend watercolor and acrylic painting club. Members are highly receptive to art supply and lifestyle brands.'
    }
];

// 2. The Sponsorship Pricing & Deliverables
// This maps to the tiers above so the agent can accurately quote brands.
export const pricingDb: Record<PricingTier, any> = {
    'Tier 1 (Enterprise)': {
        dedicatedEmail: '$1,500',
        newsletterFeature: '$800',
        inPersonEventBooth: '$3,000',
        minimumSpend: '$2,000' // Useful for the agent to know when filtering low-budget brands
    },
    'Tier 2 (Growth)': {
        dedicatedEmail: '$600',
        newsletterFeature: '$300',
        inPersonEventBooth: '$1,000',
        minimumSpend: '$500'
    },
    'Tier 3 (Starter)': {
        dedicatedEmail: '$200',
        newsletterFeature: '$100',
        inPersonEventBooth: 'Not available for this tier',
        minimumSpend: '$100'
    }
};