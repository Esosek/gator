import { deleteAllUsers } from '../lib/db/queries/users'

async function handlerReset(cmdName: string) {
  try {
    await deleteAllUsers()
    console.log('All users were deleted.')
  } catch (error) {
    console.error('Reseting db failed:', error)
    process.exit(1)
  }
}

export default handlerReset
