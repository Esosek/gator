import { getPostsForUser } from '../lib/db/queries/posts'
import { User } from '../lib/db/queries/users'

async function handlerBrowse(user: User, ...args: string[]) {
  try {
    const limit = args[0] ? parseInt(args[0]) : 2
    const posts = await getPostsForUser(user.id, limit)
    posts.forEach((p) => console.log(p.title))
  } catch (error) {
    console.error('Browsing user posts failed:', error)
  }
}

export default handlerBrowse
