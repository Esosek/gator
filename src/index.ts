import { argv } from 'node:process'

import { CommandsRegistry, runCommand } from './commands'
import handlerLogin from './command_handlers/handler_login'
import handlerRegister from './command_handlers/handler_register'
import handlerReset from './command_handlers/handler_reset'
import handlerUsers from './command_handlers/handler_users'

const commandsRegistry: CommandsRegistry = {
  login: handlerLogin,
  register: handlerRegister,
  reset: handlerReset,
  users: handlerUsers
}

async function main() {
  const [cmdName, ...cmdArgs] = argv.slice(2)
  if (!cmdName) {
    console.error('Please, provide more arguments.')
    process.exit(1)
  }
  await runCommand(commandsRegistry, cmdName, ...cmdArgs)
  process.exit(0)
}

main()
