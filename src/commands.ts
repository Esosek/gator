import { getUser, type User } from './lib/db/queries/users'
import { readConfig } from './config'

import handlerAddFeed from './command_handlers/handler_addfeed'
import handlerAgg from './command_handlers/handler_agg'
import handlerFeeds from './command_handlers/handler_feeds'
import handlerFollow from './command_handlers/handler_follow'
import handlerFollowing from './command_handlers/handler_following'
import handlerLogin from './command_handlers/handler_login'
import handlerRegister from './command_handlers/handler_register'
import handlerReset from './command_handlers/handler_reset'
import handlerUsers from './command_handlers/handler_users'
import handlerUnfollow from './command_handlers/handler_unfollow'
import handlerBrowse from './command_handlers/handler_browse'

type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>
type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler
type CommandsRegistry = Record<string, CommandHandler>

const middlewareLoggedIn: middlewareLoggedIn = (
  handler: UserCommandHandler
) => {
  return async (cmdName: string, ...args: string[]) => {
    try {
      const { currentUserName } = await readConfig()
      const user = await getUser(currentUserName)
      if (!user) {
        throw new Error('User not logged in')
      }
      await handler(cmdName, user, ...args)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
}

export const cmdRegistry: CommandsRegistry = {}
registerCommand(cmdRegistry, 'login', handlerLogin)
registerCommand(cmdRegistry, 'register', handlerRegister)
registerCommand(cmdRegistry, 'reset', handlerReset)
registerCommand(cmdRegistry, 'users', handlerUsers)
registerCommand(cmdRegistry, 'agg', handlerAgg)
registerCommand(cmdRegistry, 'addfeed', middlewareLoggedIn(handlerAddFeed))
registerCommand(cmdRegistry, 'feeds', handlerFeeds)
registerCommand(cmdRegistry, 'follow', middlewareLoggedIn(handlerFollow))
registerCommand(cmdRegistry, 'following', middlewareLoggedIn(handlerFollowing))
registerCommand(cmdRegistry, 'unfollow', middlewareLoggedIn(handlerUnfollow))
registerCommand(cmdRegistry, 'browse', middlewareLoggedIn(handlerBrowse))

export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
) {
  const handler = registry[cmdName]
  if (!handler) {
    console.error(`Unknown command: ${cmdName}`)
    process.exit(1)
  }
  await handler(cmdName, ...args)
}

function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
) {
  registry[cmdName] = handler
}
