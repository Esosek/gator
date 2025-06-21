import { setUser } from '../config'
import { getUser } from '../lib/db/queries/users'

async function handlerLogin(cmdName: string, ...args: string[]) {
  try {
    if (!args.length) {
      throw new Error('Missing user name')
    }
    const username = args[0]
    const user = await getUser(username)
    await setUser(user.name)
    console.log(user.name + ' logged in successfuly.')
  } catch (error) {
    console.error('Logging in user failed:', error)
    process.exit(1)
  }
}

export default handlerLogin
