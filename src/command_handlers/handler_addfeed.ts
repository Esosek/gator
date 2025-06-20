import { createFeed, type Feed } from '../lib/db/queries/feeds'
import { createFeedFollow } from '../lib/db/queries/user_feed'
import { type User } from '../lib/db/queries/users'

async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length < 1) {
    console.error('Please provide a feed name.')
    process.exit(1)
  }
  if (args.length === 1) {
    console.error('Please provide a feed url.')
    process.exit(1)
  }
  try {
    const [name, url] = args
    const feed = await createFeed(name, url, user.id)
    await createFeedFollow(user.id, feed.id)
    printFeed(user, feed)
  } catch (error) {
    console.log(error)
    console.error('Adding new feed failed.')
    process.exit(1)
  }
}

function printFeed(user: User, feed: Feed) {
  console.log(user)
  console.log(feed)
}

export default handlerAddFeed
