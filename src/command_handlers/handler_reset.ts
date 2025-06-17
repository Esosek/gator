import { deleteAllUsers } from '../lib/db/queries/users'

async function handlerReset(cmdName: string) {
  try {
    await deleteAllUsers()
    console.log('All users were deleted.')
  } catch (err) {
    console.log('Deleting all users failed.')
    process.exit(1)
  }
}

export default handlerReset
