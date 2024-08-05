import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { convertToCoreMessages, streamText } from 'ai';
import { currentUser } from '@clerk/nextjs/server';
import { AI_MODELS } from '@/lib/models';
import { db, threads } from '@/db';
import { eq, and } from 'drizzle-orm';
import { createId } from '@/lib/id';
import { z } from 'zod';

export const maxDuration = 60;

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
      id: z.string().optional(),
    }),
  ),
  model: z.string().refine((m) => AI_MODELS.find((model) => model.id === m) !== undefined),
  threadId: z.string(),
});

export async function POST(req: Request) {
  let body 
  try {
    body = requestSchema.parse(await req.json())
  }
  catch (e) {
    return new Response('Bad Request', { status: 400 });
  }

  const { messages, model, threadId } = body;

  const user = await currentUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const vendor = AI_MODELS.find((m) => m.id === model)!.vendor;

  const provider = vendor === 'OpenAI' ? openai : anthropic;

  const updatedThread = await db
    .update(threads)
    .set({ messages, updatedAt: new Date() })
    .where(
      and(
        eq(threads.id, threadId),
        // this validates ownership
        eq(threads.ownerId, user.id),
      ),
    )
    .returning({ id: threads.id });

  if (updatedThread.length !== 1) {
    return new Response('Thread not found', { status: 404 });
  }

  const result = await streamText({
    model: provider(model),
    messages: convertToCoreMessages(messages),
    onFinish: async (resp) => {
      const result = {
        role: 'assistant',
        content: resp.text,
      };

      const newMessages = [...messages, result].map((m) => ({
        ...m,
        id: m.id || createId('msg'),
      }));

      await db.update(threads).set({ messages: newMessages, updatedAt: new Date() }).where(eq(threads.id, threadId));
    },
  });

  return result.toDataStreamResponse();
}
