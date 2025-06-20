import { getFeed } from '../lib/db/queries/feeds'
import { readConfig } from '../config'
import { createFeedFollow } from '../lib/db/queries/user_feed'
import { getUser, User } from '../lib/db/queries/users'

async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
  if (args.length === 0) {
    console.error('Please provide a feed url.')
    process.exit(1)
  }
  const feedUrl = args[0]
  try {
    const { id: feedId } = await getFeed(feedUrl)
    const feedFollow = await createFeedFollow(user.id, feedId)
    console.log(feedFollow)
  } catch (error) {
    console.error('Following a feed failed.')
    process.exit(1)
  }
}

export default handlerFollow
