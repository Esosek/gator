import { eq, sql } from 'drizzle-orm'
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

export async function markFeedFetched(feedId: string) {
  try {
    await db
      .update(feeds)
      .set({ lastFetchedAt: new Date() })
      .where(eq(feeds.id, feedId))
  } catch (error) {
    throw new Error('Marking feed as fetched in db failed')
  }
}

export async function getNextFeedToFetch(): Promise<Feed> {
  try {
    const [oldestFetchedFeed] = await db
      .select()
      .from(feeds)
      .orderBy(sql`last_fetched_at asc nulls first`)
    return oldestFetchedFeed
  } catch (error) {
    throw new Error('Getting next feed to fetch in db failed')
  }
}
