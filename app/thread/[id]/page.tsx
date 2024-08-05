import { Chat } from '@/components/chat';
import { db, threads } from '@/db';
import { sql } from 'drizzle-orm';
import { type Message } from 'ai';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data = await db
    .select({
      title: threads.title,
    })
    .from(threads)
    .where(sql`${threads.id} = ${params.id}`);

  return {
    title: data[0]?.title,
  };
}

export default async function Thread({ params }: { params: { id: string } }) {
  const data = await db
    .select({
      id: threads.id,
      messages: threads.messages,
    })
    .from(threads)
    .where(sql`${threads.id} = ${params.id}`);

  const initialMessages = data[0]?.messages as Message[];

  return <Chat threadId={params.id} initialMessages={initialMessages} />;
}
