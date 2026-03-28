import { z } from 'zod';
import { getSql } from '@/lib/db';

export const getPricing = {
  description: 'Fetch accurate sponsorship pricing for a specific club by its ID.',
  inputSchema: z.object({
    clubId: z
      .string()
      .describe('The id of the club to get pricing for (e.g. "club_001")'),
  }),
  execute: async ({ clubId }: { clubId: string }) => {
    const sql = getSql();
    const rows = await sql`
      SELECT c.id, c.name, c.pricing_tier,
             p.dedicated_email, p.newsletter_feature,
             p.in_person_event_booth, p.minimum_spend
      FROM clubs c
      JOIN pricing p ON p.tier = c.pricing_tier
      WHERE c.id = ${clubId}
    `;

    if (rows.length === 0) {
      return { found: false, message: 'Club not found with that ID' };
    }

    const row = rows[0];

    return {
      found: true,
      clubName: row.name,
      pricingTier: row.pricing_tier,
      pricing: {
        dedicatedEmail: row.dedicated_email,
        newsletterFeature: row.newsletter_feature,
        inPersonEventBooth: row.in_person_event_booth,
        minimumSpend: row.minimum_spend,
      },
      minimumSpend: row.minimum_spend,
    };
  },
};
