'use server';

import { currentUser } from '@clerk/nextjs/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { db, threads } from '@/db';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function createNewThread({ messages }: { messages: any[] }) {
  const user = await currentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const newThread = await db
    .insert(threads)
    .values({
      title: 'New Thread',
      messages,
      ownerId: user.id,
    })
    .returning({ id: threads.id });

  const threadId = newThread[0]!.id;

  void generateText({
    model: openai('gpt-4o-mini'),
    prompt: `
Summarize the conversation in this thread.
Use only a few words.
Don't use punctuation at the end.
This is the first message:
===
${messages[0].content}`.trim(),
  }).then(async ({ text: title }) => {
    await db.update(threads).set({ title }).where(eq(threads.id, threadId));
  });

  redirect(`/thread/${threadId}`);
}
