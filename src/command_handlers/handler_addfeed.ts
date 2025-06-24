import { createFeed, type Feed } from '../lib/db/queries/feeds'
import { createFeedFollow } from '../lib/db/queries/user_feed'
import { type User } from '../lib/db/queries/users'

async function handlerAddFeed(user: User, ...args: string[]) {
  try {
    if (args.length < 1) {
      throw new Error('Missing feed name and url')
    }
    if (args.length === 1) {
      throw new Error('Mising feed url')
    }
    const [name, url] = args
    const feed = await createFeed(name, url, user.id)
    await createFeedFollow(user.id, feed.id)
    printFeed(user, feed)
  } catch (error) {
    console.error('Adding new feed failed:', error)
    process.exit(1)
  }
}

function printFeed(user: User, feed: Feed) {
  console.log(user)
  console.log(feed)
}

export default handlerAddFeed
