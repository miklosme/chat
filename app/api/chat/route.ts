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

  const result = await streamText({
    model: provider(model),
    // model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    onFinish: async (data) => {
      const result = {
        id: createId('msg'),
        role: 'assistant',
        content: data.text,
      };

      try {
        await db
          .update(threads)
          .set({ messages: [...messages, result], updatedAt: new Date() })
          .where(eq(threads.id, threadId));

        console.log('Updated thread');
      } catch (e) {
        console.error('onEnd error', [...messages, result], e.message);
      }
    },
  });

  return result.toDataStreamResponse();
}
