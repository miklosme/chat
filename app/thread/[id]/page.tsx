import { Chat } from '@/components/chat';
import { Metadata } from 'next';
import { db, threads } from '@/db';
import { sql } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Thread',
};

export default async function Thread({ params }: { params: { id: string } }) {
  const data = await db
    .select({
      id: threads.id,
      messages: threads.messages,
    })
    .from(threads)
    .where(sql`${threads.id} = ${params.id}`);

  const initialMessages = data[0]?.messages as any;

  return <Chat threadId={params.id} initialMessages={initialMessages} />;
}
