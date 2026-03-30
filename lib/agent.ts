import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { CONCIERGE_SYSTEM_PROMPT } from '@/lib/prompts/concierge';
import { searchClubs, getPricing, escalateToHuman } from '@/lib/tools';

// streamText over Agent class because our tool loop is straightforward
// (search, price, respond) with no per-step hooks or branching needed.
export async function runAgent(messages: UIMessage[]) {
  return streamText({
    // Haiku 4.5: fast, cheap, reliable at tool calling. No need for a frontier model here.
    model: 'anthropic/claude-haiku-4.5',
    system: CONCIERGE_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    // Prevents runaway tool loops.
    stopWhen: stepCountIs(4),
    tools: { searchClubs, getPricing, escalateToHuman },
    // Gateway fallback: if Haiku is down, try similarly fast/cheap models.
    providerOptions: {
      gateway: {
        models: ['google/gemini-2.5-flash-lite', 'openai/gpt-4.1-nano'],
      } satisfies GatewayProviderOptions,
    },
  });
}
