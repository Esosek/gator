import { getFeed } from '../lib/db/queries/feeds'
import { createFeedFollow } from '../lib/db/queries/user_feed'
import { User } from '../lib/db/queries/users'

async function handlerFollow(user: User, ...args: string[]) {
  try {
    if (args.length === 0) {
      throw new Error('Missing feed url')
    }
    const feedUrl = args[0]
    const { id: feedId } = await getFeed(feedUrl)
    const feedFollow = await createFeedFollow(user.id, feedId)
    console.log(feedFollow)
  } catch (error) {
    console.error('Following a feed failed:', error)
    process.exit(1)
  }
}

export default handlerFollow
