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
    const { currentUserName } = await readConfig()
    const user = await getUser(currentUserName)
    if (!user) {
      console.error('User not logged in')
      process.exit(1)
    }
    await handler(cmdName, user, ...args)
  }
}

export const commandsRegistry: CommandsRegistry = {}
registerCommand(commandsRegistry, 'login', handlerLogin)
registerCommand(commandsRegistry, 'register', handlerRegister)
registerCommand(commandsRegistry, 'reset', handlerReset)
registerCommand(commandsRegistry, 'users', handlerUsers)
registerCommand(commandsRegistry, 'agg', handlerAgg)
registerCommand(commandsRegistry, 'addfeed', middlewareLoggedIn(handlerAddFeed))
registerCommand(commandsRegistry, 'feeds', handlerFeeds)
registerCommand(commandsRegistry, 'follow', middlewareLoggedIn(handlerFollow))
registerCommand(
  commandsRegistry,
  'following',
  middlewareLoggedIn(handlerFollowing)
)

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
