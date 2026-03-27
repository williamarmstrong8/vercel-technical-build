import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { z } from 'zod';
import { clubsDb, pricingDb } from '@/lib/mockDb';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system:
      'You are a ClubPack Sponsor Concierge. You help brands find the perfect clubs to sponsor on the ClubPack platform. When a brand describes their campaign goals or target audience, use the searchClubs tool to find matching clubs. Present results clearly with club name, member count, engagement rate, and pricing tier. Always be helpful and specific. If no clubs match, say so honestly. When a brand asks about pricing or wants a quote for a specific club, use the getPricing tool with the club\'s id to fetch accurate rates. Always present pricing clearly and mention the minimum spend.' +
      '\n\nYou have a strict budget limit. If a brand mentions a budget over $5,000 or requests anything custom, immediately call escalateToHuman with reason \'high_value_lead\' or \'custom_request\'. Never attempt to negotiate or quote custom deals yourself.' +
      '\n\nIf a brand is hostile, rude, or expresses frustration, immediately call escalateToHuman with reason \'frustrated_user\'. Do not engage with hostility.' +
      '\n\nIf you are asked about anything unrelated to ClubPack sponsorships, call escalateToHuman with reason \'out_of_scope\'.' +
      '\n\nNever hallucinate clubs or pricing that do not exist in the database. If you cannot find what the brand needs, call escalateToHuman with reason \'insufficient_info\'.',
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(4),
    tools: {
      searchClubs: {
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
        }),
        execute: async ({ category, audience, minMembers }) => {
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

          if (results.length === 0) {
            return { found: false, message: 'No clubs found matching those criteria' };
          }

          return { found: true, count: results.length, clubs: results };
        },
      },
      getPricing: {
        description: "Fetch accurate sponsorship pricing for a specific club by its ID.",
        inputSchema: z.object({
          clubId: z
            .string()
            .describe('The id of the club to get pricing for (e.g. "club_001")'),
        }),
        execute: async ({ clubId }) => {
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
      },
      escalateToHuman: {
        description:
          "Escalate the conversation to a human sales rep. Use when budget exceeds $5,000, the brand wants something custom, the brand is frustrated, the request is out of scope, or you lack enough information to help.",
        inputSchema: z.object({
          reason: z
            .enum([
              'high_value_lead',
              'custom_request',
              'frustrated_user',
              'out_of_scope',
              'insufficient_info',
            ])
            .describe('Why the conversation is being escalated'),
          brandName: z
            .string()
            .optional()
            .describe('Name of the brand, if mentioned'),
          budget: z
            .number()
            .optional()
            .describe('Budget mentioned by the brand, if any'),
          summary: z
            .string()
            .describe('One sentence summary of what the brand needs'),
        }),
        execute: async ({ reason, brandName, budget, summary }) => {
          const lead = {
            escalatedAt: new Date().toISOString(),
            reason,
            brandName: brandName ?? 'Unknown',
            budget: budget ?? null,
            summary,
            status: 'pending_human_review',
          };

          console.log('ESCALATION LEAD:', JSON.stringify(lead, null, 2));

          return {
            escalated: true,
            message:
              'I have flagged this for our team and someone will follow up with you shortly.',
            lead,
          };
        },
      },
    },
    providerOptions: {
      gateway: {
        models: ['openai/gpt-5-nano', 'gemini-2.0-flash'],
      } satisfies GatewayProviderOptions,
    },
  });

  return result.toUIMessageStreamResponse();
}
