import { z } from 'zod';

export const escalateToHuman = {
  description:
    'Escalate the conversation to a human sales rep. Use when budget exceeds $5,000, the brand wants something custom, the brand is frustrated, the request is out of scope, or you lack enough information to help.',
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
  execute: async ({
    reason,
    brandName,
    budget,
    summary,
  }: {
    reason: string;
    brandName?: string;
    budget?: number;
    summary: string;
  }) => {
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
};
