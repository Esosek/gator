import { getUsers } from '../lib/db/queries/users'
import { readConfig } from '../config'

async function handlerUsers(cmdName: string) {
  const users = await getUsers()
  const { currentUserName } = await readConfig()
  for (const user of users) {
    const isLoggedIn = currentUserName === user.username
    console.log(`* ${user.username} ${isLoggedIn ? '(current)' : ''}`)
  }
}

export default handlerUsers
