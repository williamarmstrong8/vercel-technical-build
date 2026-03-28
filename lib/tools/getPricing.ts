import { z } from 'zod';
import { clubsDb, pricingDb } from '@/lib/mockDb';

export const getPricing = {
  description: 'Fetch accurate sponsorship pricing for a specific club by its ID.',
  inputSchema: z.object({
    clubId: z
      .string()
      .describe('The id of the club to get pricing for (e.g. "club_001")'),
  }),
  execute: async ({ clubId }: { clubId: string }) => {
    const club = clubsDb.find((c) => c.id === clubId);

    if (!club) {
      return { found: false, message: 'Club not found with that ID' };
    }

    const pricing = pricingDb[club.pricingTier];

    return {
      found: true,
      clubName: club.name,
      pricingTier: club.pricingTier,
      pricing,
      minimumSpend: pricing.minimumSpend,
    };
  },
};
