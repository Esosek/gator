import { getUsers } from '../lib/db/queries/users'
import { readConfig } from '../config'

async function handlerUsers(cmdName: string) {
  try {
    const users = await getUsers()
    if (!users.length) {
      console.log('No users found.')
      process.exit(1)
    }
    const { currentUserName } = await readConfig()
    for (const user of users) {
      const isLoggedIn = currentUserName === user.username
      console.log(`* ${user.username} ${isLoggedIn ? '(current)' : ''}`)
    }
  } catch (error) {
    console.error('Fetching users failed.')
  }
}

export default handlerUsers
