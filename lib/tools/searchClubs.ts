import { z } from 'zod';
import { getSql } from '@/lib/db';

export const searchClubs = {
  description: "Search the ClubPack database for clubs that match a brand's sponsorship goals.",
  inputSchema: z.object({
    category: z
      .string()
      .optional()
      .describe('Club category: Tech, Fitness, Gaming, Business, or Arts'),
    audience: z
      .string()
      .optional()
      .describe('Target audience: College Students, Young Professionals, Teens, Founders, or Seniors'),
    minMembers: z
      .number()
      .optional()
      .describe('Minimum member count required'),
    pricingTier: z
      .enum(['Tier 1 (Enterprise)', 'Tier 2 (Growth)', 'Tier 3 (Starter)'])
      .optional()
      .describe('Filter clubs by pricing tier. Use "Tier 3 (Starter)" for budgets under $500.'),
  }),
  execute: async ({
    category,
    audience,
    minMembers,
    pricingTier,
  }: {
    category?: string;
    audience?: string;
    minMembers?: number;
    pricingTier?: string;
  }) => {
    const sql  = getSql();
    const cat  = category    ?? null;
    const aud  = audience    ?? null;
    const min  = minMembers  ?? null;
    const tier = pricingTier ?? null;

    const results = await sql`
      SELECT * FROM clubs
      WHERE (${cat}::text  IS NULL OR LOWER(category)   = LOWER(${cat}::text))
        AND (${aud}::text  IS NULL OR LOWER(audience)   = LOWER(${aud}::text))
        AND (${min}::int   IS NULL OR member_count      >= ${min}::int)
        AND (${tier}::text IS NULL OR pricing_tier      = ${tier}::text)
      ORDER BY member_count DESC
    `;

    if (results.length === 0) {
      return { found: false, message: 'No clubs found matching those criteria' };
    }

    return {
      found: true,
      count: results.length,
      clubs: results.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        audience: c.audience,
        memberCount: c.member_count,
        averageEngagementRate: c.average_engagement_rate,
        pricingTier: c.pricing_tier,
        description: c.description,
      })),
    };
  },
};
