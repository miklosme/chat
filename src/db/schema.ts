import { serial, text, timestamp, pgTable, varchar, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@/lib/id';

export const threads = pgTable('threads', {
  id: varchar('id', { length: 191 + 4 })
    .primaryKey()
    .$defaultFn(() => createId('thr')),
  title: text('title'),
  messages: jsonb('messages').$defaultFn(() => []),
  ownerId: text('owner_id').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
