import { getFeed } from '../lib/db/queries/feeds'
import { deleteFeedFollow } from '../lib/db/queries/user_feed'
import { User } from '../lib/db/queries/users'

async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
  try {
    if (args.length < 1) {
      throw new Error('Missing feed url')
    }
    const feedUrl = args[0]
    const { id: feedId } = await getFeed(feedUrl)
    await deleteFeedFollow(user.id, feedId)
  } catch (error) {
    console.error('Unfollowing feed failed:', error)
  }
}

export default handlerUnfollow
