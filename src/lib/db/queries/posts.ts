import { eq, desc } from 'drizzle-orm'
import { db } from '..'

import { type Post } from '../../../rss_feed'
import { feedFollows, posts } from '../schema'

export async function createPost(post: Post, feedId: string) {
  try {
    await db
      .insert(posts)
      .values({
        url: post.link,
        title: post.title,
        publishedAt: parseDate(post.pubDate),
        description: post.description,
        feedId
      })
      .onConflictDoNothing()
  } catch (error) {
    console.log(error)
    throw new Error('Creating post in db failed')
  }
}

export async function getPostsForUser(userId: string, limit: number) {
  try {
    const results = await db
      .select()
      .from(posts)
      .leftJoin(feedFollows, eq(posts.feedId, feedFollows.feedId))
      .where(eq(feedFollows.userId, userId))
      .orderBy(desc(posts.publishedAt))
      .limit(limit)
    return results.map((r) => r.posts)
  } catch (error) {
    throw new Error('Getting posts for user in db failed')
  }
}

function parseDate(date: string) {
  try {
    return new Date(date)
  } catch (error) {
    throw new Error('Parsing date from post failed')
  }
}
