import { readConfig } from '../config'
import { getFeedFollowsForUser } from '../lib/db/queries/user_feed'
import { getUser } from '../lib/db/queries/users'

async function handlerFollowing() {
  try {
    const { currentUserName } = await readConfig()
    const { id: userId } = await getUser(currentUserName)
    const userFeedFollows = await getFeedFollowsForUser(userId)
    userFeedFollows.forEach((i) => console.log(i.feed))
  } catch (error) {
    console.error('Listing followed feeds failed.')
    process.exit(1)
  }
}

export default handlerFollowing
