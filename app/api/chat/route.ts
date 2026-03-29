import type { UIMessage } from 'ai';
import { runAgent } from '@/lib/agent';

// Streams AI responses back to the client as typed UIMessage parts.
// toUIMessageStreamResponse() is the v6 replacement for toDataStreamResponse().
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const result = await runAgent(messages);
    return result.toUIMessageStreamResponse();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return Response.json({ error: message }, { status: 500 });
  }
}
