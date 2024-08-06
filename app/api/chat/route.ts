import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google';
import { convertToCoreMessages, streamText, generateText, StreamData, type Message } from 'ai';
import { currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { AI_MODELS } from '@/lib/models';
import { db, threads } from '@/db';
import { eq, and } from 'drizzle-orm';
import { createId } from '@/lib/id';
import { z } from 'zod';

export const maxDuration = 60;

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
        id: z
          .string()
          .optional()
          .transform((v) => v || createId('msg'))
          .pipe(z.string()),
        annotations: z.array(z.any()).optional(),
      }),
    )
    .min(1),
  model: z.string().refine((m) => AI_MODELS.find((model) => model.id === m) !== undefined),
  threadId: z.string().optional(),
});

export async function POST(req: Request) {
  let body;
  try {
    body = requestSchema.parse(await req.json());
  } catch (e) {
    return new Response('Bad Request', { status: 400 });
  }

  const { messages, model } = body;

  const user = await currentUser();

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const data = new StreamData();

  let threadId: string | undefined = body.threadId;

  if (!threadId) {
    const newThread = await db
      .insert(threads)
      .values({
        title: 'New Thread',
        messages,
        ownerId: user.id,
      })
      .returning({ id: threads.id });

    threadId = newThread[0]!.id;

    data.append({ threadId });

    void generateText({
      model: openai('gpt-4o-mini'),
      prompt: `
Summarize the conversation in this thread.
Use only a few words.
Don't use punctuation at the end.
This is the first message:
===
${messages[0]!.content}`.trim(),
    }).then(async ({ text: title }) => {
      await db.update(threads).set({ title }).where(eq(threads.id, threadId!));

      revalidatePath('/', 'layout');
    });
  }

  await data.close();

  const vendor = AI_MODELS.find((m) => m.id === model)!.vendor;

  const provider = vendor === 'OpenAI' ? openai : vendor === 'Anthropic' ? anthropic : google;

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
    system: `You are an experienced litigation lawyer working at a law firm. Use professional language and tone, don't use emojis or slang.`,
    messages: convertToCoreMessages(messages),
    onFinish: async (resp) => {
      const result: Message = {
        id: createId('msg'),
        role: 'assistant' as const,
        content: resp.text,
        annotations: [{ model }],
      };

      const newMessages: Message[] = [...messages, result];

      await db
        .update(threads)
        .set({
          messages: newMessages,
          updatedAt: new Date(),
        })
        .where(eq(threads.id, threadId));
    },
  });

  return result.toDataStreamResponse({ data });
}
