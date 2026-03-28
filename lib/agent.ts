import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { CONCIERGE_SYSTEM_PROMPT } from '@/lib/prompts/concierge';
import { searchClubs, getPricing, escalateToHuman } from '@/lib/tools';

export async function runAgent(messages: UIMessage[]) {
  return streamText({
    model: 'anthropic/claude-haiku-4.5',
    system: CONCIERGE_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(4),
    tools: { searchClubs, getPricing, escalateToHuman },
    providerOptions: {
      gateway: {
        models: ['google/gemini-2.5-flash-lite', 'openai/gpt-5.4-nano'],
      } satisfies GatewayProviderOptions,
    },
  });
}
