import { z } from 'zod';
import { clubsDb } from '@/lib/mockDb';

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
    let results = [...clubsDb];

    if (category) {
      results = results.filter(
        (club) => club.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (audience) {
      results = results.filter(
        (club) => club.audience.toLowerCase() === audience.toLowerCase()
      );
    }

    if (minMembers !== undefined) {
      results = results.filter((club) => club.memberCount >= minMembers);
    }

    if (pricingTier) {
      results = results.filter((club) => club.pricingTier === pricingTier);
    }

    if (results.length === 0) {
      return { found: false, message: 'No clubs found matching those criteria' };
    }

    return { found: true, count: results.length, clubs: results };
  },
};
