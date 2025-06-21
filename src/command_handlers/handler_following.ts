import { getFeedFollowsForUser } from '../lib/db/queries/user_feed'
import { User } from '../lib/db/queries/users'

async function handlerFollowing(cmdName: string, user: User) {
  try {
    const userFeedFollows = await getFeedFollowsForUser(user.id)
    userFeedFollows.forEach((i) => console.log(i.feed))
  } catch (error) {
    console.error('Listing user followed feeds failed:', error)
    process.exit(1)
  }
}

export default handlerFollowing
