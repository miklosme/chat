import React from 'react'
import { Chat } from '@/components/chat'
import { db, threads } from '@/db'
import { sql, desc } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Thread() {
  const user = await currentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const lastThread = await db
    .select({
      id: threads.id,
    })
    .from(threads)
    .where(
      sql`${threads.ownerId} = ${user.id} AND ${threads.deletedAt} IS NULL`,
    )
    .orderBy(desc(threads.updatedAt))
    .limit(1)

  if (lastThread.length === 0) {
    redirect('/')
    return
  }

  redirect(`/thread/${lastThread[0]!.id}`)
}
