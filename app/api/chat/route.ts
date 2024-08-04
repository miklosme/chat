import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { convertToCoreMessages, streamText } from 'ai';
import { AI_MODELS } from '@/lib/models';
import { db, threads } from '@/db';
import { eq, n } from 'drizzle-orm';
import { createId } from '@/lib/id';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, model, threadId } = await req.json();

  // TODO validate thread ownership

  if (!messages || !model) {
    return new Response('Missing messages or model', { status: 400 });
  }

  if (!AI_MODELS.find((m) => m.id === model)) {
    return new Response('Invalid model', { status: 400 });
  }

  const vendor = AI_MODELS.find((m) => m.id === model)!.vendor;

  const provider = vendor === 'OpenAI' ? openai : anthropic;

  // TODO when refactored, make sure the stream does not wait while this is updating
  // for now it's improtant because the @sidepanel refresh depends on the updatedAt
  await db.update(threads).set({ messages, updatedAt: new Date() }).where(eq(threads.id, threadId));

  const result = await streamText({
    model: provider(model),
    // model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    onFinish: async (data) => {
      const result = {
        role: 'assistant',
        content: data.text,
      };

      const newMessages = [...messages, result].map((m) => ({
        ...m,
        id: m.id || createId('msg'),
      }));

      try {
        await db.update(threads).set({ messages: newMessages, updatedAt: new Date() }).where(eq(threads.id, threadId));

        console.log('Updated thread');
      } catch (e) {
        console.error('onEnd error', [...messages, result], e.message);
      }
    },
  });

  return result.toDataStreamResponse();
}
