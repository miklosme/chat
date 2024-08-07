'use server'

import { currentUser } from '@clerk/nextjs/server'
import { db, threads } from '@/db'
import { sql, desc } from 'drizzle-orm'
import { isToday, isYesterday, differenceInDays, format } from 'date-fns'

function makeTimeLabel(date: Date) {
  if (isToday(date)) {
    return 'Today'
  }

  if (isYesterday(date)) {
    return 'Yesterday'
  }

  const daysAgo = differenceInDays(new Date(), date)

  if (daysAgo < 7) {
    return 'Previous 7 Days'
  }

  if (daysAgo < 30) {
    return 'Previous 30 Days'
  }

  return format(date, 'MMM yyyy')
}

export async function getThreads() {
  const user = await currentUser()
  const data = await db
    .select({
      id: threads.id,
      title: threads.title,
      updatedAt: threads.updatedAt,
    })
    .from(threads)
    .where(
      sql`${threads.ownerId} = ${user!.id} AND ${threads.deletedAt} IS NULL`,
    )
    .orderBy(desc(threads.updatedAt))

  const threadsData = data.map((thread) => ({
    ...thread,
    timeLabel: makeTimeLabel(thread.updatedAt),
  }))

  return threadsData
}
