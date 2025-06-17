import { setUser } from '../config'
import { getUser } from '../lib/db/queries/users'

async function handlerLogin(cmdName: string, ...args: string[]) {
  if (!args.length) {
    console.error('Please provide a username.')
    process.exit(1)
  }
  try {
    const username = args[0]
    const user = await getUser(username)
    await setUser(user.name)
    console.log(user.name + ' logged in successfuly.')
  } catch (err) {
    console.log('Logging in user failed.')
    process.exit(1)
  }
}

export default handlerLogin
