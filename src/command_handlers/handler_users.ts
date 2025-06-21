import { getUsers } from '../lib/db/queries/users'
import { readConfig } from '../config'

async function handlerUsers(cmdName: string) {
  try {
    const users = await getUsers()
    if (!users.length) {
      throw new Error('No users found')
    }
    const { currentUserName } = await readConfig()
    for (const user of users) {
      const isLoggedIn = currentUserName === user.username
      console.log(`* ${user.username} ${isLoggedIn ? '(current)' : ''}`)
    }
  } catch (error) {
    console.error('Listing all users failed:', error)
  }
}

export default handlerUsers
