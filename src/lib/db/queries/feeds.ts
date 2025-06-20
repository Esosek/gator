import { eq } from 'drizzle-orm'
import { db } from '..'
import { feeds, users } from '../schema'

export type Feed = typeof feeds.$inferSelect

export async function createFeed(name: string, url: string, userId: string) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning()
  return result
}

export async function getFeeds() {
  const result = await db
    .select({ name: feeds.name, url: feeds.url, user: users.name })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id))
  return result
}
