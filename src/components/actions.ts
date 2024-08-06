'use server';

import { db, threads } from '@/db';
import { eq } from 'drizzle-orm';

export async function deleteThread({ threadId, onClose }: { threadId: string; onClose: () => void }) {
  console.log('deleteThread', { threadId });
  await db.update(threads).set({ deletedAt: new Date() }).where(eq(threads.id, threadId));
  onClose();
}
