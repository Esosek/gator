import { eq, and } from 'drizzle-orm'
import { db } from '..'
import { feedFollows, users, feeds } from '../schema'

export async function createFeedFollow(userId: string, feedId: string) {
  try {
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
  } catch (error) {
    throw new Error('Creating feed follow in db failed')
  }
}

export async function deleteFeedFollow(userId: string, feedId: string) {
  try {
    await db
      .delete(feedFollows)
      .where(
        and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId))
      )
    return
  } catch (error) {
    throw new Error('Deleting feed follow fom db failed')
  }
}

export async function getFeedFollowsForUser(userId: string) {
  try {
    const result = await db
      .select({ user: users.name, feed: feeds.name })
      .from(feedFollows)
      .where(eq(feedFollows.userId, userId))
      .innerJoin(users, eq(feedFollows.userId, users.id))
      .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    return result
  } catch (error) {
    throw new Error('Getting feed follow for user from db failed')
  }
}
