import { setUser } from '../config'
import { createUser } from '../lib/db/queries/users'

async function handlerRegister(cmdName: string, ...args: string[]) {
  if (!args.length) {
    console.error('Please provide a username.')
    process.exit(1)
  }
  try {
    const username = args[0]
    const user = await createUser(username)
    await setUser(user.name)
    console.log('User ' + user.name + ' was created.')
    console.log(user)
  } catch (err) {
    console.log('Registering a new user failed.')
    process.exit(1)
  }
}

export default handlerRegister
