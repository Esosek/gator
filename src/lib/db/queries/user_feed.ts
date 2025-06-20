import { eq } from 'drizzle-orm'
import { db } from '..'
import { feedFollows, users, feeds } from '../schema'

export async function createFeedFollow(userId: string, feedId: string) {
  const [feedFollow] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning()
  const [result] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      user: users.name,
      feed: feeds.name
    })
    .from(feedFollows)
    .where(eq(feedFollows.id, feedFollow.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .innerJoin(users, eq(feedFollows.userId, users.id))
  return result
}
