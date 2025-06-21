import { eq } from 'drizzle-orm'
import { db } from '..'
import { feeds, users } from '../schema'

export type Feed = typeof feeds.$inferSelect

export async function createFeed(name: string, url: string, userId: string) {
  try {
    const [result] = await db
      .insert(feeds)
      .values({ name, url, userId })
      .returning()
    return result
  } catch (error) {
    throw new Error('Creating new feed failed')
  }
}

export async function getFeed(feedUrl: string) {
  try {
    const [feed] = await db.select().from(feeds).where(eq(feeds.url, feedUrl))
    return feed
  } catch (error) {
    throw new Error('Reading a single feed from db failed')
  }
}

export async function getFeeds() {
  try {
    const result = await db
      .select({ name: feeds.name, url: feeds.url, user: users.name })
      .from(feeds)
      .innerJoin(users, eq(feeds.userId, users.id))
    return result
  } catch (error) {
    throw new Error('Reading feeds from db failed')
  }
}
